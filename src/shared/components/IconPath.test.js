import { IconPath } from "./IconPath.js";

test("IconPath returns array of icon URLs", () => {
  const icons = IconPath();
  expect(Array.isArray(icons)).toBe(true);
  expect(icons).toHaveLength(3);
  expect(icons[0]).toContain("Star");
  expect(icons[1]).toContain("multimedia");
  expect(icons[2]).toContain("comment");
  expect(icons[0]).toMatch(/https?:\/\//);
  expect(icons[1]).toMatch(/https?:\/\//);
  expect(icons[2]).toMatch(/https?:\/\//);
});
