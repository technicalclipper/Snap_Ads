import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import { SNAPADS_ADDRESS } from "../../scripts/addresses";

const PaymasterModule = buildModule("PaymasterModule", (m) => {
  const lock = m.contract("Paymaster", [SNAPADS_ADDRESS]);

  return { lock };
});

export default PaymasterModule;
