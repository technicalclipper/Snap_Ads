import { ethers } from "hardhat";
import { ENTRYPOINT_ADDRESS, PAYMASTER_ADDRESS } from "./addresses";

async function main() {
  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );

  await entryPoint.addStake(1000, {
    value: ethers.parseEther("0.3"),
  });

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("0.1"),
  });

  console.log("Deposit done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
