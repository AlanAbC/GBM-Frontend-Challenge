import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TickerHeader from "./TickerHeader";
import "@testing-library/jest-dom";
import { reactQueryWrapper } from "@/utils/test-utils";
const mockRouterBack = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    replace: jest.fn(),
    back: mockRouterBack,
  }),
}));

jest.mock("../../hooks/useFavorites", () => ({
  useGetFavorites: () => ({
    data: [],
  }),
}));

describe("TickerHeader Component", () => {
  const mocksetDate = jest.fn();
  const mockData = {
    key: "EXM",
    name: "Example Ticker",
    symbol: "EXM",
    exchange_name: "Example Exchange",
    acronym: "EXC",
    country: "US",
    date: "2023-01-01",
    high_price: 100,
    low_price: 50,
    open_price: 75,
    close_price: 80,
    volume: 100000,
  };

  test("renders loading state when isLoading is true", () => {
    render(<TickerHeader setDate={mocksetDate} isLoading={true} />, {
      wrapper: reactQueryWrapper,
    });

    expect(screen.getByTestId("header-skeleton")).toBeInTheDocument();
  });

  test("renders ticker information when data is provided", () => {
    render(
      <TickerHeader setDate={mocksetDate} data={mockData} isLoading={false} />,
      {
        wrapper: reactQueryWrapper,
      }
    );

    expect(screen.getByText("Example Ticker")).toBeInTheDocument();
    expect(screen.getByText("Example Exchange")).toBeInTheDocument();
    expect(screen.getByText("December-31-2022")).toBeInTheDocument();
  });

  test("navigates back when 'Back' button is clicked", () => {
    render(<TickerHeader setDate={mocksetDate} isLoading={false} />, {
      wrapper: reactQueryWrapper,
    });

    fireEvent.click(screen.getByText("Back"));

    expect(mockRouterBack).toHaveBeenCalled();
  });
});
