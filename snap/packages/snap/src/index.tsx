import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { } from "@metamask/snaps-sdk";
import { Heading,Box,Text,Image} from "@metamask/snaps-sdk/jsx";



export const onTransaction: OnTransactionHandler = async ({
  transaction,
}) => {
  console.log("Transaction detected:", transaction);

  return {
    content: (<Box>
      <Heading>Hello world!</Heading>
      <Text>Namma thaa Finalist </Text>
    </Box>)
  };
};
