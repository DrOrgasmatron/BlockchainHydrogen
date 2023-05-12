// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CSVMint is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CSVMint", "CSV") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //  mapping(uint256 => string) private _tokenHashes;
    string[] private _tokenHashes;

    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string csvHash
    );

    // converts uint to string
    function uintToString(uint256 value) public pure returns (string memory) {
        // Convert the uint256 to bytes
        bytes memory buffer = new bytes(32);
        assembly {
            mstore(add(buffer, 32), value)
        }

        // Find the end of the number and resize the buffer
        uint256 length = 0;
        while (buffer[length + 32] != 0) {
            length++;
        }
        bytes memory output = new bytes(length);

        // Copy the bytes to the output buffer
        for (uint256 i = 0; i < length; i++) {
            output[i] = buffer[i + 32];
        }

        // Convert the bytes to a string
        return string(output);
    }

    function mintCSV(string memory csvHash) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _tokenHashes.push(csvHash);
        // _setTokenURI(tokenId, tokenURI);
        // emit TokenMinted(msg.sender, tokenId, csvHash);
    }

    function checkCSVToken(string memory csvHash) public view returns (bool) {
        for (uint i = 0; i < _tokenIdCounter.current(); i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i]))
            ) {
                return true;
            }
        }
        return false;
    }

    //WORK IN PROGRESS
    function getCSVToken(uint256 tokenId) public view returns (string memory) {
        return _tokenHashes[tokenId];
    }

    function getCSVTokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getAllCSVToken() public view returns (string[] memory) {
        return _tokenHashes;
    }
}
