import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { isValidSuiAddress } from "@mysten/sui.js/utils";
import {
  TESTNET_PACKAGE_ID,
  DEVNET_PACKAGE_ID,
  MAINNET_PACKAGE_ID,
  COIN_TYPE,
  PHASE_204,
  PHASE_201,
  PHASE_202,
  PHASE_203,
} from "../../../utils/utils";

interface Create {
  signer: Ed25519Keypair;
  unique_id: number;
  name: string;
  amount: number;
  receiverAddress: string;
  networkType: "testnet" | "devnet" | "mainnet";
}

/**
 * Asynchronous function to create an E-Commerce transaction.
 * @param {createEcomTx} { signer, unique_id, name, amount, receiverAddress, networkType }
 * @returns A promise that resolves with the transaction status or error information.
 */

export const createEcomTx = async ({
  signer,
  unique_id,
  name,
  amount,
  receiverAddress,
  networkType,
}: Create) => {
  const getPackageID = (networkType: any) => {
    switch (networkType) {
      case "testnet":
        return TESTNET_PACKAGE_ID;
      case "devnet":
        return DEVNET_PACKAGE_ID;
      case "mainnet":
        return MAINNET_PACKAGE_ID;
      default:
        return TESTNET_PACKAGE_ID;
    }
  };

  // Establishing connection to the Sui network.
  const rpcUrl = getFullnodeUrl(networkType);
  const client = new SuiClient({ url: rpcUrl });

  // Preparing the transaction block.
  const tx = new TransactionBlock();

  const verifyAddr = isValidSuiAddress(receiverAddress);
  if (!verifyAddr) {
    throw new Error("Invalid Sui address.");
  }

  // Convert amount to MIST 1 SUI = 1000000000.
  const txAmount = amount;
  const txValue = Math.floor(+txAmount * 1_000_000_000);
  const coins = tx.splitCoins(tx.gas, [tx.pure(txValue)]);

  tx.moveCall({
    target: `${getPackageID(networkType)}::boltpay::create_tx`,
    arguments: [
      coins,
      tx.pure(unique_id),
      tx.pure(name),
      tx.pure(receiverAddress),
      tx.pure(txValue),
    ],
    typeArguments: [COIN_TYPE],
  });

  const response = await client.signAndExecuteTransactionBlock({
    signer,
    transactionBlock: tx,
    options: { showEffects: true },
  });

  if (!response || !response.digest) {
    return PHASE_204;
  }

  // Success case
  if (response.effects?.status?.status === "success") {
    return { PHASE_201, txn_digest: response.digest };
  }

  // Failure due to insufficient coin balance
  if (
    response.effects?.status?.error === "InsufficientCoinBalance in command 0"
  ) {
    return PHASE_203;
  }

  if (response.effects?.status?.status === "failure") {
    return {
      PHASE_202,
      err: response.effects?.status?.error,
    };
  }
};
