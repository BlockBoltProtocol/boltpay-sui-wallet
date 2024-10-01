
import { SuiClient } from '@mysten/sui/client';
import { CONSTANTS } from '../utils/constant';

class MerchantFeeError extends Error {
  constructor(message: string, public coinType: string) {
    super(message);
    this.name = 'MerchantFeeError';
  }
}

export class TreasuryService {
  constructor(private client: SuiClient) {}

  async getMerchantFee(coinType: string): Promise<string> {
    try {
      if (coinType === CONSTANTS.SUI_COIN_TYPE) {
        return CONSTANTS.SUI_TREASURY_FEE;
      }

      const response = await this.client.getObject({
        id: CONSTANTS.DATABASE_OBJECT_ID,
        options: { showContent: true },
      });

      const content = response.data?.content as any;
      if (!content?.fields) {
        throw new MerchantFeeError('Invalid database object structure', coinType);
      }

      const entries = content.fields.entries.fields.contents;
      if (!entries) {
        throw new MerchantFeeError('No entries found in database object', coinType);
      }

      const treasuryData = entries.map((entry: any) => ({
        key: entry.fields.key,
        value: entry.fields.value,
      }));

      const result = treasuryData.find((entry: { key: string; }) => entry.key === coinType);
      if (!result) {
        throw new MerchantFeeError(`Merchant fee not found for ${coinType}`, coinType);
      }

      return result.value;
    } catch (error) {
      if (error instanceof MerchantFeeError) {
        console.error(`MerchantFeeError: ${error.message} (CoinType: ${error.coinType})`);
      } else {
        console.error('Unexpected error in getMerchantFee:', error);
      }
      throw error;
    }
  }
}
