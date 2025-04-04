import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EntryPointModule = buildModule("EntryPointModule", (m) => {
  const lock = m.contract("EntryPoint");

  return { lock };
});

export default EntryPointModule;
