import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import queryKeys from "../../utils/queryKeys";
import { format } from "date-fns";

export interface TickerInterface {
  key: string;
  name: string;
  symbol: string;
  acronym: string;
  country: string;
  exchange_name: string;
  close_price?: number;
  open_price?: number;
  low_price?: number;
  high_price?: number;
  volume?: number;
  date?: string;
}

export interface EODInterface {
  low: number;
  high: number;
  close: number;
  open: number;
  volume: number;
  date: string;
}

const mapResponseToTicker = (
  data: any,
  eodData: EODInterface
): TickerInterface => {
  const { symbol, name, stock_exchange } = data;
  const { high, low, open, close, volume, date } = eodData;
  return {
    key: symbol,
    name: name,
    symbol: symbol,
    exchange_name: stock_exchange.name,
    acronym: stock_exchange?.acronym,
    country: stock_exchange?.country,
    close_price: close,
    high_price: high,
    open_price: open,
    low_price: low,
    volume: volume,
    date: date,
  };
};

const fetchTicker = async (symbol: string, date?: string) => {
  try {
    const response: any = await axiosInterceptorInstance.get(
      `tickers/${symbol}`
    );
    if (response) {
      const eod = await fetchTickerEOD(response.symbol, date);

      // Map response data to Ticker objects
      const ticker = mapResponseToTicker(response, eod[0] ?? {});
      return ticker;
    }

    // Return default values if no data is present
    return {};
  } catch (error) {
    // Log and handle errors
    console.error(error);
  }
};

const fetchTickerEOD = async (symbols: string, date?: string) => {
  try {
    const response = await axiosInterceptorInstance.get(
      `eod/${date != "" ? date : "latest"}`,
      {
        params: {
          symbols,
        },
      }
    );
    if (response.data) {
      return response.data;
    }

    return {};
  } catch (error) {
    console.error(error);
  }
};

const useGetTicker = (
  symbol: string,
  date = ""
): UseQueryResult<TickerInterface> => {
  return useQuery({
    queryKey: [queryKeys.TICKER, symbol, date],
    queryFn: () => fetchTicker(symbol, date),
    refetchOnWindowFocus: false,
  });
};

export { useGetTicker, fetchTicker };
