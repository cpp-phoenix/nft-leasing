import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer";
import { NftWithMetadata, Nft } from "../../../types/nftTypes.js";
import { useMoralisQuery } from "react-moralis";
import { mergeNftsWithMetadata } from "../lib/fetchNft";
import { ListingPanel } from "../components/ListingPanel";
import { useAccount, useConnect } from "wagmi";

const Rentals = () => {
  const { data: accountData } = useAccount();
  const { isConnected } = useConnect();
  
  return (
    <div className="flex bg-white-100 flex-col justify-between min-h-screen">
      <Navbar />
      {isConnected && accountData?.address ? <MyListingsView owner={accountData.address}/> : '' }
      <MyRentalsView />
      <div className="flex flex-col items-center">
        <Footer />
      </div>
    </div>
  );
};

const MyListingsView = ({owner}) => {
  console.log("Owner is:", owner);
  const [nfts, setNfts] = useState<NftWithMetadata[]>([]);
  const { data: rawNftListings, error, isLoading } = useMoralisQuery("Listing", query => query.equalTo("listing.owner", owner).limit(8), [], {});
  
  useEffect(() => {
    const nftListings: Nft[] = rawNftListings.map(nft => {
      return {
        listing: nft.attributes.listing,
        specification: nft.attributes.nftSpecification,
      };
    });
    console.log("NFT Details: ", nftListings);
    mergeNftsWithMetadata(nftListings).then(nftsWithMetadata => setNfts(nftsWithMetadata));
  }, [rawNftListings]);
  
  return (
    <div className="m-20 space-y-6">
      <h1 className="text-4xl font-bold">My Listings</h1>
      {nfts ? nfts.map((nft, index) => (
        <div key={index}>
          <ListingPanel nft={nft} />
        </div>
      )) : (
        <div>
          <p>You haven't listed any NFTs!</p>
          <div>
            <Link to="/list" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded">
              List a Rental
            </Link>
          </div>
        </div>
      )
    }
    </div>
  );
};

const MyRentalsView = () => {
  return (
    <div className="m-20 space-y-6">
      <h1 className="text-4xl font-bold">My Rentals</h1>
      {/* TODO: Check if user has rented NFTs */}
      <p>You haven't rented any NFTs!</p>
      <div>
        <Link to="/explore" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded">
          Explore Current Rentals!
        </Link>
      </div>
    </div>
  );
};

export default Rentals;
