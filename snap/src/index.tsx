import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { } from "@metamask/snaps-sdk";
import { Heading,Box,Text,Image} from "@metamask/snaps-sdk/jsx";
import svgIcon from "./images/images.png";


export const onTransaction: OnTransactionHandler = async ({
  transaction,
}) => {
  console.log("Transaction detected:", transaction);

  return {
    content: (<Box>
      <Heading>Hello world!</Heading>
      <Text>Namma thaa Finalist </Text>
      <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPuAf-qIiiJdjHeQCjfjBqTeOwtQtVZ9IVKw&s" />
    </Box>),
  };
};
