import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export interface SdkConfig {
  network: 'mainnet';
}

export interface SendParams {
    keyPair: Ed25519Keypair;
    receiverAddr: string;
    nameProduct: string;
    amount: number;
    coinType: string;
    randomId: bigint;  

}

export interface InternalSendParams extends SendParams {
    treasury: string;
}
  
export interface SendResult {
    digest: string;
    effects: any;
    error?: string;
}

 

