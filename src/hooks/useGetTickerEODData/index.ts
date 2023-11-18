import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import queryKeys from "../../utils/queryKeys";
import { format } from "date-fns";
import dayjs from "dayjs";

// Interface to define the structure of end-of-day ticker data
export interface TickerEODDataInterface {
  close: ChartDataInterface[];
  open: ChartDataInterface[];
  high: ChartDataInterface[];
  low: ChartDataInterface[];
}

// Interface to define the structure of chart data
export interface ChartDataInterface {
  time: string;
  value: number;
}

// Function to map the API response to the required ticker data structure
const mapResponseToTicker = (data: any[]): TickerEODDataInterface => {
  const close: ChartDataInterface[] = [];
  const open: ChartDataInterface[] = [];
  const high: ChartDataInterface[] = [];
  const low: ChartDataInterface[] = [];
  data.forEach((e) => {
    const date = dayjs(e.date).format("YYYY-MM-DD");
    close.unshift({
      time: date,
      value: Number(e.close.toFixed(2)),
    });
    open.unshift({
      time: date,
      value: Number(e.open.toFixed(2)),
    });
    high.unshift({
      time: date,
      value: Number(e.high.toFixed(2)),
    });
    low.unshift({
      time: date,
      value: Number(e.low.toFixed(2)),
    });
  });
  return {
    close,
    open,
    high,
    low,
  };
};

const fetchTickerEOD = async (
  symbols: string,
  date_from?: string,
  date_to?: string
) => {
  try {
    const response = await axiosInterceptorInstance.get(`eod`, {
      params: {
        symbols,
        date_from,
        date_to,
      },
    });
    if (response.data) {
      const mappedData = mapResponseToTicker(response.data ?? []);
      return mappedData;
    }

    return {};
  } catch (error) {
    console.error(error);
  }
};

const useGetTickerEODData = (
  symbol: string,
  date_from = "",
  date_to = ""
): UseQueryResult<TickerEODDataInterface> => {
  return useQuery({
    queryKey: [queryKeys.TICKER, symbol, date_from, date_to],
    queryFn: () => fetchTickerEOD(symbol, date_from, date_to),
    refetchOnWindowFocus: false,
  });
};

export { useGetTickerEODData };
