import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PaymasterModule = buildModule("PaymasterModule", (m) => {
  const lock = m.contract("Paymaster");

  return { lock };
});

export default PaymasterModule;
