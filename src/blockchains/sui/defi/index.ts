import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  COIN_TYPE,
  IDO_PACKAGE_TESTNET,
  PHASE_202,
  PHASE_203,
  PHASE_204,
  PHASE_201,
} from "../../../utils/utils";

interface CreateIDO {
  signer: Ed25519Keypair;
  amount: number;
  objectId: string;
  networkType: "testnet" | "devnet" | "mainnet";
}

/**
 * Asynchronous function to create an DeFi transaction.
 * @param {createIDOTx} { signer, amount, objectId, networkType }
 * @returns A promise that resolves with the transaction status or error information.
 */

export const createIDOTx = async ({
  signer,
  amount,
  objectId,
  networkType,
}: CreateIDO) => {
  // Establishing connection to the Sui network.
  const rpcUrl = getFullnodeUrl(networkType);
  const client = new SuiClient({ url: rpcUrl });

  // Preparing the transaction block.
  const tx = new TransactionBlock();

  // Convert amount to MIST 1 SUI = 1000000000.
  const txAmount = amount;
  const txValue = Math.floor(+txAmount * 1_000_000_000);
  const coins = tx.splitCoins(tx.gas, [tx.pure(txValue)]);

  // Configuring the transaction call.
  tx.moveCall({
    target: `${IDO_PACKAGE_TESTNET}::boltpay::invest`,
    typeArguments: [COIN_TYPE],
    arguments: [
      tx.object(objectId),
      tx.pure("Powered by Boltpay"),
      tx.pure(txValue),
      coins,
    ],
  });

  // Executing the transaction and handling the response.
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

  // General failure case or other specific errors
  return response.effects?.status?.status === "failure"
    ? PHASE_202
    : response.effects?.status?.error;
};
