// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract SoulBoundToken is Ownable, ERC721 {
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);

        // mint or burn are ok
        if (to == address(0) || from == address(0)) {
        }else{
            revert("SoulBoundToken: not to be transferred");
        }
    }
}
