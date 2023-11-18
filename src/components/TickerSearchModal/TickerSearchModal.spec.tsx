import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import TickerSearchModal from "./TickerSearchModal";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

const mockData = [
  {
    key: "MSFT",
    name: "Microsoft Corporation",
    symbol: "MSFT",
    acronym: "NASDAQ",
  },
  {
    key: "AAPL",
    name: "Apple Inc",
    symbol: "AAPL",
    acronym: "NASDAQ",
  },
  {
    key: "AMZN",
    name: "Amazon.com Inc",
    symbol: "AMZN",
    acronym: "NASDAQ",
  },
];
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("../../hooks/useGetTickerSearchList", () => ({
  useGetTickersSearch: () => ({
    data: mockData,
  }),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("TickerSearchModal Component", () => {
  test("renders modal with search input", () => {
    const { container } = render(
      <TickerSearchModal isModalOpen={true} setIsModalOpen={jest.fn()} />
    );

    expect(screen.getByText("Search Tickers")).toBeInTheDocument();
    expect(
      screen.getByText("Microsoft Corporation (MSFT) [NASDAQ]")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Ticker name, symbol")
    ).toBeInTheDocument();
  });

  test("closes modal when cancel is clicked", () => {
    const setIsModalOpenMock = jest.fn();
    render(
      <TickerSearchModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpenMock}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
  });

  test("handles item click and redirects to selected ticker", () => {
    const setIsModalOpenMock = jest.fn();
    render(
      <TickerSearchModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpenMock}
      />
    );

    // Assert that each item in the mock data is rendered in the list
    mockData.forEach(({ name, symbol, acronym }) => {
      expect(
        screen.getByText(`${name} (${symbol}) [${acronym}]`)
      ).toBeInTheDocument();
    });

    // Click the first item in the list
    fireEvent.click(
      screen.getByText(
        `${mockData[0].name} (${mockData[0].symbol}) [${mockData[0].acronym}]`
      )
    );

    // Assert that useRouter.replace is called with the expected URL
    expect(mockReplace).toHaveBeenCalledWith(`/tickers/${mockData[0].symbol}`);
  });
});
