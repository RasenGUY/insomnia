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
  get config() {
    return this._config
  }
  handleContractWrite(request: SimulateContractParameters): Observable<TransactionReceipt> {
    return from(writeContract(this._config, request)).pipe(
      switchMap(hash => this.waitForTransactionReceipt({ hash }))
    );
  }

  waitForTransactionReceipt(params: { hash: `0x${string}` }): Observable<TransactionReceipt> {
    return from(waitForTransactionReceipt(this._config, params));
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