// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class CancelListing extends ethereum.Event {
  get params(): CancelListing__Params {
    return new CancelListing__Params(this);
  }
}

export class CancelListing__Params {
  _event: CancelListing;

  constructor(event: CancelListing) {
    this._event = event;
  }

  get nftContractAddr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class NFTSold extends ethereum.Event {
  get params(): NFTSold__Params {
    return new NFTSold__Params(this);
  }
}

export class NFTSold__Params {
  _event: NFTSold;

  constructor(event: NFTSold) {
    this._event = event;
  }

  get buyer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nftContractAddr(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class NewNFTItemListed extends ethereum.Event {
  get params(): NewNFTItemListed__Params {
    return new NewNFTItemListed__Params(this);
  }
}

export class NewNFTItemListed__Params {
  _event: NewNFTItemListed;

  constructor(event: NewNFTItemListed) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nftContractAddr(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class NFTMarketplaceOwnershipTransferred extends ethereum.Event {
  get params(): NFTMarketplaceOwnershipTransferred__Params {
    return new NFTMarketplaceOwnershipTransferred__Params(this);
  }
}

export class NFTMarketplaceOwnershipTransferred__Params {
  _event: NFTMarketplaceOwnershipTransferred;

  constructor(event: NFTMarketplaceOwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class VoteOnNft extends ethereum.Event {
  get params(): VoteOnNft__Params {
    return new VoteOnNft__Params(this);
  }
}

export class VoteOnNft__Params {
  _event: VoteOnNft;

  constructor(event: VoteOnNft) {
    this._event = event;
  }

  get nftContractAddr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get totalVote(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NFTMarketplace__getListedItemResultValue0Struct extends ethereum.Tuple {
  get seller(): Address {
    return this[0].toAddress();
  }

  get nftContractAddr(): Address {
    return this[1].toAddress();
  }

  get tokenId(): BigInt {
    return this[2].toBigInt();
  }

  get price(): BigInt {
    return this[3].toBigInt();
  }
}

export class NFTMarketplace extends ethereum.SmartContract {
  static bind(address: Address): NFTMarketplace {
    return new NFTMarketplace("NFTMarketplace", address);
  }

  getListedItem(
    _nftContractAddr: Address,
    _tokenId: BigInt
  ): NFTMarketplace__getListedItemResultValue0Struct {
    let result = super.call(
      "getListedItem",
      "getListedItem(address,uint256):((address,address,uint256,uint256))",
      [
        ethereum.Value.fromAddress(_nftContractAddr),
        ethereum.Value.fromUnsignedBigInt(_tokenId)
      ]
    );

    return changetype<NFTMarketplace__getListedItemResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getListedItem(
    _nftContractAddr: Address,
    _tokenId: BigInt
  ): ethereum.CallResult<NFTMarketplace__getListedItemResultValue0Struct> {
    let result = super.tryCall(
      "getListedItem",
      "getListedItem(address,uint256):((address,address,uint256,uint256))",
      [
        ethereum.Value.fromAddress(_nftContractAddr),
        ethereum.Value.fromUnsignedBigInt(_tokenId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<NFTMarketplace__getListedItemResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getListedNftLikes(_nftContractAddr: Address, _tokenId: BigInt): BigInt {
    let result = super.call(
      "getListedNftLikes",
      "getListedNftLikes(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_nftContractAddr),
        ethereum.Value.fromUnsignedBigInt(_tokenId)
      ]
    );

    return result[0].toBigInt();
  }

  try_getListedNftLikes(
    _nftContractAddr: Address,
    _tokenId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getListedNftLikes",
      "getListedNftLikes(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_nftContractAddr),
        ethereum.Value.fromUnsignedBigInt(_tokenId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getSellerEarned(_seller: Address): BigInt {
    let result = super.call(
      "getSellerEarned",
      "getSellerEarned(address):(uint256)",
      [ethereum.Value.fromAddress(_seller)]
    );

    return result[0].toBigInt();
  }

  try_getSellerEarned(_seller: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getSellerEarned",
      "getSellerEarned(address):(uint256)",
      [ethereum.Value.fromAddress(_seller)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class BuyNftCall extends ethereum.Call {
  get inputs(): BuyNftCall__Inputs {
    return new BuyNftCall__Inputs(this);
  }

  get outputs(): BuyNftCall__Outputs {
    return new BuyNftCall__Outputs(this);
  }
}

export class BuyNftCall__Inputs {
  _call: BuyNftCall;

  constructor(call: BuyNftCall) {
    this._call = call;
  }

  get _nftContractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class BuyNftCall__Outputs {
  _call: BuyNftCall;

  constructor(call: BuyNftCall) {
    this._call = call;
  }
}

export class CancelListingCall extends ethereum.Call {
  get inputs(): CancelListingCall__Inputs {
    return new CancelListingCall__Inputs(this);
  }

  get outputs(): CancelListingCall__Outputs {
    return new CancelListingCall__Outputs(this);
  }
}

export class CancelListingCall__Inputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }

  get _nftContractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CancelListingCall__Outputs {
  _call: CancelListingCall;

  constructor(call: CancelListingCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SellNftCall extends ethereum.Call {
  get inputs(): SellNftCall__Inputs {
    return new SellNftCall__Inputs(this);
  }

  get outputs(): SellNftCall__Outputs {
    return new SellNftCall__Outputs(this);
  }
}

export class SellNftCall__Inputs {
  _call: SellNftCall;

  constructor(call: SellNftCall) {
    this._call = call;
  }

  get _nftContractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _price(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SellNftCall__Outputs {
  _call: SellNftCall;

  constructor(call: SellNftCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpadteNftSellingStateCall extends ethereum.Call {
  get inputs(): UpadteNftSellingStateCall__Inputs {
    return new UpadteNftSellingStateCall__Inputs(this);
  }

  get outputs(): UpadteNftSellingStateCall__Outputs {
    return new UpadteNftSellingStateCall__Outputs(this);
  }
}

export class UpadteNftSellingStateCall__Inputs {
  _call: UpadteNftSellingStateCall;

  constructor(call: UpadteNftSellingStateCall) {
    this._call = call;
  }

  get _nftContractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _updatePrice(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpadteNftSellingStateCall__Outputs {
  _call: UpadteNftSellingStateCall;

  constructor(call: UpadteNftSellingStateCall) {
    this._call = call;
  }
}

export class VoteOnNftCall extends ethereum.Call {
  get inputs(): VoteOnNftCall__Inputs {
    return new VoteOnNftCall__Inputs(this);
  }

  get outputs(): VoteOnNftCall__Outputs {
    return new VoteOnNftCall__Outputs(this);
  }
}

export class VoteOnNftCall__Inputs {
  _call: VoteOnNftCall;

  constructor(call: VoteOnNftCall) {
    this._call = call;
  }

  get _nftContractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class VoteOnNftCall__Outputs {
  _call: VoteOnNftCall;

  constructor(call: VoteOnNftCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawEarnedCall extends ethereum.Call {
  get inputs(): WithdrawEarnedCall__Inputs {
    return new WithdrawEarnedCall__Inputs(this);
  }

  get outputs(): WithdrawEarnedCall__Outputs {
    return new WithdrawEarnedCall__Outputs(this);
  }
}

export class WithdrawEarnedCall__Inputs {
  _call: WithdrawEarnedCall;

  constructor(call: WithdrawEarnedCall) {
    this._call = call;
  }
}

export class WithdrawEarnedCall__Outputs {
  _call: WithdrawEarnedCall;

  constructor(call: WithdrawEarnedCall) {
    this._call = call;
  }
}
