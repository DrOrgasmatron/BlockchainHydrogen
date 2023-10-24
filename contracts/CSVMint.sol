// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";

contract CSVMint is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Pausable,
    AccessControl
{
    //bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _certificateTokenIdCounter;

    //constructor() ERC721("CSVMint", "CSV") {}

    constructor(
        address defaultAdmin,
        address pauser,
        address minter
    ) ERC721("CSVMint", "CSV") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    //is not used
    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) {
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
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

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
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //transfer ownership of token
    function transferTokenOwnership(uint256 tokenId, address newOwner) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Caller is not the owner or approved"
        );
        _transfer(msg.sender, newOwner, tokenId);
    }

    struct CSVToken {
        uint256 tokenId;
        string csvHash;
        string date;
        string issuer;
    }
    CSVToken[] private _tokenHashes;

    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string csvHash
    );

    struct CertificateToken {
        uint256 tokenId;
        string csvHash;
        string date;
        string issuer;
    }

    CertificateToken[] private _certificateTokenHashes;

    event CertificateTokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string csvHash
    );

    function mintCSV(string memory csvHash, string memory date) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        string memory tokenIssuer = addressToString(msg.sender);

        CSVToken memory newToken = CSVToken(
            tokenId,
            csvHash,
            date,
            tokenIssuer
        );
        _tokenHashes.push(newToken);
    }

    function mintCertificate(string memory csvHash, string memory date) public {
        uint256 tokenId = _certificateTokenIdCounter.current();
        _certificateTokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        string memory tokenIssuer = addressToString(msg.sender);

        CertificateToken memory newToken = CertificateToken(
            tokenId,
            csvHash,
            date,
            tokenIssuer
        );
        _certificateTokenHashes.push(newToken);
    }

    //Check if hash exists
    function checkCSVToken(string memory csvHash) public view returns (bool) {
        for (uint256 i = 0; i < _tokenHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i].csvHash))
            ) {
                return true;
            }
        }
        return false;
    }

    function getCSVToken(uint256 tokenId) public view returns (string memory) {
        require(tokenId < _tokenHashes.length, "Invalid tokenId");
        return _tokenHashes[tokenId].csvHash;
    }

    function getCSVTokenCount() public view returns (uint256) {
        return _tokenHashes.length;
    }

    function getAllCSVToken() public view returns (CSVToken[] memory) {
        return _tokenHashes;
    }

    function getTokenHashFromHash(
        string memory csvHash
    ) public view returns (string memory) {
        for (uint256 i = 0; i < _tokenHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i].csvHash))
            ) {
                return _tokenHashes[i].csvHash;
            }
        }
    }

    function getTokenIDFromHash(
        string memory csvHash
    ) public view returns (uint256) {
        for (uint256 i = 0; i < _tokenHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i].csvHash))
            ) {
                return _tokenHashes[i].tokenId;
            }
        }
    }

    function getTokenDateFromHash(
        string memory csvHash
    ) public view returns (string memory) {
        for (uint256 i = 0; i < _tokenHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i].csvHash))
            ) {
                return _tokenHashes[i].date;
            }
        }
    }

    function getTokenIssuerFromHash(
        string memory csvHash
    ) public view returns (string memory) {
        for (uint256 i = 0; i < _tokenHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(csvHash)) ==
                keccak256(abi.encodePacked(_tokenHashes[i].csvHash))
            ) {
                return _tokenHashes[i].issuer;
            }
        }
    }

    function addressToString(
        address _address
    ) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_address)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";

        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }

        return string(str);
    }
}
/*
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
*/
// The following functions are overrides required by Solidity.
/*
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
*/
