import React, { useState } from "react";
import { NftWithMetadata } from "../../../types/nftTypes.js";
import DatePicker from "react-datepicker";
import { ListingPanel } from "../components/ListingPanel";

export const RentDetails = ({ nft }: { nft: NftWithMetadata }) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="flex flex-row space-x-4 w-content">
      <div className="w-80">
        <ListingPanel nft={nft}  pureNft={true} desc={false}/>
      </div>
      <div className="flex flex-col justify-between">
        <h1 className="text-3xl font-bold">{nft.name}</h1>
        <p className="text-lg">{nft.nft.listing.description}</p>
        <div className="flex flex-col justify-center items-center h-full">
          <h3 className="text-xl font-semibold my-2">Pick your date:</h3>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: any) => {
              setDateRange(update);
            }}
            minDate={new Date()}
            showDisabledMonthNavigation
            inline
          />
          <h3 className="text-lg font-semibold">Price per day: {nft.nft.listing.pricePerDay} ETH</h3>
          <h3 className="text-lg font-semibold">Collateral: {nft.nft.listing.collateral} ETH</h3>
        </div>
        <button className="mt-4 w-full bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
          Rent!
        </button>
      </div>
    </div>
  );
};
