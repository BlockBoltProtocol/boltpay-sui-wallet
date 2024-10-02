
import { SuiClient } from '@mysten/sui/client';
import { CONSTANTS } from '../utils/constant';

class TreasuryError extends Error {
  constructor(message: string, public coinType: string) {
    super(message);
    this.name = 'TreasuryError';
  }
}

export class TreasuryService {
  constructor(private client: SuiClient) {}

  async getTreasury(coinType: string): Promise<string> {
    try {
      if (coinType === CONSTANTS.SUI_COIN_TYPE) {
        return CONSTANTS.SUI_TREASURY;
      }

      const response = await this.client.getObject({
        id: CONSTANTS.DATABASE_OBJECT_ID,
        options: { showContent: true },
      });

      const content = response.data?.content as any;
      if (!content?.fields) {
        throw new TreasuryError('Invalid database object structure', coinType);
      }

      const entries = content.fields.entries.fields.contents;
      if (!entries) {
        throw new TreasuryError('No entries found in database object', coinType);
      }

      const treasuryData = entries.map((entry: any) => ({
        key: entry.fields.key,
        value: entry.fields.value,
      }));

      const result = treasuryData.find((entry: { key: string; }) => entry.key === coinType);
      if (!result) {
        throw new TreasuryError(`TreasuryError not found for ${coinType}`, coinType);
      }

      return result.value;
    } catch (error) {
      if (error instanceof TreasuryError) {
        console.error(`TreasuryError not found: ${error.message} (CoinType: ${error.coinType})`);
      } else {
        console.error('Unexpected error in getTreasury:', error);
      }
      throw error;
    }
  }
}
