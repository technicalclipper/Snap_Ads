import { ethers } from "hardhat";

const ACCOUNT_ADDRESS = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const account = await ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();

  console.log(count);

  const balance = await ethers.provider.getBalance(ACCOUNT_ADDRESS);
  console.log("Smart Account Balance: ", ethers.formatEther(balance));

  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );

  console.log(
    "EntryPoint Balance: ",
    ethers.formatEther(await entryPoint.balanceOf(ACCOUNT_ADDRESS))
  );

  console.log(
    "Paymaster Balance: ",
    ethers.formatEther(await entryPoint.balanceOf(PAYMASTER_ADDRESS))
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
