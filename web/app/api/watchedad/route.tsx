import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";

export async function POST(req: NextRequest) {
  const eventQuery = 'adwatched';
  const query = new URLSearchParams({
    offset: '0',
    limit: '10'
  }).toString();
  const hostname = 'zev7quhwlbbqpgjd5vggxe326i.multibaas.com';

  try {
    const resp = await fetch(
      `https://${hostname}/api/v0/queries/${eventQuery}/results?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MULTIBAAS_API_KEY}`, 
        },
      }
    );

    if (!resp.ok) {
      throw new Error(`Error: ${resp.statusText}`);
    }

    const data = await resp.json();
    console.log(data.result);

    return NextResponse.json(
      { result: data.result },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", 
        },
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error },
      {
        status: 500,
      }
    );
  }
}
