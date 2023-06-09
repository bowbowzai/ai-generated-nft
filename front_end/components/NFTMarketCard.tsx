import React, { useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import { AiFillLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { useAccount } from "wagmi";
import { Tooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import truncateEthAddress from "truncate-eth-address";
import { ActiveItem } from "@/types/TActiveItem";
import { useTokenURI } from "@/hooks/ainft";
import {
  useBuyNFT,
  useVoteOnNFT,
  useUpdateListedItem,
  useCancelListing,
} from "@/hooks/marketplace";
import "react-tooltip/dist/react-tooltip.css";
import "react-toastify/dist/ReactToastify.css";

const NFTMarketCard = ({
  activeItem,
  activeItemsRefetch,
}: {
  activeItem: ActiveItem;
  activeItemsRefetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}) => {
  const { address, isConnected } = useAccount();

  const { data: auctionTokenIPFSMeta, refetch: auctionTokenIPFSRefetch } =
    useTokenURI(activeItem.tokenId, true, fetchImage);

  const { mutate: cancelList } = useCancelListing(
    handleSuccessAndRefetch,
    handleTransactionFailed
  );

  const { mutate: buyNFT } = useBuyNFT(
    handleSuccessAndRefetch,
    handleTransactionFailed
  );

  const { mutate: voteNFT } = useVoteOnNFT(
    handleSuccessAndRefetch,
    handleTransactionFailed
  );

  const { mutate: updateListedItem } = useUpdateListedItem(
    handleSuccessAndRefetch,
    handleTransactionFailed
  );

  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [previousPrice, setPreviousPrice] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState(
    ethers.utils.formatEther(activeItem.price)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  function handleCancelListClick() {
    if (isUpdating) {
      setIsUpdating(false);
      return;
    }
    cancelList({
      nftContractAddr: activeItem.nftAddress,
      tokenId: activeItem.tokenId,
    });
  }

  function handleVoteNFTClick() {
    voteNFT({
      nftContractAddr: activeItem.nftAddress,
      tokenId: activeItem.tokenId,
    });
  }

  function handleBuyNFTClick() {
    buyNFT({
      nftContractAddr: activeItem.nftAddress,
      tokenId: activeItem.tokenId,
      buyAmount: activeItem.price,
    });
  }

  function handleUpdateClick() {
    let currentState = isUpdating;
    setIsUpdating((prev) => !prev);
    if (
      ethers.utils.formatEther(activeItem.price) == updatedPrice ||
      !currentState ||
      updatedPrice == previousPrice
    )
      return;

    updateListedItem({
      nftContractAddr: activeItem.nftAddress,
      tokenId: activeItem.tokenId,
      price: ethers.utils.parseEther(updatedPrice).toString(),
    });
    setPreviousPrice(updatedPrice);
  }

  function handleSuccessAndRefetch(transactionHash: string) {
    activeItemsRefetch();
    handleTransactionSuccess(transactionHash);
  }

  function handleTransactionSuccess(transactionHash: string) {
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
  }

  function handleTransactionFailed(err: any) {
    if (!err.toString().includes("user rejected transaction")) {
      setTimeout(() => {
        toast.error("Something went wrong, please try later", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }, 100);
    }
  }

  async function fetchImage(ipfsMetadata: string) {
    fetch(ipfsMetadata, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setDescription(data.description);
        const hashedToken = data.image.toString().replace("ipfs://", "");
        setImageUrl(`https://ipfs.io/ipfs/${hashedToken}`);
      });
  }

  return (
    <div className="relative w-full max-w-sm border border-gray-200 rounded-lg shadow bg-secondary dark:border-gray-700 h-auto pb-4">
      <Tooltip id="my-tooltip" />
      <ToastContainer />

      <div className="relative">
        {imageUrl ? (
          <img
            className="h-[200px] w-full object-cover rounded-t-lg"
            src={imageUrl}
            alt={description}
          />
        ) : (
          <div className="h-[200px] py-1 text-center">Loading...</div>
        )}

        {isConnected && (
          <div
            onClick={handleVoteNFTClick}
            className="absolute top-2 right-2 transition hover:scale-110 cursor-pointer"
          >
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Give a like!"
              data-tooltip-place="top"
            >
              <FcLike className="w-10 h-10 " />
            </a>
          </div>
        )}
      </div>
      <div className="px-5 pb-3 relative">
        <div>
          <h5 className="w-[80%] mt-5 mb-2 font-semibold tracking-tight text-gray-900 dark:text-white truncate">
            {description}
          </h5>
          <div>Owned By: {truncateEthAddress(activeItem.seller)}</div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            {" "}
            <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
              <span>{activeItem.votes}</span>
              <AiFillLike className="-mt-1" />
            </span>
            <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
              {isUpdating ? (
                <input
                  onChange={(e) => {
                    setUpdatedPrice(e.target.value);
                  }}
                  type="number"
                  defaultValue={updatedPrice}
                  min={"0.001"}
                  step={"0.001"}
                  className="w-[50%] bg-transparent outline-none border border-1 border-gray-300 px-2 py-1"
                />
              ) : (
                <span>{updatedPrice}</span>
              )}{" "}
              <FaEthereum />
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 ">
        <div>
          {activeItem.seller.toUpperCase() === address?.toUpperCase() ? (
            <div
              className="inline-flex justify-end rounded-md shadow-sm"
              role="group"
            >
              <button
                onClick={handleCancelListClick}
                type="button"
                className="px-2 py-1 text-sm font-medium rounded-l-md text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700"
              >
                {isUpdating ? "Cancel Update" : "Cancel List"}
              </button>
              <button
                onClick={handleUpdateClick}
                type="button"
                className="px-2 py-1 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700"
              >
                {isUpdating ? "Complete" : "Update"}
              </button>
            </div>
          ) : isConnected ? (
            <div
              onClick={handleBuyNFTClick}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
            >
              Buy
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTMarketCard;
