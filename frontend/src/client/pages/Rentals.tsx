import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer";
import { NftWithMetadata, Nft } from "../../../types/nftTypes.js";
import { useMoralisQuery } from "react-moralis";
import { ListingPanel } from "../components/ListingPanel";
import { useAccount, useConnect } from "wagmi";
import { Query } from "../../../types/queryTypes.js";
import { mergeNftsWithMetadata } from "../lib/fetchNft";
import { Popup } from "../components/Popup";
import { RentDetails } from "../components/RentDetails";

const PaginatedNFTs = (queryObj: Query) => {

  let nftListingsData = getQueryData(queryObj);
  const [nfts, setNfts] = useState<NftWithMetadata[]>([]);
  const [selectedNft, setSelectedNft] = useState<NftWithMetadata | null>(null);
  
  useEffect(() => {
    const nftListings: Nft[] = nftListingsData.map(nft => {
      return {
        listing: nft.attributes.listing,
        specification: nft.attributes.nftSpecification,
      };
    });
    mergeNftsWithMetadata(nftListings).then(nftsWithMetadata => setNfts(nftsWithMetadata));
  }, [nftListingsData]);

  return (
    <>
      {selectedNft && (
        <Popup closeHandler={() => setSelectedNft(null)}>
          <RentDetails nft={selectedNft} />
        </Popup>
      )}
      <div className="grid grid-cols-4 gap-4 w-full">
        {
        nfts.map((nft, index) => (
          <div onClick={() => setSelectedNft(nft)} key={index}>
            <ListingPanel nft={nft} />
          </div>
          ))
        }
      </div>
    </>
)
}

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

function getQueryData(queryObj:Query){
  let { data, error, isLoading } = useMoralisQuery(queryObj.table, query => query.equalTo(queryObj.queryKey, queryObj.queryValue).limit(queryObj.limitPerPage).skip(queryObj.skipPage * queryObj.limitPerPage), [], {});
  return data;
}

const MyListingsView = ({owner}) => {

  const [currPage, setCurrPage] = useState(0);
  const [queryObj, setQueryObj] = useState<Query>({
    table: "Listing",
    queryKey: "listing.owner",
    queryValue: owner,
    limitPerPage: 8,
    skipPage: 0
  });

  function goPrev(queryObj:Query) {
    if(currPage > 0) {
      setQueryObj({...queryObj, skipPage: currPage - 1})
      return currPage - 1;
    } else {
      return 0;
    }
  }
  
  function goNext(queryObj:Query) {
    setQueryObj({...queryObj, skipPage: currPage + 1})
    return currPage + 1;
  }
  
  return (
    <div className="m-20 space-y-10">
      <h1 className="text-4xl font-bold">My Listings</h1>
      <div className="h-8/12">
        <PaginatedNFTs {...queryObj}/>
      </div>
      <div className="flex justify-center items-center w-full h-10">
        <button onClick={() => setCurrPage(goPrev(queryObj))}  className="rounded-lg px-4 py-2 bg-indigo-500 text-white font-semibold">Prev</button>
        <span className="rounded-lg px-4 py-2 text-bold text-xl">{currPage + 1}</span>
        <button onClick={() => setCurrPage(goNext(queryObj))} className="rounded-lg px-4 py-2 bg-indigo-500 text-white font-semibold">Next</button>
      </div> 
      {/* {nfts ? (
      <div className="h-8/12">
        <PaginatedNFTs queryObj={queryObj}/> */}
        {/* <div className="flex justify-center items-center w-full border-4 h-10">
          <button onClick={() => setCurrPage(goPrev(queryObj))}  className="rounded-lg px-4 py-2 bg-indigo-500 text-white font-semibold">Prev</button>
          <span className="rounded-lg px-4 py-2 text-bold text-xl">{currPage + 1}</span>
          <button onClick={() => setCurrPage(goNext(queryObj))} className="rounded-lg px-4 py-2 bg-indigo-500 text-white font-semibold">Next</button>
        </div> */}
      {/* </div>
      )
       : (
        <div>
          <p>You haven't listed any NFTs!</p>
          <div>
            <Link to="/list" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded">
              List a Rental
            </Link>
          </div>
        </div>
      )
    } */}
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
