import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import axios from "axios";
import { ethers } from "ethers";
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
    const chain = 'ethereum'; 
  const addressOrAlias = '0xd7FB59972869DdD555012cA7aD54b4b969b33ebd'; 
  const contract = 'sendhi'; 
  const method = 'sendhi';
  const hostname = 'zev7quhwlbbqpgjd5vggxe326i.multibaas.com'; 

  const url = `https://${hostname}/api/v0/chains/${chain}/addresses/${addressOrAlias}/contracts/${contract}/methods/${method}`;

  console.log('Calling:', url); 

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MULTIBAAS_API_KEY}` // Replace with your real token
    },
    body: JSON.stringify({
      signature: 'sendhi(string)', 
      args: ['hello from Multibaas!'], 
      from: '0xa194D0531Fff63326BF39113bc456Cf8646e7422', 
      signAndSubmit: true 
    })
  });

  const data = await resp.json();
  console.log('Response:', data);
}
    