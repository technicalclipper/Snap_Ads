import { ethers } from "hardhat";

async function main() {
  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const AccountFactory = await ethers.getContractFactory("AccountFactory");

  const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const FACTORY_NONCE = 1;

  const Account = await ethers.getContractFactory("Account");

  const sender = await ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  const [signer1] = await ethers.getSigners();
  const address0 = await signer1.getAddress();

  const initCode = "0x";
  // FACTORY_ADDRESS +
  // AccountFactory.interface
  //   .encodeFunctionData("createAccount", [address0])
  //   .slice(2);

  console.log("Sender Address: ", sender);

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("100"),
  });

  const userOp = {
    sender: sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: "0x",
  };

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
