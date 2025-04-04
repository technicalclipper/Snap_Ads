import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AccountFactoryModule = buildModule("AccountFactoryModule", (m) => {
  const lock = m.contract("AccountFactory");

  return { lock };
});

export default AccountFactoryModule;
