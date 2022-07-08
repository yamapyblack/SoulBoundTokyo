// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "./SoulBoundToken.sol";

contract SoulBoundTokenMock is SoulBoundToken {
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}
}
