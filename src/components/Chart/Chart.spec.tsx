import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Chart from "./Chart";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

// Mock the lightweight-charts library
jest.mock("lightweight-charts", () => ({
  createChart: jest.fn(),
  ColorType: {},
  IChartApi: {
    addLineSeries: jest.fn(),
  },
  ISeriesApi: {},
}));

const mockSetDateRange = jest.fn();

const mockChartData = {
  open: [
    {
      time: "2023-10-17",
      value: 330.11,
    },
    {
      time: "2023-10-18",
      value: 331.32,
    },
    {
      time: "2023-10-19",
      value: 326.67,
    },
  ],
  close: [
    {
      time: "2023-10-17",
      value: 330.11,
    },
    {
      time: "2023-10-18",
      value: 331.32,
    },
    {
      time: "2023-10-19",
      value: 326.67,
    },
  ],
  high: [
    {
      time: "2023-10-17",
      value: 330.11,
    },
    {
      time: "2023-10-18",
      value: 331.32,
    },
    {
      time: "2023-10-19",
      value: 326.67,
    },
  ],
  low: [
    {
      time: "2023-10-17",
      value: 330.11,
    },
    {
      time: "2023-10-18",
      value: 331.32,
    },
    {
      time: "2023-10-19",
      value: 326.67,
    },
  ],
};

describe("Chart Component", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Chart setChartDateRange={mockSetDateRange} />
    );
    expect(container).toMatchSnapshot();
  });
});
