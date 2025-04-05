import { ethers } from "hardhat";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const ENTRYPOINT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const SNAPADS_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const PAYMASTER_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );
  const SnapAds = await ethers.getContractAt("SnapAds", SNAPADS_ADDRESS);

  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const Account = await ethers.getContractFactory("Account");

  const [signer1] = await ethers.getSigners();

  const FACTORY_NONCE = 1;

  const sender = await ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  const address0 = await signer1.getAddress();

  console.log("Wallet Address: ", address0);

  const initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  console.log("Smart Account Address: ", sender);

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("100"),
  });

  const registerAdSpotTx = await SnapAds.registerAdSpot(
    PAYMASTER_ADDRESS,
    "Signer2 Ad Spot",
    "Spot for signer2 advertisers"
  );
  await registerAdSpotTx.wait();

  // 2) Publish Ad
  const adId = uuidv4(); // unique ad ID

  const publishAdTx = await SnapAds.publishAd(
    adId,
    PAYMASTER_ADDRESS,
    "Signer2 Ad Title",
    "Signer2 ad description",
    "https://video.com/signer2",
    {
      value: ethers.parseEther("0.01"), // or whatever minimum is required
    }
  );
  await publishAdTx.wait();

  console.log("✅ Ad spot registered and ad published - ", adId);

  const watchedAdTx = await SnapAds.watchAd(adId, sender);
  const watchedAdReceipt = await watchedAdTx.wait();

  console.log(watchedAdReceipt);
  console.log("✅ Ad watched - ", adId);

  // Sponsored Interaction with any contracts

  const interactionData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "string"],
    [sender, adId]
  );

  const userOp = {
    sender: sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 1_000_000, // 🔼 Increase
    verificationGasLimit: 1_000_000, // 🔼 Increase
    preVerificationGas: 50_000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS + interactionData.slice(2),
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer1.signMessage(ethers.getBytes(userOpHash));

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
