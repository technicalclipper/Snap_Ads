// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {
    bool allow = true;

    function validatePaymasterUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external pure returns (bytes memory context, uint256 validationData) {
        bool allowed = false;

        if (!allowed) {
            validationData = uint256(1) << 160;
        } else {
            validationData = 0;
        }
        context = new bytes(0);
    }

    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external {}
}
