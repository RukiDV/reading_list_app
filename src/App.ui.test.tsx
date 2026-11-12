import { fireEvent, render, screen, within } from "@testing-library/react";
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

/** Shelf is the default view. These tests are about the cards, so switch first. */
async function renderCards() {
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: "Cards" }));
}

const titles = () =>
  screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

describe("filter and search", () => {
  test("the status filter shows only books with that status", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Done" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("the search finds books by title", async () => {
    await renderCards();
    await userEvent.type(screen.getByLabelText("Search by title"), "dune");
    expect(titles()).toEqual(["Dune"]);
  });

  test("filter and search work together", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await userEvent.type(screen.getByLabelText("Search by title"), "the");
    // Four titles contain "the", but only these two are done.
    expect(titles()).toEqual(["The Hobbit", "Klara and the Sun"]);
  });

  test("shows the empty state when nothing matches", async () => {
    await renderCards();
    await userEvent.type(screen.getByLabelText("Search by title"), "zzzz");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByText("No books found")).toBeInTheDocument();
  });
});

describe("add, edit and delete", () => {
  test("adds a book and shows a toast", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = screen.getByRole("dialog", { name: "Add book" });
    await userEvent.type(within(dialog).getByLabelText("Title"), "New Book");
    await userEvent.type(within(dialog).getByLabelText("Author"), "Someone");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(11);
    expect(titles()[0]).toBe("New Book");
    expect(screen.getByRole("status")).toHaveTextContent("Book added");
  });

  test("does not save without title and author, and focuses the first error", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(within(dialog).getByText("Title is required.")).toBeInTheDocument();
    expect(within(dialog).getByText("Author is required.")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Title")).toHaveFocus();
    expect(screen.getAllByRole("listitem")).toHaveLength(10);

    // With a title, the focus goes to the author field.
    await userEvent.type(within(dialog).getByLabelText("Title"), "Only a title");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(within(dialog).getByLabelText("Author")).toHaveFocus();
  });

  test("edits a book and shows a toast", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Edit Dune" }));
    const dialog = screen.getByRole("dialog", { name: "Edit book" });
    const title = within(dialog).getByLabelText("Title");
    expect(title).toHaveValue("Dune");
    await userEvent.clear(title);
    await userEvent.type(title, "Dune Messiah");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(titles()).toContain("Dune Messiah");
    expect(titles()).not.toContain("Dune");
    expect(screen.getByRole("status")).toHaveTextContent("Book updated");
  });

  test("asks before deleting, then deletes and shows a toast", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    const dialog = screen.getByRole("dialog", { name: "Delete book" });
    expect(dialog).toHaveTextContent("Dune");

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(10);

    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Delete" })
    );
    expect(titles()).not.toContain("Dune");
    expect(screen.getByRole("status")).toHaveTextContent("Book deleted");
  });
});

describe("dialog backdrop", () => {
  test("closes when the press and the release are on the backdrop", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("stays open when the press started inside, for example selecting text", async () => {
    await renderCards();
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.mouseDown(within(dialog).getByLabelText("Title"));
    fireEvent.click(dialog); // the browser fires the click on the dialog
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("toast", () => {
  test("a repeated message is a new toast", async () => {
    await renderCards();
    const add = async (title: string) => {
      await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
      const dialog = screen.getByRole("dialog");
      await userEvent.type(within(dialog).getByLabelText("Title"), title);
      await userEvent.type(within(dialog).getByLabelText("Author"), "A");
      await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    };
    await add("One");
    const first = screen.getByText("Book added");
    await add("Two");
    // The key changes with every toast, so React replaces the element.
    expect(screen.getByText("Book added")).not.toBe(first);
  });
});
