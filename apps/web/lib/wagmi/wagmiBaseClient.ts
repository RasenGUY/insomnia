import { Address, TransactionReceipt } from "viem";
import { 
  SUPPORTED_EXPLORERS, 
  WalletLabel 
} from "../constants/supported-chains";
import { 
  Config, 
  writeContract, 
  waitForTransactionReceipt,
  SimulateContractParameters 
} from "@wagmi/core"
import { from, Observable, switchMap } from "rxjs";

class WagmiBaseClient {
  private readonly _config: Config;
    
  constructor(
    config: Config
  ){
    this._config = config;
  }
  get config(){
    return this._config;
  }

  handleContractWrite(config: Config, request: SimulateContractParameters): Observable<TransactionReceipt> {
    return from(writeContract(config, request)).pipe(
      switchMap(hash => this.waitForTransactionReceipt(config, { hash }))
    );
  }

  waitForTransactionReceipt(config: Config, params: { hash: `0x${string}` }): Observable<TransactionReceipt> {
    return from(waitForTransactionReceipt(config, params));
  }
  
  static createExplorerTxHashUrl(walletLabel: WalletLabel, txHash: string): string {
    const baseUrl = SUPPORTED_EXPLORERS[walletLabel]; 
    return `${baseUrl}/tx/${txHash}`;
  }
  
  static createExplorerAddressUrl(walletLabel: WalletLabel, address: Address): string {
    const baseUrl = SUPPORTED_EXPLORERS[walletLabel]; 
    return `${baseUrl}/address/${address}`;
  }
}

export default WagmiBaseClient;