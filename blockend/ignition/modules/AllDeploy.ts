import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AllDeployModule = buildModule("AllDeployModule", (m) => {
  const entryPoint = m.contract("EntryPoint");
  const accountFactory = m.contract("AccountFactory");
  const paymaster = m.contract("Paymaster");

  return { accountFactory, entryPoint, paymaster };
});

export default AllDeployModule;
