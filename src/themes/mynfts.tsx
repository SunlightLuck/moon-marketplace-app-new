import React, { useState, useEffect } from "react";
import Moralis from "moralis";
import { EvmChain, EvmAddress } from "@moralisweb3/evm-utils";
import { useAccount } from "wagmi";
import axios from "axios";

import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Explore from "../components/Explore";
import Footer from "../components/Footer";
import ModalMenu from "../components/Modal/ModalMenu";
import Scrollup from "../components/Scrollup";

const REDDIT_DEPLOYER = "0x36FB3886CF3Fc4E44d8b99D9a8520425239618C2";
const CONTRACT_CREATE_METHOD = "0x60806040";

const MyNFTs = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const getRedditContracts = async () => {
    let redditContracts: any[] = [];
    try {
      let redditTx;
      do {
        redditTx = await Moralis.EvmApi.transaction.getWalletTransactions({
          address: REDDIT_DEPLOYER,
          chain: EvmChain.POLYGON,
          ...(redditTx ? { cursor: redditTx?.pagination.cursor } : {}),
        });
        redditTx.result.map((element) => {
          if (element.data?.startsWith(CONTRACT_CREATE_METHOD)) {
            redditContracts = [
              ...redditContracts,
              element.contractAddress?.lowercase,
            ];
          }
        });
      } while (redditTx.pagination.cursor);
    } catch (err) {}
    return redditContracts;
  };

  const getMyNFTs = async () => {
    let genesis: any[] = [];
    try {
      await Moralis.start({
        apiKey: process.env.REACT_APP_MORALIS_API_KEY,
      });

      const redditContracts: any = await getRedditContracts();

      const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        address: address ?? "",
        chain: EvmChain.POLYGON,
      });

      await Promise.all(
        nfts.result.map(async (element) => {
          const ipfsData = await axios
            .get(
              (element?.tokenUri ?? "").replace(
                "ipfs.moralis.io:2053",
                "ipfs.io"
              )
            )
            .then((res) => res.data);

          if (redditContracts.includes(element.tokenAddress.lowercase)) {
            genesis = [
              ...genesis,
              {
                id: element.result.tokenId,
                img: ipfsData.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
                title: ipfsData.name,
                description: ipfsData.description,
                selected: false,
                contractAddress: element.tokenAddress.checksum,
                owner: element.ownerOf?.checksum,
                mode: element.contractType === "ERC721" ? 0 : 1,
              },
            ];
          }
        })
      );
    } catch (err) {}
    return genesis;
  };

  useEffect(() => {
    setLoading(true);
    getMyNFTs().then((res) => {
      setNfts(res);
      setLoading(false);
    });
  }, [address]);
  return (
    <div className="main">
      <Header />
      <Breadcrumb title="My NFTs" />
      <Explore nfts={nfts} loading={loading} />
      <Footer />
      <ModalMenu />
      <Scrollup />
    </div>
  );
};

export default MyNFTs;
