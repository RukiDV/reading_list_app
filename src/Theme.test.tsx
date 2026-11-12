import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import App from "./App";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});
afterEach(() => {
  document.documentElement.classList.remove("dark");
});

describe("dark mode", () => {
  test("the header button switches the theme and remembers it", async () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Dark mode" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(toggle);
    expect(document.documentElement).toHaveClass("dark");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("theme")).toBe("dark");

    await userEvent.click(toggle);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("the lamp does the same and both controls stay in sync", async () => {
    render(<App />);
    const lamp = screen.getByRole("button", { name: "Lamp" });
    await userEvent.click(lamp);
    expect(document.documentElement).toHaveClass("dark");
    expect(lamp).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("starts in the theme that index.html chose", () => {
    document.documentElement.classList.add("dark");
    render(<App />);
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
