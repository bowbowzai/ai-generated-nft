import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AuctionEnd } from "../generated/schema"
import { AuctionEnd as AuctionEndEvent } from "../generated/NFTAuction/NFTAuction"
import { handleAuctionEnd } from "../src/nft-auction"
import { createAuctionEndEvent } from "./nft-auction-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let winner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let amounBid = BigInt.fromI32(234)
    let newAuctionEndEvent = createAuctionEndEvent(winner, tokenId, amounBid)
    handleAuctionEnd(newAuctionEndEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AuctionEnd created and stored", () => {
    assert.entityCount("AuctionEnd", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AuctionEnd",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "winner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AuctionEnd",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AuctionEnd",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amounBid",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
