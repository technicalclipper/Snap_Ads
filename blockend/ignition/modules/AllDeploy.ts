import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AllDeployModule = buildModule("AllDeployModule", (m) => {
  const accountFactory = m.contract("AccountFactory");
  // const snapAds = m.contract("SnapAds");

  return { accountFactory,  };
});

export default AllDeployModule;
