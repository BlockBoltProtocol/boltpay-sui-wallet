## BlockBolt Payment
The BoltPay SDK for the Sui Wallet App offers a highly beneficial and smoothly integrated feature set for Sui chain transactions. It provides a user-friendly and secure way for users to execute payments. The key features of this SDK include QR code scanning and payment request interpretation, allowing users to confirm payments effortlessly within their Sui wallet app. By handling transactions on the Sui chain, the BoltPay SDK ensures safe and reliable delivery of payments to the merchant's wallet.


Please take a look at the sequence diagram that explains the process of the Boltpay SDK.

![BlockBolt - Boltpay SDK Wallet Process](https://camo.githubusercontent.com/09f79bb2179658a7adbd2823acb8c59ee3c873dbec7454d32e41a97f6e87cb4a/68747470733a2f2f626c6f636b626f6c742e696f2f676974687562696d616765732f626f6c747061792d73646b2d77616c6c65742d7375692d6e6574776f726b2e6a7067)

### Installation

- Compatible with Node.js and React-based applications.
- Requires the `@blockbolt/boltpay-wallet` and `@mysten/sui.js` libraries for full functionality.

Install the SDK via npm, yarn or pnpm:

```bash
npm install @blockbolt/boltpay-wallet
    ##
yarn add @blockbolt/boltpay-wallet  
    ##
pnpm install @blockbolt/boltpay-wallet
```
### Prerequisites

You will need mysten js library to run the sdk

Install the SDK via npm, yarn or pnpm:

```bash
npm install @mysten/sui.js
    ##
yarn add @mysten/sui.js  
    ##
pnpm install @mysten/sui.js    
```


Usage
The SDK provides two main functions: **createEcomTx** for generic E-commerce transactions and **createWoComTx** for WooCommerce-specific transactions.

Importing the SDK 

```jsx
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
```

```jsx
import { createEcomTx, createWoComTx, Ed25519Keypair } from '@blockbolt/boltpay-wallet';
```

## E-commerce Transactions (createEcomTx)

- `unique_id`: A unique, random numerical identifier for each transaction.
- `merchantName`: The merchant's name for identifying the payment recipient.
- `amount`: The value to be transferred in the transaction.
- `receiverAddress`: The merchant's Sui wallet address for receiving the payment.


**For demo purpose only** 

```tsx
const phrase = "your seed phrase"; // Securely retrieve the seed phrase
const keyPair = Ed25519Keypair.deriveKeypair(phrase, "m/44'/784'/0'/0'/0'");
```

To ensure secure transactions on the Sui chain, wallet providers should use their secure transfer method to pass the signer to the createEcomTx or createWoComTx function for initiating transactions. This approach guarantees adherence to security best practices, thereby maintaining the integrity and safety of the transaction process.

Example Usage

```jsx
const response = await createEcomTx({
    signer: keyPair, // here you can pass the wallet signer or for test you can use like above example
    unique_id: randomId, // Replace with a unique identifier
    name: Merchant Name,  // Replace with the merchant name
    amount: Price,      // Replace with the transaction amount
    receiverAddress: Merchant Address, // Replace with the merchant's address
    networkType: "testnet" // "testnet", "devnet", or "mainnet"
});
```

## WooCommerce Transactions (createWoComTx)

- `unique_id`: A unique, random numerical identifier for each transaction.
- `merchantName`: The merchant's name for identifying the payment recipient.
- `amount`: The value to be transferred in the transaction.
- `receiverAddress`: The merchant's Sui wallet address for receiving the payment.

Example Usage

```jsx
const responseWoCom = await createWoComTx({
    signer: keyPair, // here you can pass the walle signer or for test you can use like above example
    unique_id: randomId, // Replace with a unique identifier
    name: Merchant Name,  // Replace with the merchant name
    amount: Price,      // Replace with the transaction amount
    receiverAddress: Merchant Address, // Replace with the merchant's address
    networkType: "testnet" // "testnet", "devnet", or "mainnet"
});
```

In the provided example for the createEcomTx & createWoComTx function, the code snippet demonstrates how a transaction can be created and executed. It's important to understand that the part of the code dealing with the Ed25519Keypair is included solely for demonstration purposes.


 ## Erros & Response
- PHASE 201 =  "Transaction Success";
- PHASE 202 =  "Transaction Fail";
- PHASE 203 =  "InsufficientCoinBalance in your wallet";
- PHASE 204 =  "No response or transaction data received"
- PHASE 205 =  "The shared merchant address is not correct";

#### Best Practices
**Security**: Avoid hardcoding sensitive information like seed phrases. Always retrieve them from a secure and encrypted source.
**Key Management**: Especially in client-side applications, use pre-derived signer for enhanced security.
**Additional Information**: Make sure to replace placeholders in the code examples with actual data from your application.

**Disclaimer: Please note that the BlockBolt protocol relies solely on blockchain verification for payment confirmation and process.**

**Do you encounter any issues or require assistance? Kindly send us an email at support@blockbolt.io or submit a support ticket on our Discord server https://discord.gg/Fb8CA6ny67. We are happy to help you.**