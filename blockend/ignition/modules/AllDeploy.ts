import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AllDeployModule = buildModule("AllDeployModule", (m) => {
  const entryPoint = m.contract("EntryPoint");
  const accountFactory = m.contract("AccountFactory");
  const snapAds = m.contract("SnapAds");

  console.log(snapAds);
  return { accountFactory, entryPoint, snapAds };
});

export default AllDeployModule;
