// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IFERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract StreaXFaucet {
    function sendTokens(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        IFERC20(0x346461C71eaEf9cAfEAfF461aFDD61055AED4d3d).transferFrom(
            from,
            to,
            amount
        );
        return true;
    }
}
