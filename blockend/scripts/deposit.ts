import { ethers } from "hardhat";
import { ENTRYPOINT_ADDRESS, PAYMASTER_ADDRESS } from "./addresses";

async function main() {
  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("1"),
  });

  console.log("Deposit done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
