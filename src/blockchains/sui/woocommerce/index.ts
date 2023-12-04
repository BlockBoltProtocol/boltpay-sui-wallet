import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { isValidSuiAddress } from "@mysten/sui.js/utils";
import {
  SUI_WOOCOMMERCE_TREASURY,
  SUI_WOOCOMMERCE_TESTNET,
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
 * Asynchronous function to create an Woo-Commerce transaction.
 * @param {createWoComTx} { signer, unique_id, name, amount, receiverAddress, networkType }
 * @returns A promise that resolves with the transaction status or error information.
 */

export const createWoComTx = async ({
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
        return SUI_WOOCOMMERCE_TESTNET;
      case "devnet":
        return SUI_WOOCOMMERCE_TESTNET;
      case "mainnet":
        return SUI_WOOCOMMERCE_TESTNET;
      default:
        return SUI_WOOCOMMERCE_TESTNET;
    }
  };

  const rpcUrl = getFullnodeUrl(networkType);
  const client = new SuiClient({ url: rpcUrl });

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
    target: `${getPackageID(networkType)}::woo_commerce::create_tx`,
    arguments: [
      coins,
      tx.object(`${SUI_WOOCOMMERCE_TREASURY}`),
      tx.pure(name),
      tx.pure(receiverAddress),
      tx.pure(txValue),
      tx.pure(unique_id),
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

  // Failure due to insufficient coin balance
  if (
    response.effects?.status?.error === "InsufficientCoinBalance in command 0"
  ) {
    return PHASE_203;
  }

  // Success case
  if (response.effects?.status?.status === "success") {
    return { PHASE_201, txn_digest: response.digest };
  }

  // General failure case or other specific errors
  if (response.effects?.status?.status === "failure") {
    return {
      PHASE_202,
      err: response.effects?.status?.error,
    };
  }
};
