import {
  BigNumberish,
  ContractFactory,
  Signer,
  Overrides,
  BaseContract,
  Interface,
  Listener,
  ContractRunner,
  ContractEventName,
  EventLog,
  Log,
  ContractTransaction,
  ContractTransactionResponse,
} from "ethers";
import {
  PromiseOrValue,
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from "@/types";

import metadata from "@/hardhat/artifacts/contracts/MyNFT.sol/MyNFT.json";

type NftContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

export const isSuperArgs = (
  xs: NftContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export interface NftContractInterface extends Interface {}

export interface MintedEventObject {
  tokenId: number;
  to: string;
}

export type MintedEvent = TypedEvent<[BigNumberish, string], MintedEventObject>;

export type MintedEventFilter = TypedEventFilter<MintedEvent>;

export interface NftContract extends BaseContract {
  connect(runner: ContractRunner): BaseContract;
  attach(addressOrName: string): BaseContract;
  deployed(): Promise<this>;

  interface: NftContractInterface;

  queryFilter(
    event: ContractEventName,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<EventLog | Log>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(event?: ContractEventName | undefined): Promise<Listener[]>;
  removeAllListeners(event?: ContractEventName | undefined): Promise<this>;
  removeAllListeners(eventName?: string): this;
  off: (
    event: ContractEventName,
    listener?: Listener | undefined
  ) => Promise<this>;
  on: (event: ContractEventName, listener: Listener) => Promise<this>;
  once: (event: ContractEventName, listener: Listener) => Promise<this>;
  removeListener: (
    event: ContractEventName,
    listener: Listener
  ) => Promise<this>;

  functions: {
    mint(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      tokenURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<string>;
  };

  mint(
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    tokenURI: PromiseOrValue<string>,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransactionResponse>;

  ownerOf(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<string>;
}

export class NftContractFactory extends ContractFactory {
  constructor(...args: NftContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(metadata.abi, metadata.bytecode, args[0]);
    }
  }
  override attach(address: string): NftContract {
    return super.attach(address) as NftContract;
  }
  override connect(signer: Signer): NftContractFactory {
    return super.connect(signer) as NftContractFactory;
  }
  static readonly bytecode = metadata.bytecode;
  static readonly abi = metadata.abi;
  static createInterface(): NftContractInterface {
    return new Interface(metadata.abi) as NftContractInterface;
  }
  static connect(address: string, signerOrProvider: Signer): NftContract {
    return new BaseContract(
      address,
      metadata.abi,
      signerOrProvider
    ) as NftContract;
  }
}
