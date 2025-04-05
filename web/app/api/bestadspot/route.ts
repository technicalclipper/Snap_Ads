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
    
    // Tool for deploying ad spot
    const bestadspotTool = createTool({
      id: "bestadspot-tool",
      description: "Choose the best ad spot based on description and deploy the ad.",
      schema: z.object({
        selectedAdSpot: z.string().describe("Contract address of the best ad spot"),
      }),
      //@ts-expect-error
      execute: async ({ selectedAdSpot }) => {
        // Placeholder deployment logic
        return {
          success: true,
          message: `Ad deployed to spot: ${selectedAdSpot}`,
        };
      },
    });
  
    const adDeployAgent = new Agent({
      name: "Ad Deploy Agent",
      model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
      },
      description:
        "You will receive a list of available ad spots and ad details. Your job is to use the bestadspot tool to select the most suitable ad spot and pass its contract address to the deployment tool.",
      instructions: [
        "Must call the bestadspot-tool with the contract address of the best ad spot everytime.",
        "You will receive details of the advertisement and a list of available ad spots.",
        "Analyze the ad description and compare it with the ad spot descriptions.",
        "Choose the best ad spot and pass only the contract address of the chosen spot.",
        "Must call the best ad spot tool with the contract address of the best ad spot.",
      ],
      tools: {
        "bestadspot-tool": bestadspotTool,
      },
    });
  
    const state = StateFn.root(adDeployAgent.description);
    state.messages.push(
      user(
        `the first one is the ad details and the second one is the list of available ad spots. Choose the best ad spot and pass only the contract address of the chosen spot.must call the bestadspot-tool with the contract address of the best ad spot.
            adDetails: {
              advertiser: "0x1234567890abcdef1234567890abcdef12345678",
              name: "Oneinch New Token Launch",
              description: "Introducing the new token on oneInch. Don’t miss out on the opportunity to invest early and benefit from exclusive rewards.",
              ipfsVideoLink: "ipfs://Qmdj0F7P74ZmRBNmZ7uX2q8di2XyzA5jmE3zYBzXfhFQG8",
              totalFunded: 5000
            },
            adSpots: [
              {
                contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
                spotName: "Uniswap Homepage Banner",
                description: "Prime position on the Uniswap homepage for high visibility.",
                isAvailable: true
              },
              {
                contractAddress: "0x1234561234561234561234561234561234567890",
                spotName: "OneInch Token Page",
                description: "A spot specifically designed for token promotions on the OneInch platform.",
                isAvailable: true
              },
              {
                contractAddress: "0x9876549876549876549876549876549876543210",
                spotName: "DeFi Trends",
                description: "A banner ad positioned at the top of DeFi news and trends pages.",
                isAvailable: false
              }
            ]
              the bestadspot-tool must be called.
          `
      )
    );
  
    const result = await adDeployAgent.run(state);
    const toolCall = result.messages[result.messages.length - 1] as ChatCompletionAssistantMessageParam;
  
    // Execute the best ad spot selection tool
    const toolResponses = await runToolCalls(
    //@ts-expect-error Tools are defined
      { "bestadspot-tool": bestadspotTool },
      toolCall?.tool_calls ?? []
    );
  
    const response = {
      tool: toolResponses.length > 0 ? toolResponses[0].content : null,
    };
  
    return NextResponse.json({
      result: response.tool,
    });
  }
  