//@ts-nocheck
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTickers } from "./index";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import { reactQueryWrapper } from "@/utils/test-utils";

// Mock the Axios instance
jest.mock("../../utils/axiosInterceptorInstance");

// Example of a successful response
const mockResponse = {
  pagination: {
    limit: 100,
    offset: 0,
    count: 15,
    total: 15,
  },
  data: [
    {
      open: 373.61,
      high: 374.37,
      low: 367,
      close: 369.85,
      volume: 37419964,
      adj_high: 374.37,
      adj_low: 367,
      adj_close: 369.85,
      adj_open: 373.61,
      adj_volume: 39594362,
      split_factor: 1,
      dividend: 0,
      symbol: "MSFT",
      exchange: "XNAS",
      date: "2023-11-17T00:00:00+0000",
    },
    {
      open: 190.25,
      high: 190.38,
      low: 188.575,
      close: 189.69,
      volume: 46970852,
      adj_high: 190.38,
      adj_low: 188.57,
      adj_close: 189.69,
      adj_open: 190.25,
      adj_volume: 50002825,
      split_factor: 1,
      dividend: 0,
      symbol: "AAPL",
      exchange: "XNAS",
      date: "2023-11-17T00:00:00+0000",
    },
  ],
};

describe("useGetTickers", () => {
  it("fetches tickers successfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockResolvedValue(mockResponse);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTickers(0), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Assertions
    expect(result.current.data?.pagination).toBeDefined();
    expect(result.current.data?.tickers).toHaveLength(2);
  });

  it("fetches tickers unsuccessfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockRejectedValueOnce(0);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTickers(""), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
