// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CertificateMint.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract CertificateMarket is ReentrancyGuard {
    using Address for address payable;

    CertificateMint public immutable nftContract;

    struct Sale {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Sale) public tokenSales;

    event TokenListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event TokenSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    constructor(address _nftContract) {
        nftContract = CertificateMint(_nftContract);
    }

    function listTokenForSale(uint256 tokenId, uint256 price) external {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Caller is not the token owner"
        );
        require(price > 0, "Price must be greater than zero");

        nftContract.transferFrom(msg.sender, address(this), tokenId);
        tokenSales[tokenId] = Sale(msg.sender, price);

        emit TokenListed(tokenId, msg.sender, price);
    }

    function buyToken(uint256 tokenId) external payable nonReentrant {
        Sale memory sale = tokenSales[tokenId];
        require(sale.price > 0, "Token not for sale");
        require(msg.value >= sale.price, "Insufficient payment");

        payable(sale.seller).sendValue(msg.value);
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        delete tokenSales[tokenId];

        emit TokenSold(tokenId, sale.seller, msg.sender, sale.price);
    }

    function cancelSale(uint256 tokenId) external {
        Sale memory sale = tokenSales[tokenId];
        require(sale.seller == msg.sender, "Caller is not the seller");

        nftContract.transferFrom(address(this), msg.sender, tokenId);
        delete tokenSales[tokenId];
    }
}
