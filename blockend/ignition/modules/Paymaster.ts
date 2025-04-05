import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PaymasterModule = buildModule("PaymasterModule", (m) => {
  const SNAPADS_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const lock = m.contract("Paymaster", [SNAPADS_ADDRESS]);

  return { lock };
});

export default PaymasterModule;
