import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Mock dependencies
jest.mock("../../hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  require("../../hooks/useAuth").default.mockReturnValue({
    user: { id: 1, username: "testuser" },
  });
});

jest.mock("../../hooks/useLogout", () => {
  return jest.fn(() => jest.fn());
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

test("renders Navbar component", () => {
  renderWithRouter(<Navbar />);
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});

test("renders Navbar links", () => {
  renderWithRouter(<Navbar />);
  // Check for common navbar links
  const navLinks = screen.getAllByRole("link");
  expect(navLinks.length).toBeGreaterThan(0);
});
