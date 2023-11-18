import { formatPrice, numberWithCommas, formatDate } from "./utills";

describe("numberWithCommas", () => {
  test("adds commas to a number string", () => {
    expect(numberWithCommas("123456789")).toBe("123,456,789");
    expect(numberWithCommas("9876543210")).toBe("9,876,543,210");
  });
});

describe("formatPrice", () => {
  test("formats a price with commas and a dollar sign", () => {
    expect(formatPrice(123456.789)).toBe("$123,456.79");
    expect(formatPrice(9876.54)).toBe("$9,876.54");
    expect(formatPrice(undefined)).toBe("$");
  });
});

describe("formatDate", () => {
  test("formats a date string into a human-readable format", () => {
    expect(formatDate("2023-11-15")).toBe("November-14-2023");
  });
});
