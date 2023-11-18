//@ts-nocheck
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTickerEODData } from "./index";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import { reactQueryWrapper } from "@/utils/test-utils";

// Mock the Axios instance
jest.mock("../../utils/axiosInterceptorInstance");

const dateFrom = "2023-10-18";
const dateTo = "2023-11-15";

// Example of a successful response
const mockResponse = {
  data: [
    {
      open: 137.82,
      high: 138,
      low: 135.48,
      close: 136.94,
      volume: 25445996,
      adj_high: 138,
      adj_low: 135.48,
      adj_close: 136.94,
      adj_open: 137.82,
      adj_volume: 25445996,
      split_factor: 1,
      dividend: 0,
      symbol: "GOOG",
      exchange: "XNAS",
      date: "2023-11-17T00:00:00+0000",
    },
    {
      open: 136.96,
      high: 138.8799,
      low: 136.08,
      close: 138.7,
      volume: 17615068,
      adj_high: 138.8799,
      adj_low: 136.08,
      adj_close: 138.7,
      adj_open: 136.96,
      adj_volume: 17615068,
      split_factor: 1,
      dividend: 0,
      symbol: "GOOG",
      exchange: "XNAS",
      date: "2023-11-16T00:00:00+0000",
    },
  ],
};

describe("useGetTickerEODData", () => {
  it("fetches tickers successfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockResolvedValueOnce(mockResponse);

    // Variable to store the result of the hook
    const { result } = renderHook(
      () => useGetTickerEODData("APPL", dateFrom, dateTo),
      {
        wrapper: reactQueryWrapper,
      }
    );

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assertions
    expect(result.current.data?.open).toHaveLength(2);
    expect(result.current.data?.close).toHaveLength(2);
    expect(result.current.data?.high).toHaveLength(2);
    expect(result.current.data?.low).toHaveLength(2);
    expect(result.current.data.low[0].value).toBe(136.08);
  });

  it("fetches tickers unsuccessfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockRejectedValueOnce(
      "APPL",
      dateFrom,
      dateTo
    );

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTickerEODData(""), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
