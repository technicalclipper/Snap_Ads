import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import axios from "axios";
import { ethers } from "ethers";
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  

 
    const eventQuery = 'publishad';
    const query = new URLSearchParams({
      offset: '0',
      limit: '10'
    }).toString();
    const hostname = 'zev7quhwlbbqpgjd5vggxe326i.multibaas.com';
    const resp = await fetch(
      `https://${hostname}/api/v0/queries/${eventQuery}/results?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQzNzU5NTIwLCJqdGkiOiIyNWMyNDlmNS1kNTdkLTRjZWYtYjNlMy00YTg5ZmU2NzljYjUifQ.--O93RgkXL1pXPgMr0zAEmGEP5KdNXjdFiGuR1AilIc'
        }
      }
    );
  
    const data = await resp.json();
    console.log(data.result);
  }
  


    