// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Account is IAccount {
    uint public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata op,
        bytes32 userOpHash,
        uint256
    ) external view returns (uint256 validationData) {
        address recovered = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(userOpHash),
            op.signature
        );
        return recovered == owner ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {
        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory creationCode = type(Account).creationCode;
        bytes memory bytecode = abi.encodePacked(
            creationCode,
            abi.encode(owner)
        );

        address addr = Create2.computeAddress(salt, keccak256(bytecode));

        if (addr.code.length != 0) {
            return addr; // Account already deployed
        }

        return Create2.deploy(0, salt, bytecode);
    }
}
