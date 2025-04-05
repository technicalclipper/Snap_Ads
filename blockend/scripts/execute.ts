import { ethers } from "hardhat";
import { v4 as uuidv4 } from "uuid";
import {
  ENTRYPOINT_ADDRESS,
  FACTORY_ADDRESS,
  SNAPADS_ADDRESS,
  PAYMASTER_ADDRESS,
} from "./addresses";

async function main() {
  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );
  const SnapAds = await ethers.getContractAt("SnapAds", SNAPADS_ADDRESS);

  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const Account = await ethers.getContractFactory("Account");

  const [signer0] = await ethers.getSigners();

  const address0 = await signer0.getAddress();

  console.log("Wallet Address: ", address0);

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  let sender;

  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (error: any) {
    sender = "0x" + error.data.slice(-40);
  }

  const code = await ethers.provider.getCode(sender!);

  if (code !== "0x") {
    initCode = "0x";
  }

  console.log("Smart Account Address: ", sender);

  const registerAdSpotTx = await SnapAds.registerAdSpot(
    ENTRYPOINT_ADDRESS,
    "Signer2 Ad Spot",
    "Spot for signer2 advertisers"
  );
  await registerAdSpotTx.wait();

  // 2) Publish Ad
  const adId = uuidv4(); // unique ad ID

  const publishAdTx = await SnapAds.publishAd(
    adId,
    ENTRYPOINT_ADDRESS,
    "Signer2 Ad Title",
    "Signer2 ad description",
    "https://video.com/signer2",
    {
      value: ethers.parseEther("0.01"), // or whatever minimum is required
    }
  );
  
  await publishAdTx.wait();

  console.log("✅ Ad spot registered and ad published - ", adId);

  const watchedAdTx = await SnapAds.watchAd(adId, sender!);
  const watchedAdReceipt = await watchedAdTx.wait();

  console.log(watchedAdReceipt);
  console.log("✅ Ad watched - ", adId);

  // Sponsored Interaction with any contracts

  const interactionData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "string"],
    [sender, adId]
  );

  console.log("Interaction Data: ");
  console.log(interactionData);

  const userOp = {
    sender: sender!,
    nonce: "0x" + (await entryPoint.getNonce(sender!, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS + interactionData.slice(2),
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  console.log("User Operation");
  console.log(userOp);

  const { preVerificationGas, verificationGasLimit, callGasLimit } =
    await ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      ENTRYPOINT_ADDRESS,
    ]);

  console.log(preVerificationGas);
  console.log(verificationGasLimit);
  console.log(callGasLimit);

  const { maxFeePerGas } = await ethers.provider.getFeeData();

  const maxPriorityFeePerGas = await ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );

  const newUserOp = {
    sender: sender!,
    nonce: "0x" + (await entryPoint.getNonce(sender!, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS + interactionData.slice(2),
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    callGasLimit: callGasLimit,
    preVerificationGas: preVerificationGas,
    verificationGasLimit: verificationGasLimit,
    maxFeePerGas: "0x" + maxFeePerGas?.toString(16),
    maxPriorityFeePerGas: maxPriorityFeePerGas,
  };

  console.log(newUserOp);

  const userOpHash = await entryPoint.getUserOpHash(newUserOp);
  newUserOp.signature = await signer0.signMessage(ethers.getBytes(userOpHash));

  const opHash = await ethers.provider.send("eth_sendUserOperation", [
    newUserOp,
    ENTRYPOINT_ADDRESS,
  ]);

  console.log(opHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function toHex(num: number | bigint) {
  return "0x" + BigInt(num).toString(16);
}
