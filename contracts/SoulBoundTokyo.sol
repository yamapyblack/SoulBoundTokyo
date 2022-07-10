// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "./ERC4973.sol";

contract SoulBoundTokyo is ERC4973 {
    constructor(
        string memory name_,
        string memory symbol_,
        string memory version
    ) ERC4973(name_, symbol_, version) {}
}
