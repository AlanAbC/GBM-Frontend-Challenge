import { useQuery } from "@tanstack/react-query";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import queryKeys from "../../utils/queryKeys";

export interface SearchTicker {
  key: string;
  name: string;
  symbol: string;
  acronym: string;
}

// Helper function to map the API response to an array of SearchTicker objects
const mapResponseToTickers = (data: any[]): SearchTicker[] => {
  const tickers: SearchTicker[] = data.map((e) => {
    return {
      key: e.symbol,
      name: e.name,
      symbol: e.symbol,
      acronym: e.stock_exchange?.acronym,
    };
  });
  return tickers;
};

// Function to fetch tickers based on a search term
const fetchTickers = async (search: string) => {
  try {
    const response: any = await axiosInterceptorInstance.get("tickers", {
      params: {
        limit: 10,
        offset: 0,
        search,
      },
    });

    if (response.data) {
      // Map response data to Ticker objects
      const tickers = mapResponseToTickers(response.data);
      return tickers;
    }

    // Return default values if no data is present
    return [];
  } catch (error) {
    // Log and handle errors
    console.error(error);
  }
};

const useGetTickersSearch = (search: string) => {
  return useQuery({
    queryKey: [
      queryKeys.TICKERS_SEARCH,
      {
        search,
      },
    ],
    queryFn: () => fetchTickers(search),
    refetchOnWindowFocus: false,
  });
};

export { useGetTickersSearch };
