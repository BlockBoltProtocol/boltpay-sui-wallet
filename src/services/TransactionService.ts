import { SuiClient } from '@mysten/sui/client';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';
import { InternalSendParams, SendResult } from '../types/index';
import { CONSTANTS } from '../utils/constant';

export class TransactionService {
    constructor(private client: SuiClient) {}
  
    async send(params: InternalSendParams): Promise<SendResult> {
      const tx = new Transaction();
      const coin = this.getCoin(params.amount, params.coinType);
  
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULE_NAME}::${CONSTANTS.FUNCTION_NAME}`,
        typeArguments: [params.coinType],
        arguments: [
          tx.object(coin),
          tx.object(params.coinType === CONSTANTS.SUI_COIN_TYPE ? CONSTANTS.SUI_TREASURY : params.treasury),
          tx.object(CONSTANTS.FEE_SETTING),
          tx.pure.string(params.nameProduct),
          tx.pure.address(params.receiverAddr),
          tx.pure.u64(params.amount),
          tx.pure.u64(params.randomId),
        ],
      });
  
      const result = await this.client.signAndExecuteTransaction({
        signer: params.keyPair,
        transaction: tx,
        options: { showEffects: true },
      });
  
      return {
        digest: result.digest,
        effects: result.effects,
        error: result.effects?.status.error,
      };
    }
  
    private getCoin(amount: number, coinType: string) {
      if (coinType === CONSTANTS.SUI_COIN_TYPE) {
        return coinWithBalance({ balance: amount, useGasCoin: true });
      } else {
        return coinWithBalance({ balance: amount, type: coinType });
      }
    }
}