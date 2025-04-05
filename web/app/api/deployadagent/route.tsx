import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
//@ts-expect-error Type exists in the openai package
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
    execute: async ({ advertiser, name, description, ipfsVideoLink, totalFunded }) => {
      try {
        // Logic to deploy the ad on the platform
        // Example: Call a function on the smart contract to deploy the ad
        
  
        // Return the result of the ad deployment
        return {
          success: true,
          message: `Ad "${name}" ${advertiser} ${ipfsVideoLink} has been successfully deployed to the platform.`,
        };
      } catch (error) {
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
        "advertiser address: 0x1234567890abcdef1234567890abcdef12345678, ad name: 'My Ad', description: 'This is a test ad', IPFS video link: 'ipfs://Qm...', total funds: '1000000000000000000'"
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
  


    