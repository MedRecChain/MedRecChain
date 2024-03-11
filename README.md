## About The Project

MedRecChain is a decentralized solution for Electronic Medical Records sharing systems (EMR). It utilizes the Ethereum network and IPFS technology to provide a secure and transparent platform for managing and sharing medical records.

### Live Demo

- [MedRecChain](https://med-rec-chain.vercel.app/)


### Requirements

- [NodeJS](https://nodejs.org/en) >= 10.16 and [npm](https://www.npmjs.com/) >= 5.6 installed.
- [Git](https://git-scm.com/) installed in the system.
- [Truffle](https://www.trufflesuite.com/truffle), which can be installed globally with `npm install -g truffle`
- [Metamask](https://metamask.io) extension added to the browser.
- [Ganache](https://trufflesuite.com/ganache/) development network.

### Built With

- [Ethereum](https://ethereum.org/en/)
- [Solidity](https://soliditylang.org/)
- [Truffle](https://trufflesuite.com/)
- [React.js](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com)

<!-- ## How Does It Work

- A healthcare provider can register using a crypto wallet like Metamask.
- The healthcare provider can register a patient by using the public address of the patient’s wallet, usually provided during an appointment.
- The health provider can search for a patients, and upload a new record for the patient.
- The patient can also view his or her records, after connected with a wallet which address is registered by the health provider. -->

## How To Use

Follow the steps below to get started with MedRecChain:

### Getting Started

1. Clone the repository: `git clone https://github.com/MedRecChain/MedRecChain.git`
2. Install the required dependencies: `npm install`

### To deploy the Smart Contract

1. Configure the Ethereum network or provider in the `truffle-config.js` file.
2. Compile the smart contracts: `truffle compile`
3. Deploy the smart contracts: `truffle migrate`

### To run the React development server

1. Start the development server: `npm start`

## To Run IPFS locally

## Install

```js
npm i --location=global ipfs
```

## Run server

```js
jsipfs daemon
```

> to visit it click `http://127.0.0.1:5002/webui`

## !! to avoid the forbidden Error that happens when you upload images

## `open PowerShell then write this`

```git
- jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"http://127.0.0.1:5002\", \"http://localhost:3000\", \"http://127.0.0.1:5001\", \"https://webui.ipfs.io\"]'

- jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\"]'
```

> also Don't forget to open Server
> `jsipfs daemon`

## Contributing

We welcome contributions to MedRecChain. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

### [Helpful link to make new branch ](https://www.varonis.com/blog/git-branching)
### [How to Use Git and GitHub in a Team like a Pro](https://www.freecodecamp.org/news/how-to-use-git-and-github-in-a-team-like-a-pro/)
