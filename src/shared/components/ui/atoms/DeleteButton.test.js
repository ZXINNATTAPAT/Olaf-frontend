import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DeleteButton from "./DeleteButton";

// Mock dependencies
import useAuth from "../../../hooks/useAuth";

jest.mock("../../../hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../services/ApiController", () => ({
  __esModule: true,
  default: {
    deletePost: jest.fn(),
  },
}));

import ApiController from "../../../services/ApiController";

// Mock window functions
global.window.confirm = jest.fn();
global.alert = jest.fn();

beforeEach(() => {
  useAuth.mockReturnValue({ user: { id: 1 } });
  ApiController.deletePost.mockClear();
  ApiController.deletePost.mockResolvedValue({ success: true });
  global.window.confirm.mockReset();
  global.window.confirm.mockReturnValue(true);
});
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

test("does not render DeleteButton when user is not owner", () => {
  renderWithRouter(<DeleteButton post_id={1} postUserId={2} />);
  expect(screen.queryByText("Delete")).not.toBeInTheDocument();
});

test("renders DeleteButton when user is owner", () => {
  renderWithRouter(<DeleteButton post_id={1} postUserId={1} />);
  expect(screen.getByText("Delete")).toBeInTheDocument();
});

test("calls deletePost when confirmed", async () => {
  ApiController.deletePost.mockResolvedValue({ success: true });
  const onDeleteSuccess = jest.fn();

  renderWithRouter(
    <DeleteButton
      post_id={1}
      postUserId={1}
      onDeleteSuccess={onDeleteSuccess}
    />,
  );
  const button = screen.getByText("Delete");
  fireEvent.click(button);

  await waitFor(() => {
    expect(ApiController.deletePost).toHaveBeenCalledWith(1);
  });
});

test("does not delete when not confirmed", () => {
  global.window.confirm.mockReturnValueOnce(false);
  renderWithRouter(<DeleteButton post_id={1} postUserId={1} />);
  const button = screen.getByText("Delete");
  fireEvent.click(button);
  expect(ApiController.deletePost).not.toHaveBeenCalled();
});
