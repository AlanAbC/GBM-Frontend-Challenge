import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const reactQueryWrapper = ({ children }: { children: any }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockedFavoritesData = {
  MSFT: {
    key: "MSFT",
    acronym: "NASDAQ",
    date: "2023-11-17T00:00:00+0000",
    high_price: 374.37,
    close_price: 369.85,
    symbol: "MSFT",
    low_price: 367,
    country: "USA",
    volume: 40157000,
    exchange_name: "NASDAQ Stock Exchange",
    name: "Microsoft Corporation",
    open_price: 373.61,
  },
  VOD: {
    close_price: 9.37,
    low_price: 9.32,
    acronym: "NASDAQ",
    name: "Vodafone Group plc",
    exchange_name: "NASDAQ Stock Exchange",
    open_price: 9.35,
    volume: 6237100,
    key: "VOD",
    date: "2023-11-17T00:00:00+0000",
    country: "USA",
    high_price: 9.42,
    symbol: "VOD",
  },
  GOOG: {
    volume: 25590191,
    close_price: 136.94,
    key: "GOOG",
    name: "Alphabet Inc - Class C",
    acronym: "NASDAQ",
    low_price: 135.48,
    open_price: 137.82,
    date: "2023-11-17T00:00:00+0000",
    symbol: "GOOG",
    high_price: 138,
    country: "USA",
    exchange_name: "NASDAQ Stock Exwfchange",
  },
};

export { reactQueryWrapper, mockedFavoritesData };
