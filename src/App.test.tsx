import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import App from "./App";

test("shows the heading and all seed books", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "Reading List" })
  ).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
});
