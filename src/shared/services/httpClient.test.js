// Mock authService before importing httpClient
jest.mock("./AuthService", () => ({
  __esModule: true,
  default: {
    csrfToken: "test-csrf-token",
    getCSRFToken: jest.fn(),
  },
}));

import axiosInstance from "./httpClient";

test("axiosInstance is created", () => {
  expect(axiosInstance).toBeDefined();
  expect(axiosInstance.defaults).toBeDefined();
});

test("axiosInstance has withCredentials configured", () => {
  expect(axiosInstance.defaults.withCredentials).toBe(true);
});

test("axiosInstance has timeout configured", () => {
  expect(axiosInstance.defaults.timeout).toBe(10000);
});
