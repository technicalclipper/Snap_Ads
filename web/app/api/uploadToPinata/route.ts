import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinataConfig";

export async function POST(request: NextRequest) {
  try {
    const { videoBuffer, adID } = await request.json();

    const file = Buffer.from(videoBuffer, "base64");

    const fileObject = new File([file], `${adID}.mp4`, {
      type: "video/mp4",
    });

    const uploadVideoData = await pinata.upload.file(fileObject);

    const videoURL = `https://white-official-scallop-559.mypinata.cloud/ipfs/${uploadVideoData.IpfsHash}`;

    return NextResponse.json(
      {
        cid: uploadVideoData.IpfsHash,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
