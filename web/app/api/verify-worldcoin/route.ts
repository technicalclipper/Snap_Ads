import { NextResponse } from "next/server";
import { verifyIDKitProof } from "@worldcoin/idkit/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await verifyIDKitProof({
      signal: body.signal ?? "",
      proof: body.proof,
      merkle_root: body.merkle_root,
      nullifier_hash: body.nullifier_hash,
      app_id: process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`,
      action: process.env.NEXT_PUBLIC_WLD_ACTION ?? "",
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, detail: "Invalid proof" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      { success: false, detail: "Error verifying proof" },
      { status: 500 }
    );
  }
}
