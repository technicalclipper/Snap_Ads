import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AllDeployModule = buildModule("AllDeployModule", (m) => {
  const entryPoint = m.contract("EntryPoint");
  const accountFactory = m.contract("AccountFactory");

  return { accountFactory, entryPoint };
});

export default AllDeployModule;
