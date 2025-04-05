import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Box, Heading, Text, Image, Card, Link } from "@metamask/snaps-sdk/jsx";
import svgIcon from "./final.svg";

// The onTransaction handler
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  console.log("Transaction detected:", transaction);

  // Extract the 'to' address from the transaction
  const toAddress = transaction.to;

  // Send the 'to' address to your API endpoint
  

  // Returning the Snap UI
  return {
    content: (
      <Box>
        <Image src={svgIcon} />
        <Card image={svgIcon} title="Advertisement" value="" />
        <Heading>New One Inch Token</Heading>
        <Text>Very low gas fee, try it out!</Text>
        <Text>
          Watch the Ad at <Link href="https://docs.metamask.io">Coca-Cola</Link>.
        </Text>
      </Box>
    ),
  };
};


export const  getads:any = async() => {
  try {
    const response = await fetch('http://localhost:3000/api/recommendationagent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toAddress: toAddress, // Send the 'to' address as part of the request body
      }),
    });

    const result = await response.json();
    console.log('Recommendation Agent Response:', result);
  } catch (error) {
    console.error('Error sending to API:', error);
  }
}
