import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";

// Handle CORS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Handle actual POST request
export async function POST(req: NextRequest) {
  const body = await req.json();
  const inputAddress = body.toaddress.toLowerCase(); // fix typo here (was toaddress)
  const chain = "ethereum";
  const addressOrAlias = "0xE725334BaC4fecBa0f636B1aEE0586227A894049";
  const contract = "snapads";
  const method = "getAvailableAds";
  const hostname = "fqzb6ixmnre3xn6d474wfze7z4.multibaas.com";

  console.log("entered the api");
  console.log("inputAddress:", inputAddress);

  const url = `https://${hostname}/api/v0/chains/${chain}/addresses/${addressOrAlias}/contracts/${contract}/methods/${method}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MULTIBAAS_API_KEY}`,
    },
    body: JSON.stringify({
      from: "0x103b80411d5907d6741fDDd69E9A7dE254Ab6C11",
    }),
  });

  const data = await resp.json();

  const indices = data.result.output[1] // contract addresses
    .map((addr: string, idx: number) => ({ addr: addr.toLowerCase(), idx }))
    .filter((item: any) => item.addr === inputAddress);

  if (indices.length === 0) {
    return NextResponse.json(
      { error: "No ads found for the given address." },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const randomIndex = indices[Math.floor(Math.random() * indices.length)].idx;

  const randomAd = {
    advertiser: data.result.output[2][randomIndex],     // name
    description: data.result.output[3][randomIndex],    // description
    ipfsLink: data.result.output[4][randomIndex],       // IPFS hash
    funds: data.result.output[5][randomIndex],          // funds
    contractAddress: data.result.output[1][randomIndex] // contract address
  };

    console.log("randomAd:", randomAd);

  return NextResponse.json(
    { result: randomAd },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
