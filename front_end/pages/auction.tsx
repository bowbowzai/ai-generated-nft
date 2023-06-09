import React, { useState, useEffect } from "react";
import truncateEthAddress from "truncate-eth-address";
import moment from "moment";
import Tilt from "react-parallax-tilt";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { FaEthereum } from "react-icons/fa";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { endIn } from "@/utils/endIn";
import { ToastContainer, toast } from "react-toastify";
import { HighestBidder } from "@/types/TNewHighestBidder";
import {
  AuctionSkeleton,
  Skeleton,
  Loading,
  OpeningSoon,
  NewHighestBidder,
} from "@/components";
import { useRecentAuctions, useNewHighestBidder } from "@/hooks/graph";
import { useAuctionState, useBidNFT, useCurrentAuction } from "@/hooks/auction";
import { useTokenURI } from "@/hooks/ainft";
import "react-toastify/dist/ReactToastify.css";

const Auction = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected: isWalletConnected } = useAccount();

  const { data: auctionState, isLoading: isAuctionStateLoading } =
    useAuctionState();

  const { data: recentAuctions, loading: recentAuctionsLoading } =
    useRecentAuctions();

  const {
    data: currentAuction,
    refetch: refetchCurrentAuction,
    isLoading: isCurrentAuctionLoading,
  } = useCurrentAuction();

  const { mutate: bidNFT } = useBidNFT(handleSuccess, handleFailure);

  const {
    data: newHighestBidder,
    loading: highestBiddersLoading,
    refetch: refetchHighestBidders,
  } = useNewHighestBidder();

  const { data: auctionTokenIPFSMeta, refetch: auctionTokenIPFSRefetch } =
    useTokenURI(currentAuction?.tokenId, false, fetchImage);

  const [bidAmount, setBidAmount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (currentAuction?.highestBidAmount) {
      setBidAmount(
        +ethers.utils.formatEther(currentAuction?.highestBidAmount.toString()) +
          0.001
      );
    }
    if (currentAuction?.tokenId) {
      auctionTokenIPFSRefetch();
    }
    setIsConnected(isWalletConnected);
  }, [isCurrentAuctionLoading, isWalletConnected]);

  async function connectWallet() {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
  }

  async function fetchImage(ipfsMetadata: string) {
    fetch(ipfsMetadata, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const hashedToken = data.image.toString().replace("ipfs://", "");
        setImageUrl(`https://ipfs.io/ipfs/${hashedToken}`);
      });
  }

  async function bid() {
    if (isConnected) {
      setIsWaiting(true);
      bidNFT(ethers.utils.parseEther(bidAmount.toString()).toString());
    }
  }

  async function handleSuccess(transactionHash: string) {
    setTimeout(() => {
      toast.success("Transaction successfully, view your transaction detail!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        onClick: () => {
          const url = `https://mumbai.polygonscan.com/tx/${transactionHash}`;
          window.open(url, "_blank", "noopener,noreferrer");
        },
      });
    }, 100);

    await refetchCurrentAuction();

    setIsWaiting(false);
    await refetchHighestBidders();
  }

  async function handleFailure() {
    setIsWaiting(false);
  }

  return (
    <div className="px-10">
      <ToastContainer />
      {isAuctionStateLoading && recentAuctionsLoading ? (
        <>
          <div className="mx-auto w-fit">
            <AuctionSkeleton />
          </div>
        </>
      ) : !auctionState ||
        currentAuction?.endTimestamp?.toString() - moment().unix() <= 0 ? (
        // auction closed
        <>
          <div>
            <OpeningSoon />
            <div className="my-7" />
            {/* <RecentAuctions recentAuctions={recentAuctions?.auctionEnds} /> */}
          </div>
        </>
      ) : (
        <div>
          <div className="mt-5 lg:mt-0 text-center">
            Auction close in{" "}
            <span className="font-bold">
              {endIn(currentAuction?.endTimestamp)}
            </span>
          </div>
          <div>
            <div className="mt-5 flex flex-col lg:flex-row justify-center items-center gap-x-10">
              <div className="flex-[2]">
                <div className="mb-5 flex flex-col items-center">
                  <div className="flex items-center">
                    Highest Bidder:{" "}
                    <div className="ml-2 mt-1 mr-1">
                      <MetaMaskAvatar address="0xA0a2233c1f8CD2e549B2f864F095A7c464ac1Ee9" />
                    </div>
                    <div>
                      {" "}
                      {truncateEthAddress(currentAuction?.highestBidder || "")}
                    </div>{" "}
                  </div>
                  <div className="flex items-center">
                    Highest Bid Amount:{" "}
                    <div className="flex gap-1 items-center  ml-2 mt-1 mr-1">
                      <span>
                        {Number(
                          ethers.utils.formatEther(
                            currentAuction?.highestBidAmount || "0"
                          )
                        )
                          .toFixed(4)
                          .toString()}
                      </span>
                      <FaEthereum className="text-lg" />
                    </div>{" "}
                  </div>
                </div>
                <div className="w-fit mx-auto">
                  {imageUrl != "" && (
                    <Tilt>
                      <div className="mx-auto">
                        <img
                          src={imageUrl}
                          alt="nft image"
                          className="h-[250px] w-[400px] object-cover mx-auto rounded-lg"
                        />
                      </div>
                    </Tilt>
                  )}
                </div>

                {isConnected ? (
                  isWaiting ? (
                    <div className="flex justify-center">
                      <Loading title="Waiting transaction..." />
                    </div>
                  ) : (
                    <div>
                      <div className="mt-3 flex justify-center">
                        <div>Set your amount:</div>
                        {currentAuction?.highestBidAmount && (
                          <input
                            type="number"
                            onChange={(e) => {
                              if (
                                parseFloat(e.target.value) >
                                +ethers.utils.formatEther(
                                  currentAuction?.highestBidAmount.toString()
                                )
                              ) {
                                setBidAmount(Number(e.target.value));
                              }
                            }}
                            value={bidAmount.toFixed(4)}
                            step={0.001}
                            min={
                              +ethers.utils.formatEther(
                                currentAuction?.highestBidAmount.toString()
                              ) + 0.001
                            }
                            className="w-[100px] bg-transparent outline-none border-none select-none text-center"
                          />
                        )}
                      </div>
                      <div
                        onClick={bid}
                        className="flex gap-3 w-fit mx-auto mt-5 border border-1 border-white select-none cursor-pointer px-5 py-3 rounded-lg hover:scale-110 transition"
                      >
                        <div>Pay With</div>
                        {bidAmount.toFixed(4)}
                        <FaEthereum className="text-lg" />
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    className="w-fit mx-auto mt-5 border border-1 border-white select-none cursor-pointer px-5 py-3 rounded-lg hover:scale-110 transition"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </div>
                )}
              </div>
              <div className="flex-[1] w-full flex justify-center lg:justify-start">
                {highestBiddersLoading ? (
                  <div className="mt-5">
                    <Skeleton />
                  </div>
                ) : (
                  <ol className="w-[80%] mt-10 relative border-l border-gray-200 dark:border-gray-700">
                    {newHighestBidder?.newHighestBidders.map(
                      (bidder: HighestBidder) => (
                        <NewHighestBidder
                          key={bidder.transactionHash}
                          bidder={bidder}
                        />
                      )
                    )}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auction;
