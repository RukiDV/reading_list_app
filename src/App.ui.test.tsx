import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import App from "./App";

const titles = () =>
  screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

describe("filter and search", () => {
  test("the status filter shows only books with that status", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Done" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("filter and search work together", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await userEvent.type(screen.getByLabelText("Search by title"), "the");
    expect(titles()).toEqual(["The Hobbit", "Klara and the Sun"]);
  });

  test("shows the empty state when nothing matches", async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText("Search by title"), "zzzz");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByText("No books found")).toBeInTheDocument();
  });
});

describe("add, edit and delete", () => {
  test("adds a book and shows a toast", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = await screen.findByRole("dialog", { name: "Add book" });
    await userEvent.type(within(dialog).getByLabelText("Title"), "New Book");
    await userEvent.type(within(dialog).getByLabelText("Author"), "Someone");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Book added")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(titles()[0]).toBe("New Book");
    expect(titles()).toHaveLength(11);
  });

  test("does not save without title and author, and focuses the first error", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "+ Add book" }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(within(dialog).getByText("Title is required.")).toBeInTheDocument();
    expect(within(dialog).getByText("Author is required.")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Title")).toHaveFocus();

    await userEvent.type(within(dialog).getByLabelText("Title"), "Only a title");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(within(dialog).getByLabelText("Author")).toHaveFocus();

    // Nothing was saved. Cancel closes the dialog.
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(titles()).toHaveLength(10);
  });

  test("edits a book, including the status select", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Edit Gone Girl" }));
    const dialog = await screen.findByRole("dialog", { name: "Edit book" });
    const title = within(dialog).getByLabelText("Title");
    expect(title).toHaveValue("Gone Girl");
    await userEvent.clear(title);
    await userEvent.type(title, "Gone Girl 2");

    await userEvent.click(within(dialog).getByRole("combobox", { name: "Status" }));
    await userEvent.click(await screen.findByRole("option", { name: "Done" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Book updated")).toBeInTheDocument();
    expect(titles()).toContain("Gone Girl 2");
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(titles()).toContain("Gone Girl 2");
  });

  test("asks before deleting, then deletes and shows a toast", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveTextContent("Dune");

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(titles()).toHaveLength(10);

    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    await userEvent.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    );
    expect(await screen.findByText("Book deleted")).toBeInTheDocument();
    expect(titles()).not.toContain("Dune");
  });
});
