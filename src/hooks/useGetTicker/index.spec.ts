//@ts-nocheck
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTicker } from "./index";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import { reactQueryWrapper } from "@/utils/test-utils";
// Mock the Axios instance
jest.mock("../../utils/axiosInterceptorInstance");

// Example of a successful response
const mockResponse = {
  name: "Microsoft Corporation",
  symbol: "MSFT",
  has_intraday: false,
  has_eod: true,
  country: null,
  stock_exchange: {
    name: "NASDAQ Stock Exchange",
    acronym: "NASDAQ",
    mic: "XNAS",
    country: "USA",
    country_code: "US",
    city: "New York",
    website: "WWW.NASDAQ.COM",
  },
};

describe("useGetTicker", () => {
  it("fetches ticker successfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockResolvedValue(mockResponse);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTicker("MSFT"), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assertions
    expect(result.current.data?.name).toBe(mockResponse.name);
    expect(result.current.data?.exchange_name).toBe(
      mockResponse.stock_exchange.name
    );
  });

  it("fetches ticker unsuccessfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockRejectedValueOnce(0);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTicker(""), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
