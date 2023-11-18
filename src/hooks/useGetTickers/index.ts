import { useQuery } from "@tanstack/react-query";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import queryKeys from "../../utils/queryKeys";

export interface TickersTableData {
  tickers: Ticker[];
  pagination: {
    total: number;
  };
}

export interface Ticker {
  key: string;
  name: string;
  symbol: string;
  close_price?: number;
  acronym: string;
  country: string;
}

export interface TickerClosePrice {
  [key: string]: number;
}

/**
 * Maps the response data obtained from a request, along with a dictionary of ticker closing prices,
 * to an array of Ticker objects with relevant information for display.
 *
 * @param {any[]} data - The data retrieved from the request containing information about symbols and additional details.
 * @param {TickerClosePrice} prices - A dictionary mapping symbols to their corresponding closing prices.
 * @returns {Ticker[]} - An array of Ticker objects, each representing a symbol with associated details for display.
 */
const mapResponseToTickers = (
  data: any[],
  prices: TickerClosePrice
): Ticker[] => {
  const tickers: Ticker[] = data.map((e) => {
    return {
      key: e.symbol,
      name: e.name,
      symbol: e.symbol,
      close_price: prices[e.symbol] ?? "",
      acronym: e.stock_exchange?.acronym,
      country: e.stock_exchange?.country,
    };
  });
  return tickers;
};

/**
 * Maps the response data obtained from a request to a list of tickers with their corresponding closing prices.
 *
 * @param {any[]} data - The data retrieved from the request containing information about symbols and their closing prices.
 * @returns {TickerClosePrice} - An object where each symbol is mapped to its corresponding closing price.
 */
const mapResponseToTickersClosePrice = (data: any[]): TickerClosePrice => {
  const prices: TickerClosePrice = {};
  data.forEach((e) => {
    prices[e.symbol] = e.close;
  });
  return prices;
};

/**
 * Fetches a batch of ticker data
 *
 * @param {number} offset - The offset index for paginating through the ticker data.
 * @param {number} limit - The maximum number of tickers to retrieve per request (default is 15).
 * @param {string} search - Search parameter in case you wanmt to look a specific ticker
 * @returns {Promise<TickersTableData>} - Resolves to an object containing an array of Ticker objects
 * and pagination details.
 */
const fetchTickers = async (offset: number, search?: string, limit = 15) => {
  try {
    const response: any = await axiosInterceptorInstance.get("tickers", {
      params: {
        limit,
        offset,
        search,
      },
    });

    if (response.data) {
      // Fetch closing prices for the retrieved tickers
      const prices = await fetchTickersClosePrice(
        response.data.map((e: any) => e.symbol).join(",")
      );

      // Map response data to Ticker objects
      const tickers = mapResponseToTickers(response.data, prices ?? {});

      // Assemble the final data with tickers and pagination details
      const finalData = {
        tickers,
        pagination: {
          total: response?.pagination?.total,
        },
      };

      return finalData;
    }

    // Return default values if no data is present
    return {
      pagination: { total: 0 },
      tickers: [],
    };
  } catch (error) {
    // Log and handle errors
    console.error(error);
  }
};

/**
 * Fetches the latest End-of-Day (EOD) closing prices for a given list of symbols.
 * @param {string} symbols - A comma-separated string of symbols for which closing prices
 * @returns {Promise<TickerClosePrice>} - A promise that resolves to an object mapping symbols to their latest closing prices.
 */
const fetchTickersClosePrice = async (symbols: string) => {
  try {
    const response = await axiosInterceptorInstance.get("eod/latest", {
      params: {
        symbols,
      },
    });
    if (response.data) {
      const prices = mapResponseToTickersClosePrice(response.data);
      return prices;
    }

    return {};
  } catch (error) {
    console.error(error);
  }
};

const useGetTickers = (page: number, search?: string, limit?: number) => {
  const offset = page * (limit ?? 15);
  return useQuery({
    queryKey: [
      queryKeys.TICKERS,
      {
        page,
        search,
        limit,
      },
    ],
    queryFn: () => fetchTickers(offset, search, limit),
    refetchOnWindowFocus: false,
  });
};

export { useGetTickers, fetchTickers, fetchTickersClosePrice };
