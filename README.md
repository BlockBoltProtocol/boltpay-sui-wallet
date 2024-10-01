# BlockBolt SDK

The BlockBolt SDK for the Sui Wallet App offers a highly beneficial and smoothly integrated feature set for Sui chain transactions. It provides a user-friendly and secure way for users to execute payments. The key features of this SDK include QR code scanning and payment request interpretation, allowing users to confirm payments effortlessly within their Sui wallet app. By handling transactions on the Sui chain, the BlockBolt SDK ensures safe and reliable delivery of payments to the merchant's wallet.

## Table of Contents

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Supported Coins](#supported-coins)
- [Usage](#usage)
  - [Initializing the SDK](#initializing-the-sdk)
  - [Sending a Transaction](#sending-a-transaction)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the BlockBolt SDK using npm:

```bash
npm install @blockbolt/boltpay-wallet
```

Or using yarn:

```bash
yarn add @blockbolt/boltpay-wallet
```

## Dependencies

BlockBolt SDK requires the `@mysten/sui` package as a peer dependency. Make sure to install it alongside the SDK:

```bash
npm install @mysten/sui
```

Or using yarn:

```bash
yarn add @mysten/sui
```

## Supported Coins

BlockBolt SDK currently supports the following coins:

| Coin Name | Symbol | Decimals | Coin Type |
|-----------|--------|----------|-----------|
| USD Coin | USDC | 6 | 0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN |
| Tether | USDT | 6 | 0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN |
| SCA Token | SCA | 9 | 0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA |
| Sacabum | SCB | 5 | 0x9a5502414b5d51d01c8b5641db7436d789fa15a245694b24aa37c25c2a6ce001::scb::SCB |
| Buck USD | BUCK | 9 | 0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK |
| Turbos | TURBOS | 9 | 0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS |
| FlowX | FLX | 8 | 0x6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX |
| NavX | NAVX | 9 | 0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX |
| FUD Token | FUD | 5 | 0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD |

## Usage

### Initializing the SDK

First, import and initialize the BlockBolt SDK:

```javascript
import { BlockBolt } from '@blockbolt/boltpay-wallet';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const sdk = new BlockBolt();
```

### Sending a Transaction

To send a transaction, use the `send` method:

```javascript
const phrase = "your mnemonic phrase here";
const keyPair = Ed25519Keypair.deriveKeypair(phrase, "m/44'/784'/0'/0'/0'");

const generateRandomBigInt = () => BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
const randomId = generateRandomBigInt();

const result = await sdk.send({
    keyPair,
    receiverAddr: "0xa2a0c531c0aecf0e96f2834e846422eb49e77fb50410cb9f09c797ba902ce752",
    nameProduct: 'Coffee',
    amount: 1000000, // Amount in smallest unit (e.g., 1 FUD with 5 decimals)
    coinType: "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
    randomId: randomId
});

console.log('Transaction result:', result.digest);
```

## API Reference

### `BlockBolt.send(params)`

Sends a transaction on the Sui network.

Parameters:
- `params.keyPair`: The Ed25519Keypair derived from the mnemonic phrase
- `params.receiverAddr`: The recipient's address
- `params.nameProduct`: Name or description of the product/service
- `params.amount`: Amount to send (in the smallest unit of the coin)
- `params.coinType`: The type of coin to send (use the full coin type string)
- `params.randomId`: A random BigInt for transaction uniqueness

Returns: A promise that resolves to the transaction result.

## Error Handling

The SDK uses custom error types for different scenarios. Always wrap your SDK calls in a try-catch block:

```javascript
try {
    const result = await sdk.send(/* ... */);
    // Handle successful transaction
} catch (error) {
    if (error instanceof MerchantFeeError) {
        console.error('Merchant fee error:', error.message, 'Coin type:', error.coinType);
    } else {
        console.error('Transaction failed:', error);
    }
}
```

## Examples

Here's a complete example of using the BlockBolt SDK:

```typescript
import { BlockBolt } from '@blockbolt/boltpay-wallet';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const sdk = new BlockBolt();

const phrase = "sui sui sui sui sui sui sui sui sui sui sui sui";
const keyPair = Ed25519Keypair.deriveKeypair(phrase, "m/44'/784'/0'/0'/0'");

const generateRandomBigInt = () => BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

const sendTransaction = async () => {
    try {
        const result = await sdk.send({
            keyPair,
            receiverAddr: "0xa2a0c531c0aecf0e96f2834e846422eb49e77fb50410cb9f09c797ba902ce752",
            nameProduct: 'Coffee',
            amount: 1000000, // 1 FUD (5 decimal places)
            coinType: "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
            randomId: generateRandomBigInt()
        });
        
        console.log('Transaction result:', result.digest);
        
        if (result.effects?.status.status === "success") {
            console.log('Transaction successful');
        } else {
            console.log('Transaction failed:', result.effects?.status.error);
        }
    } catch (error) {
        console.error('Transaction failed:', error);
    }
};

sendTransaction();
```

## Best Practices
Security: Avoid hardcoding sensitive information like seed phrases. Always retrieve them from a secure and encrypted source. Key Management: Especially in client-side applications, use pre-derived signer for enhanced security. Additional Information: Make sure to replace placeholders in the code examples with actual data from your application.

Disclaimer: Please note that the BlockBolt protocol relies solely on blockchain verification for payment confirmation and process.

Do you encounter any issues or require assistance? Kindly send us an email at support@blockbolt.io or submit a support ticket on our Discord server https://discord.gg/Fb8CA6ny67. We are happy to help you.