import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

// Mock dependencies
jest.mock("../../../shared/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  require("../../../shared/hooks/useAuth").default.mockReturnValue({
    user: { id: 1, username: "admin" },
  });
});

jest.mock("../../../shared/hooks/useLogout", () => {
  return jest.fn(() => jest.fn());
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

test("renders AdminSidebar component", () => {
  renderWithRouter(<AdminSidebar />);
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
});

test("renders AdminSidebar menu items", () => {
  renderWithRouter(<AdminSidebar />);
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Posts")).toBeInTheDocument();
  expect(screen.getByText("Users")).toBeInTheDocument();
  expect(screen.getByText("Comments")).toBeInTheDocument();
});
