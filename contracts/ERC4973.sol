// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.8;

import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";

import {ERC165} from "./ERC165.sol";

import {IERC721Metadata} from "./interfaces/IERC721Metadata.sol";
import {IERC4973} from "./interfaces/IERC4973.sol";

bytes32 constant AGREEMENT_HASH =
  keccak256(
    "Agreement(address active,address passive,string tokenURI)"
);

/// @notice Reference implementation of EIP-4973 tokens.
/// @author Tim Daubenschütz, Rahul Rumalla (https://github.com/rugpullindex/ERC4973/blob/master/src/ERC4973.sol)
abstract contract ERC4973 is EIP712, ERC165, IERC721Metadata, IERC4973 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  using BitMaps for BitMaps.BitMap;
  BitMaps.BitMap private _usedHashes;

  string private _name;
  string private _symbol;

  mapping(uint256 => address) private _owners;
  mapping(uint256 => string) private _tokenURIs;
  mapping(address => uint256) private _balances;
  mapping(uint256 => uint256) private _inventory;

  constructor(
    string memory name_,
    string memory symbol_,
    string memory version
  ) EIP712(name_, version) {
    _name = name_;
    _symbol = symbol_;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC721Metadata).interfaceId ||
      interfaceId == type(IERC4973).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function name() public view virtual override returns (string memory) {
    return _name;
  }

  function symbol() public view virtual override returns (string memory) {
    return _symbol;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "tokenURI: token doesn't exist");
    return _tokenURIs[tokenId];
  }

  function unequip(uint256 tokenId) public virtual override {
    require(msg.sender == ownerOf(tokenId), "unequip: sender must be owner");
    uint256 index = _inventory[tokenId];
    _usedHashes.unset(index);
    _burn(tokenId);
  }

  function balanceOf(address owner) public view virtual override returns (uint256) {
    require(owner != address(0), "balanceOf: address zero is not a valid owner");
    return _balances[owner];
  }


  function ownerOf(uint256 tokenId) public view virtual returns (address) {
    address owner = _owners[tokenId];
    require(owner != address(0), "ownerOf: token doesn't exist");
    return owner;
  }

  function give(
//  address from, // is the `msg.sender`,
    address to,
    string calldata uri,
    bytes calldata signature
  ) external virtual returns (uint256) {
    require(msg.sender != to, "give: cannot give from self");
    uint256 index = _safeCheckAgreement(msg.sender, to, uri, signature);
    uint256 tokenId = _tokenIds.current();
    _inventory[tokenId] = index;
    _mint(to, tokenId, uri);
    _tokenIds.increment();

    _usedHashes.set(index);
    return tokenId;
  }

  function take(
    address from,
//  address to, // is the `msg.sender`,
    string calldata uri,
    bytes calldata signature
  ) external virtual returns (uint256) {
    require(msg.sender != from, "take: cannot take from self");
    uint256 index = _safeCheckAgreement(msg.sender, from, uri, signature);
    uint256 tokenId = _tokenIds.current();
    _inventory[tokenId] = index;
    _mint(msg.sender, tokenId, uri);
    _tokenIds.increment();

    _usedHashes.set(index);
    return tokenId;
  }

  function _safeCheckAgreement(
    address active,
    address passive,
    string calldata uri,
    bytes calldata signature
  ) internal virtual returns (uint256) {
    bytes32 hash = _getHash(active, passive, uri);
    uint256 index = uint256(hash);

    require(
      SignatureChecker.isValidSignatureNow(passive, hash, signature),
      "_safeCheckAgreement: invalid signature"
    );
    require(!_usedHashes.get(index), "_safeCheckAgreement: already used");
    return index;
  }

  function _getHash(
    address active,
    address passive,
    string calldata tokenURI
  ) internal view returns (bytes32) {
    bytes32 structHash = keccak256(
      abi.encode(
        AGREEMENT_HASH,
        active,
        passive,
        keccak256(bytes(tokenURI))
      )
    );
    return _hashTypedDataV4(structHash);
  }

  function _exists(uint256 tokenId) internal view virtual returns (bool) {
    return _owners[tokenId] != address(0);
  }

  function _mint(
    address to,
    uint256 tokenId,
    string memory uri
  ) internal virtual returns (uint256) {
    require(!_exists(tokenId), "mint: tokenID exists");
    _balances[to] += 1;
    _owners[tokenId] = to;
    _tokenURIs[tokenId] = uri;
    emit Transfer(address(0), to, tokenId);
    return tokenId;
  }

  function _burn(uint256 tokenId) internal virtual {
    address owner = ownerOf(tokenId);

    _balances[owner] -= 1;
    delete _owners[tokenId];
    delete _tokenURIs[tokenId];

    emit Transfer(owner, address(0), tokenId);
  }
}
