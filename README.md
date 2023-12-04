# Boltpay Wallet SDK for Sui Network

### What is BlockBolt Protocol

BlockBolt is a decentralized payment protocol on the multichain. It offers seamless, secure, and efficient transactions for businesses and consumers, encouraging cryptocurrency adoption. BlockBolt provides an open-source SDK, plug-and-play services, and resources for developers to create or integrate payment solutions.

The Boltpay SDK for the Sui wallet app is an advantageous feature that can be seamlessly incorporated. It enables users to conveniently and safely make payments on the Sui chain. With its QR code scanning and payment request interpretation features, users can conveniently confirm their payments directly within their Sui wallet app. The Boltpay SDK manages the transaction on the Sui chain, ensuring that the payment is safely delivered to the merchant's wallet.

Please take a look at the sequence diagram that explains the process of the Boltpay SDK.

![BlockBolt - Boltpay SDK Wallet Process](https://blockbolt.io/githubimages/boltpay-sdk-wallet-sui-network.jpg)

- The process involves the following steps:
- The user installs the Boltpay SDK using npm.
- The Boltpay SDK confirms that it has been installed.
- The user establishes a connection to the Sui network using the Boltpay SDK.
- The Boltpay SDK connects to the Sui network.
- The Sui network confirms that the connection has been established.
- The Boltpay SDK informs the user that the connection has been established.
- The user creates a transaction using the SDK.
- The user sent a transaction request to the Sui network using the Boltpay SDK.
- The Boltpay SDK receives a transaction response from the Sui network.
- The Boltpay SDK confirms that the transaction has been created.

## Boltpay SDK Documentation

As a developer, you can make use of the Boltpay SDK for wallet, a powerful tool that allows seamless integration with the BlockBolt Payment Protocol. In this guide, you will be taken through the steps of setting up and utilizing the Boltpay SDK for transaction creation on the Sui blockchain.

### Prerequisites

#### Before starting, make sure that you have a signer set up on your Sui Wallet mobile application.

To ensure successful transaction execution, it is essential to have a signer. This component is linked to your wallet and possesses the necessary credentials to authorize transactions. By using your own wallet's signer during the execution process, you affirm and authorize transactions, leading to successful completion. It is crucial to keep your signer secure to maintain your wallet's security.

#### To obtain the QR code, a scanner is required. It is possible to use your personal scanner, but we suggest utilizing the one that has been provided.

```bash
npm i react-qr-reader
```

#### Furthermore, acquiring a fundamental comprehension of these programming languages and frameworks can help you fully utilize the capabilities of the Boltpay Wallet SDK.

- React.js: A framework utilized for building user interfaces.
- Next.js: It supports features like server-side rendering and static websites for React applications.
- Vite: A build tool for modern web projects.
- TypeScript: A statically typed superset of JavaScript that improves its scalability.
- JavaScript: The primary language for web development.

### Installation

Installing the Boltpay SDK is straightforward using npm:

Using npm:

```bash
npm i @blockbolt/boltpay-sui-wallet
```

### Establishing a Connection

To get started, the first step is to connect to the Sui network using the BlockBolt Payment Protocol. The Boltpay SDK offers three pre-set connections to choose from: testnet, devnet, and mainnet.

To obtain the essential details from a QR code, all you need to do is scan it with your Sui wallet. This will furnish you with the necessary values to initiate the transaction creation process.

```bash
const details = {
      merchant_id: 123,
      merchant_name: "MERCHANT_NAME",
      merchant_address: "MERCHANT_ADDRESS",
      merchant_amount: 1,
      merchant_network: "testnet", // Options: mainnet, testnet, devnet
    };
```

## **Creating a Transaction**

To initiate a transaction, simply use the values obtained from the QR code and pass your wallet signer to the `createTransaction` field. This action will create the transaction for you.

Here's an example of how you can do this:

```bash
import { createTransaction } from "@blockbolt/boltpay-sui-wallet";

const handleTransaction = async () => {
    const tx = createTransaction(signer, details);
};
```

## **Errors & Responses**

- 201 = Transaction successful.
- 202 = Transaction failed.
- 203 = Insufficient coin balance in your wallet.
- 204 = The shared merchant address is incorrect.
- 205 = We couldn't find anything.

## **Testing on Local Machine - Running Locally**

Running the SDK locally on your system without a wallet is possible, but it's not advisable for production environments. Therefore, we don't recommend it.

## Prerequisites

```bash
  npm i @mysten/sui.js
```

## **Establishing a Connection**

To get started, the first step is to connect to the Sui network using the BlockBolt Payment Protocol. The Boltpay SDK offers three pre-set connections to choose from: testnet, devnet, and mainnet.

Here's how you can establish a connection to the mainnet:

```bash
import { Connection, JsonRpcProvider } from "@mysten/sui.js";

export const mainnetConnection = new JsonRpcProvider(
  new Connection({
    fullnode: "https://wallet-rpc.mainnet.sui.io/",
    faucet: "https://wallet-rpc.mainnet.sui.io/gas",
  })
);
```

## **Creating a Transaction**

In order to initiate a transaction, you must first generate a key pair from a phrase and create a signer using that information. Once the signer is established, it can be used to initiate the transaction.

Here's an example:

```bash
import { Ed25519Keypair, RawSigner, JsonRpcProvider } from "@mysten/sui.js";
import { createTransaction } from "@blockbolt/boltpay-sui-wallet";

const handleTransaction = async () => {
    const details = {
        merchant_id: 123,
        merchant_name: "MERCHANT_NAME",
        merchant_address: "MERCHANT_ADDRESS",
        merchant_amount: 1,
        merchant_network: "testnet", // Options: mainnet, testnet, devnet
    };

    const phrase = "YOUR_SEED_PHRASE";
    const keyPair = Ed25519Keypair.deriveKeypair(phrase, "m/44'/784'/0'/0'/0'");
    const provider: JsonRpcProvider = new JsonRpcProvider(testnetConnection);
    const signer: RawSigner = new RawSigner(keyPair, provider)

    const tx = createTransaction(signer, details);
    console.log(tx)
};
```

**For the sake of security, it is highly advisable to store confidential details like your seed phrase and private keys in a .env file or opt for other secure environment variable solutions. These are not part of your codebase and remain confidential.**

**Disclaimer: Please note that the BlockBolt protocol relies solely on blockchain verification for payment confirmation and process.**

**Do you encounter any issues or require assistance? Kindly send us an email at support@blockbolt.io or submit a support ticket on our Discord server https://discord.gg/Fb8CA6ny67. We are ready to help you out.**
