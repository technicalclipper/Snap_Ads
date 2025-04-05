import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { } from "@metamask/snaps-sdk";
import { Heading,Box,Text,Image, Card} from "@metamask/snaps-sdk/jsx";
import svgIcon from "./final.svg"


export const onTransaction: OnTransactionHandler = async ({
  transaction,
}) => {
  console.log("Transaction detected:", transaction);

  return {
    content: (<Box>
      <Image src={svgIcon}/>
      <Card
        image={svgIcon}
        title="Advertisement"
        value=""
      />
      
      <Heading>New One Inch Token</Heading>
      <Text>very low gas fee ,try it out </Text>
    </Box>)
  };
};
