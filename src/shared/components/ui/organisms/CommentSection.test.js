import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentSection from "./CommentSection";

// Mock dependencies
// Mock dependencies
import useAuth from "../../../hooks/useAuth";

jest.mock("../../../hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  useAuth.mockReturnValue({
    user: { id: 1, username: "testuser" },
  });
});

jest.mock("../../../services/ApiController", () => ({
  createComment: jest.fn(),
  getComments: jest.fn(),
}));

jest.mock("../molecules/CommentCard", () => {
  return function MockCommentCard({ comment }) {
    return <div data-testid="comment-card">{comment.comment_text}</div>;
  };
});

import ApiController from "../../../services/ApiController";

test("renders CommentSection with initial comments", () => {
  const comments = [
    {
      comment_id: 1,
      comment_text: "Comment 1",
      comment_datetime: "2024-01-01",
      like_count: 0,
    },
  ];
  render(
    <CommentSection
      post_id={1}
      initialComments={comments}
      onCommentsCountChange={() => {}}
    />,
  );
  expect(screen.getByText("Comment 1")).toBeInTheDocument();
});

test("renders CommentSection without comments", () => {
  render(<CommentSection post_id={1} onCommentsCountChange={() => {}} />);
  expect(screen.getByPlaceholderText("Write a comment...")).toBeInTheDocument();
});

test("calls onCommentsCountChange when comments change", () => {
  const onCommentsCountChange = jest.fn();
  const comments = [
    {
      comment_id: 1,
      comment_text: "Comment 1",
      comment_datetime: "2024-01-01",
      like_count: 0,
    },
  ];
  render(
    <CommentSection
      post_id={1}
      initialComments={comments}
      onCommentsCountChange={onCommentsCountChange}
    />,
  );
  expect(onCommentsCountChange).toHaveBeenCalledWith(1);
});
