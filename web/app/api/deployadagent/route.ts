import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";

import type { ChatCompletionAssistantMessageParam } from "openai/resources";
import { runToolCalls } from "./base";
import axios from "axios";
import { ethers } from "ethers";

import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  const body = await req.json();
 
  const deployadTool = createTool({
    id: "deployad-tool",
    description: "Deploy an advertisement by sending funds to the platform’s ad spot. The ad details, including advertiser’s address, ad name, description, IPFS video link, and total funds, are provided. Deploy the ad to an available spot on the platform.",
    schema: z.object({
      advertiser: z.string().describe("The address of the advertiser"),
      name: z.string().describe("The name of the ad"),
      description: z.string().describe("A description of the ad"),
      ipfsVideoLink: z.string().describe("IPFS link to the video for the ad"),
      totalFunded: z.string().describe("Total amount of funds provided for the ad"),
    }),
    //@ts-expect-error
    execute: async ({ advertiser, name, description, ipfsVideoLink, totalFunded }) => {
      try {
        
        const chain = 'ethereum'; 
        const addressOrAlias = '0xAe4600e84007d49Cf3f45fFBA57D1EC156EA75cE'; 
        const contract = 'snapads'; 
        const method = 'getAvailableAdSpots';
        const hostname = 'fqzb6ixmnre3xn6d474wfze7z4.multibaas.com'; 

        const url = `https://${hostname}/api/v0/chains/${chain}/addresses/${addressOrAlias}/contracts/${contract}/methods/${method}`;

        console.log('Calling:', url); 

        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MULTIBAAS_API_KEY}`,
          },
          body: JSON.stringify({
            from: '0x103b80411d5907d6741fDDd69E9A7dE254Ab6C11', 
          })
        });
        const data = await resp.json();
       

        const bestAdSpot = await fetch("http://localhost:3000/api/bestadspot", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            adDetails:{
              advertiser: advertiser,
              name: name,
              description: description,
              ipfsVideoLink: ipfsVideoLink,
              totalFunded: totalFunded,
            },
            adspots: data.result.output, 
          })
        });

        const bestadspotaddress=bestAdSpot.json();
        const bestadspotaddress1="0xb00Af0DBECA4Fd92FE858602F523417e919FE94e";

        const chain1 = 'ethereum'; 
        const addressOrAlias1 = '0xAe4600e84007d49Cf3f45fFBA57D1EC156EA75cE'; 
        const contract1 = 'snapads'; 
        const method1 = 'publishAd';
        const hostname1 = 'fqzb6ixmnre3xn6d474wfze7z4.multibaas.com'; 

        const url1 = `https://${hostname1}/api/v0/chains/${chain1}/addresses/${addressOrAlias1}/contracts/${contract1}/methods/${method1}`;

        console.log('Calling:', url1); 

        const resp1 = await fetch(url1, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQzODI5NDk1LCJqdGkiOiJjMjYxYTk3ZS1iNWQxLTQ1YTQtOGJhYS0wZWI2YjFhNzQ3MDgifQ.2HS-EmxcCgBy_dMZh3hBFoZoSyEk_RmsQgPpgrTAivo`,
          },
          body: JSON.stringify({
            args:[bestadspotaddress1,name,description,ipfsVideoLink],
            from: '0x103b80411d5907d6741fDDd69E9A7dE254Ab6C11', 
            value: '1000000000000000',
            signAndSubmit: true,

          })
        });
        

      
          






        return {
          success: true,
          message: `Ad "${name}" ${advertiser} ${ipfsVideoLink} has been successfully deployed to the platform.`,
        };
      } catch (error:any) {
        // Handle errors during deployment
        return {
          success: false,
          message: `Failed to deploy ad "${name}". Error: ${error.message}`,
        };
      }
    },
  });

  const adDeployAgent = new Agent({
    name: "Ad Deploy Agent",
    model: { 
      provider: "OPEN_AI",
      name: "gpt-4o-mini",
    },
    description:
      "You are an AI agent responsible for deploying advertisements on the platform. Your task is to receive ad details, including the advertiser’s address, ad name, description, IPFS video link, and total funds. Once you have received these details, you will use the provided tools to publish the ad to an available ad spot on the platform. Ensure that the ad is correctly deployed and the funds are appropriately transferred for deployment. Your strategic goal is to effectively manage ad deployment while considering gas optimization and platform rules.",
    instructions: [
      "You will receive ad details such as the advertiser’s address, ad name, description, IPFS video link, and the total funds from the advertiser.",
      "Use the available tools to publish the ad to the platform. Ensure that the ad is deployed to an available ad spot and the funds are properly transferred for the ad deployment process.",
      "Confirm that the ad has been successfully deployed and track the transaction status. Report back with the transaction details after deployment.",
      "Optimize gas usage and ensure the deployment follows the platform’s rules and guidelines.",
      "Announce the successful ad deployment and handle any issues or errors that might arise during the process.",
    ],
    tools: {
      "deployad-tool": deployadTool,
    },
  });
  

const state = StateFn.root(adDeployAgent.description);
    state.messages.push(
      user(
        "advertiser address: 0x1234567890abcdef1234567890abcdef12345678, ad name: 'Bru', description: 'This is a cofee ad', IPFS video link: 'ipfs://coffee.bru', total funds: '1000000000000000000'"
        //message!
      )
    );
  
  
    const result = await adDeployAgent.run(state);
    const toolCall = result.messages[
      result.messages.length - 1
    ] as ChatCompletionAssistantMessageParam;
  
    //const toolResponses = await runToolCalls(tools, toolCall?.tool_calls ?? []);
    //console.log(toolCall?.tool_calls); //to see ai called tool
    const toolResponses = await runToolCalls(
      //@ts-expect-error Tools are defined
  
      { "deployad-tool": deployadTool },
      toolCall?.tool_calls ?? []
    ); //map which tool called by ai
    //console.log(toolResponses[0].content);
  
    const response = {
      tool: toolResponses.length > 0 ? toolResponses[0].content : null,
    };
  
    return NextResponse.json({
      result: response.tool,
    });

    
    
 
  }
  


    