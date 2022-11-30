import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// importing all the themes
import Home from "../themes/home";
import Auctions from "../themes/auctions";
import MyAuctions from "../themes/myauctions";
import MyNFTs from "../themes/mynfts";
import WalletConnect from "../themes/wallet-connect";
import ItemDetails from "../themes/item-details";
import { useAccount } from "wagmi";

const MyRouts = () => {
  const { isConnected } = useAccount();
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/auction" element={<Auctions></Auctions>}></Route>
          <Route
            path="/mynfts"
            element={
              isConnected ? <MyNFTs></MyNFTs> : <Navigate to={"/"}></Navigate>
            }
          ></Route>
          <Route
            path="/myauctions"
            element={
              isConnected ? (
                <MyAuctions></MyAuctions>
              ) : (
                <Navigate to="/"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/wallet-connect"
            element={
              isConnected ? (
                <Navigate to="/"></Navigate>
              ) : (
                <WalletConnect></WalletConnect>
              )
            }
          ></Route>
          <Route
            path="/item-details/:contractAddress/:tokenId"
            element={<ItemDetails></ItemDetails>}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default MyRouts;
