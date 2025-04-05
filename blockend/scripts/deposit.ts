import { ethers } from "hardhat";

async function main() {
  const ENTRYPOINT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const PAYMASTER_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    ENTRYPOINT_ADDRESS
  );

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("0.2"),
  });

  console.log("Deposit done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
