import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, test } from "vitest";

import App from "./App";

// jsdom does not implement the native <dialog> methods, so we fake them.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const spine = (title: string) =>
  screen.getByRole("button", { name: new RegExp(`^${title} by`) });

describe("bookshelf", () => {
  test("is the default view and shows one spine per book", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Shelf" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    const shelf = screen.getByRole("list", { name: "Bookshelf" });
    expect(within(shelf).getAllByRole("listitem")).toHaveLength(10);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  test("a click on a spine opens the details, a second click closes them", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));

    const panel = screen.getByRole("region", { name: "Details: Dune" });
    expect(within(panel).getByRole("heading", { name: "Dune" })).toBeVisible();
    expect(panel).toHaveTextContent("Frank Herbert");
    expect(panel).toHaveTextContent("Read it twice");
    expect(spine("Dune")).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(spine("Dune"));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(spine("Dune")).toHaveAttribute("aria-expanded", "false");
  });

  test("selecting another book replaces the details, and Close closes them", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));
    await userEvent.click(spine("Sapiens"));
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(
      screen.getByRole("region", { name: "Details: Sapiens" })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  test("can be used with the keyboard", async () => {
    render(<App />);
    spine("Dune").focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("region", { name: "Details: Dune" })).toBeVisible();
  });

  test("edits a book from the details panel", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));
    await userEvent.click(screen.getByRole("button", { name: "Edit Dune" }));
    const dialog = screen.getByRole("dialog", { name: "Edit book" });
    const title = within(dialog).getByLabelText("Title");
    await userEvent.clear(title);
    await userEvent.type(title, "Dune Messiah");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(
      screen.getByRole("region", { name: "Details: Dune Messiah" })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Book updated");
  });

  test("deletes the open book and the details go away", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));
    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Delete" })
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Bookshelf" })).getAllByRole(
        "listitem"
      )
    ).toHaveLength(9);
  });

  test("the details close when a filter hides the open book", async () => {
    render(<App />);
    await userEvent.click(spine("Dune")); // Dune is "Done"
    await userEvent.click(screen.getByRole("button", { name: "Reading" }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  test("shows the empty state when nothing matches", async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText("Search by title"), "zzzz");
    expect(screen.getByText("No books found")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Bookshelf" })).not.toBeInTheDocument();
  });

  test("the Cards button switches to the card view and back", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Cards" }));
    expect(screen.queryByRole("list", { name: "Bookshelf" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Dune" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Shelf" }));
    expect(screen.getByRole("list", { name: "Bookshelf" })).toBeInTheDocument();
  });
});
