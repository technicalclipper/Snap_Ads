const hre = require("hardhat");
import { v4 as uuidv4 } from "uuid";

export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const PAYMASTER_ADDRESS = "0x3B5eFb1B95649870C978111b1fE2181059e3cd18";
export const FACTORY_ADDRESS = "0xd8F654436cEF6065d16709f9405999586a07984b";
export const SNAPADS_ADDRESS = "0xBd4Bc4485B62DaB62CD9DF675E44d5aE13780f68";
export const NEW_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

async function main() {
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );
  const SnapAds = await hre.ethers.getContractAt("SnapAds", SNAPADS_ADDRESS);

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const Account = await hre.ethers.getContractFactory("Account");

  const [signer1] = await hre.ethers.getSigners();

  const address0 = await signer1.getAddress();

  console.log("Wallet Address: ", address0);

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  let sender;

  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (error) {
    sender = "0x" + error.data.slice(-40);
  }

  const code = await hre.ethers.provider.getCode(sender);

  if (code !== "0x") {
    initCode = "0x";
  }

  console.log("Smart Account Address: ", sender);

  const registerAdSpotTx = await SnapAds.registerAdSpot(
    NEW_ADDRESS,
    "Signer2 Ad Spot",
    "Spot for signer2 advertisers"
  );
  await registerAdSpotTx.wait();

  // 2) Publish Ad
  const adId = uuidv4(); // unique ad ID

  const publishAdTx = await SnapAds.publishAd(
    adId,
    NEW_ADDRESS,
    "Signer2 Ad Title",
    "Signer2 ad description",
    "https://video.com/signer2",
    {
      value: hre.ethers.parseEther("0.01"), // or whatever minimum is required
    }
  );
  await publishAdTx.wait();

  console.log("✅ Ad spot registered and ad published - ", adId);

  const watchedAdTx = await SnapAds.watchAd(adId, sender);
  const watchedAdReceipt = await watchedAdTx.wait();

  console.log(watchedAdReceipt);
  console.log("✅ Ad watched - ", adId);

  // Sponsored Interaction with any contracts

  const interactionData = hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "string"],
    [sender, adId]
  );

  const userOp = {
    sender: sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS + interactionData.slice(2),
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const { preVerificationGas, verificationGasLimit, callGasLimit } =
    await hre.ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      ENTRYPOINT_ADDRESS,
    ]);

  console.log(preVerificationGas);
  console.log(verificationGasLimit);
  console.log(callGasLimit);

  //@ts-expect-error
  userOp.callGasLimit = callGasLimit;
  //@ts-expect-error

  userOp.verificationGasLimit = verificationGasLimit;
  //@ts-expect-error

  userOp.preVerificationGas = preVerificationGas;

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData();

  //@ts-expect-error
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await hre.ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );

  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer1.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [
    userOp,
    ENTRYPOINT_ADDRESS,
  ]);

  setTimeout(async () => {
    const { transactionHash } = await hre.ethers.provider.send(
      "eth_getUserOperationByHash",
      [opHash]
    );

    console.log(transactionHash);
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
