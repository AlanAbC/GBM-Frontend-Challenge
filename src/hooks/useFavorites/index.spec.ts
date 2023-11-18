import { mockedFavoritesData, reactQueryWrapper } from "@/utils/test-utils";
import { TickerInterface } from "../useGetTicker";
import {
  addNewFavorite,
  removeFavorite,
  useGetFavorites,
  fetchFavorites,
} from "./index";
import { renderHook, waitFor } from "@testing-library/react";

const userEmail = "test@example.com";

jest.mock("firebase/firestore", () => {
  const mockDocExists = jest.fn().mockResolvedValue({ exists: true });
  const mockUpdateDoc = jest.fn().mockResolvedValue({});
  const mockGetDoc = jest.fn().mockResolvedValue({
    exists: mockDocExists,
    data: jest.fn().mockResolvedValue(mockedFavoritesData),
  });
  return {
    ...jest.requireActual("firebase/firestore"),
    doc: jest.fn(() => ({
      exists: mockDocExists,
    })),
    updateDoc: mockUpdateDoc,
    getDoc: mockGetDoc,
  };
});

describe("Favorites-related functions", () => {
  const mockTicker: TickerInterface = {
    key: "MSF",
    name: "Microsoft Corporation",
    symbol: "MSF",
    acronym: "NASDAQ",
    country: "USA",
    exchange_name: "NASDAQ Stock Exchang",
  };

  test("addNewFavorite adds a new favorite ticker", async () => {
    const newFavorites = await addNewFavorite(userEmail, mockTicker);
    expect(newFavorites).toEqual(Object.values(mockedFavoritesData));
  });

  test("removeFavorite removes a favorite ticker", async () => {
    const tickerSymbolToRemove = "AAPL";

    const remainingFavorites = await removeFavorite(
      userEmail,
      tickerSymbolToRemove
    );
    expect(remainingFavorites).toEqual(Object.values(mockedFavoritesData));
  });

  test("fetchFavorites fetches the favorite tickers", async () => {
    const favorites = await fetchFavorites(userEmail);
    expect(favorites).toEqual(Object.values(mockedFavoritesData));
  });

  test("useGetFavorites fetches favorites using useQuery", async () => {
    const { result } = renderHook(() => useGetFavorites(userEmail), {
      wrapper: reactQueryWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(Object.values(mockedFavoritesData));
  });
});
