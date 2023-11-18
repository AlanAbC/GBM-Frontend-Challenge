import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "react-toastify";
import Login from "./page";
import { AuthContextProvider } from "../../utils/firebase/FirebaseAuthContext";
import "@testing-library/jest-dom";

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Login Component", () => {
  test("renders login form by default", async () => {
    render(
      <AuthContextProvider>
        <ToastContainer />
        <Login />
      </AuthContextProvider>
    );

    // Ensure the default login form is rendered
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  test("toggles between login and signup forms", async () => {
    render(
      <AuthContextProvider>
        <ToastContainer />
        <Login />
      </AuthContextProvider>
    );

    // Switch to signup form
    userEvent.click(screen.getByText("Sign Up"));
    await waitFor(() =>
      expect(screen.getByText("Sign up")).toBeInTheDocument()
    );

    // Switch back to login form
    userEvent.click(screen.getByText("Log In"));
    await waitFor(() =>
      expect(screen.getByText("Sign up")).toBeInTheDocument()
    );
  });
});
