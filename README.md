# BlockchainHydrogen

BlockchainHydrogen is a TM Project 2023 that implements a blockchain-based system for managing CSV (Comma-Separated Values) files as tokens on the Ethereum blockchain.

## Table of Contents
- [BlockchainHydrogen](#blockchainhydrogen)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Miscellaneous](#miscellaneous)



## Description

The BlockchainHydrogen project is built using Ethereum smart contracts and the Hardhat development environment. It allows users to mint tokens representing CSV files, store them on the blockchain, and perform various operations on the tokens.

The project consists of the following main components:
- Smart Contracts: The Ethereum smart contracts written in Solidity that define the behavior of the tokens and provide the necessary functionality.
- Scripts: JavaScript scripts for interacting with the smart contracts and performing actions such as minting tokens and transferring ownership.
- Dependencies: The project depends on various npm packages such as `csv-writer`, `fs-extra`, `hardhat`, and more. Please refer to the `package.json` file for a complete list of dependencies.

## Installation

To run the BlockchainHydrogen project locally, follow these steps:

1. Clone the repository:

   git clone https://github.com/DrOrgasmatron/BlockchainHydrogen.git

2. Navigate to the project directory:
cd BlockchainHydrogen

3. Install the required dependencies:
npm install

## Usage
For a complete guide on how to use the project, please read the "User Guide" document in the appendices.

The link for the application can be found in the appendices of the report.

## Miscellaneous
The files for the frontend containend in this repository are relevant only if the frontend is run locally. The files for the actual frontend are hosted in the AWS S3 bucket. The frontends are the same, but the backend files are slightly modified to accomodate AWS specific requirements.