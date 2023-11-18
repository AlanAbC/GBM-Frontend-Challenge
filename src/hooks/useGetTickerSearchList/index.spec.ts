//@ts-nocheck
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTickersSearch } from "./index";
import axiosInterceptorInstance from "../../utils/axiosInterceptorInstance";
import { reactQueryWrapper } from "@/utils/test-utils";

// Mock the Axios instance
jest.mock("../../utils/axiosInterceptorInstance");

// Example of a successful response
const mockResponse = {
  data: [
    {
      name: "Company 1",
      symbol: "ABC",
      stock_exchange: { acronym: "NYSE" },
    },
    {
      name: "Company 2",
      symbol: "DEF",
      stock_exchange: { acronym: "NASDAQ" },
    },
  ],
};

describe("useGetTickersSearch", () => {
  it("fetches tickers successfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockResolvedValueOnce(mockResponse);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTickersSearch("test"), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assertions
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe("Company 1");
    expect(result.current.data[1].name).toBe("Company 2");
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches tickers unsuccessfully", async () => {
    // Mock Axios response
    axiosInterceptorInstance.get.mockRejectedValueOnce(mockResponse);

    // Variable to store the result of the hook
    const { result } = renderHook(() => useGetTickersSearch("test"), {
      wrapper: reactQueryWrapper,
    });

    // Wait for the promise to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
