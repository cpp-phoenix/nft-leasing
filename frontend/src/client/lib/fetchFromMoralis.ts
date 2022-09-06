import { Query } from "../../../types/queryTypes.js";
import { useMoralis, useMoralisQuery } from "react-moralis";

const { Moralis } = useMoralis();

export async function fetchDataFromMoralis(queryObj:Query) {
    let { data, error, isLoading } = useMoralisQuery(queryObj.table, query => query.equalTo(queryObj.queryKey, queryObj.queryValue).limit(queryObj.limitPerPage).skip(queryObj.skipPage * queryObj.limitPerPage), [], { autoFetch: false });
    return data;
}