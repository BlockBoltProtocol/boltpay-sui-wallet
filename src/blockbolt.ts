import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { TransactionService } from './services/TransactionService';
import { TreasuryService } from './services/TresuryService';
import {  SendParams, SendResult, InternalSendParams } from './types';

export class BlockBolt {
    private client: SuiClient;
    private transactionService: TransactionService;
    private treasuryService: TreasuryService;
  
    constructor() {
      const rpcUrl = getFullnodeUrl("mainnet");
      this.client = new SuiClient({ url: rpcUrl });
      this.transactionService = new TransactionService(this.client);
      this.treasuryService = new TreasuryService(this.client);
    }

    async send(params: SendParams): Promise<SendResult> {
        const internalParams = await this.prepareInternalParams(params);
        return this.transactionService.send(internalParams);
      }
    
    private async prepareInternalParams(params: SendParams): Promise<InternalSendParams> {
        const treasury = await this.treasuryService.getTreasury(params.coinType);
        return {
          ...params,
          treasury,
        };
      }
  
}

  