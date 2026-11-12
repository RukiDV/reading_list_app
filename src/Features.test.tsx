import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import App from "./App";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(() => vi.restoreAllMocks());

const shelf = () => screen.getByRole("list", { name: "Bookshelf" });
const spineNames = () =>
  within(shelf())
    .getAllByRole("button")
    .map((b) => b.getAttribute("aria-label")?.split(" by ")[0]);
const spine = (title: string) =>
  screen.getByRole("button", { name: new RegExp(`^${title} by`) });

describe("spines", () => {
  test("the name says the status and the rating", () => {
    render(<App />);
    expect(spine("Dune")).toHaveAccessibleName(
      "Dune by Frank Herbert, Done, rated 5 out of 5"
    );
    expect(spine("Gone Girl")).toHaveAccessibleName(
      "Gone Girl by Gillian Flynn, Want to read"
    );
  });

  test("only books you read have a ribbon, only five stars a medal", () => {
    render(<App />);
    const ribbons = shelf().querySelectorAll(".ribbon-end");
    expect(ribbons).toHaveLength(2); // Neuromancer, Project Hail Mary
    expect(within(spine("Neuromancer")).queryByText("★")).toBeNull();
    expect(within(spine("Dune")).getByText("★")).toBeInTheDocument();
    expect(within(spine("The Hobbit")).queryByText("★")).toBeNull();
  });
});

/** Base UI selects are comboboxes with a popup, not native selects. */
async function choose(combobox: HTMLElement, option: string) {
  await userEvent.click(combobox);
  await userEvent.click(await screen.findByRole("option", { name: option }));
}

describe("sort", () => {
  test("sorts the shelf and the cards", async () => {
    render(<App />);
    expect(spineNames()[0]).toBe("Dune");
    await choose(screen.getByRole("combobox", { name: "Sort by" }), "Title");
    expect(spineNames().slice(0, 3)).toEqual(["Dune", "Educated", "Gone Girl"]);
    await choose(screen.getByRole("combobox", { name: "Sort by" }), "Status");
    expect(spineNames().slice(0, 2)).toEqual(["Neuromancer", "Project Hail Mary"]);
    await userEvent.click(screen.getByRole("button", { name: "Cards" }));
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)
    ).toHaveLength(10);
  });
});

describe("plaque", () => {
  test("shows how many books are done and updates", async () => {
    render(<App />);
    expect(screen.getByText(/5 of 10 books done/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Books done" })).toHaveValue(5);
    await userEvent.click(screen.getByRole("button", { name: "Reading" }));
    // The plaque counts all books, not only the visible ones.
    expect(screen.getByText(/5 of 10 books done/)).toBeInTheDocument();
  });
});

describe("pick my next book", () => {
  test("opens a want-to-read book and clears the filters", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await userEvent.type(screen.getByLabelText("Search by title"), "hobbit");
    await userEvent.click(screen.getByRole("button", { name: "Pick my next book" }));

    const panel = screen.getByRole("region", { name: /^Details:/ });
    expect(panel).toHaveTextContent("Gone Girl"); // first want-to-read book
    expect(screen.getByLabelText("Search by title")).toHaveValue("");
    expect(spineNames()).toHaveLength(10);
  });

  test("says so when there is nothing to pick", async () => {
    render(<App />);
    for (const title of ["Gone Girl", "The Name of the Wind", "The Pragmatic Programmer"]) {
      await userEvent.click(spine(title));
      await userEvent.click(screen.getByRole("button", { name: `Edit ${title}` }));
      const dialog = await screen.findByRole("dialog");
      await choose(within(dialog).getByRole("combobox", { name: "Status" }), "Done");
      await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    }
    await userEvent.click(screen.getByRole("button", { name: "Pick my next book" }));
    expect(
      await screen.findByText("No books on your want-to-read list")
    ).toBeInTheDocument();
  });
});

describe("keyboard and focus", () => {
  test("opening a book moves the focus into the details", async () => {
    render(<App />);
    spine("Dune").focus();
    await userEvent.keyboard("{Enter}");
    const panel = screen.getByRole("region", { name: "Details: Dune" });
    expect(panel).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Edit Dune" })).toHaveFocus();
  });

  test("Escape closes the details and the focus goes back to the spine", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: /^Details:/ })).not.toBeInTheDocument();
    expect(spine("Dune")).toHaveFocus();
  });

  test("Close puts the focus back on the spine", async () => {
    render(<App />);
    await userEvent.click(spine("Sapiens"));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(spine("Sapiens")).toHaveFocus();
  });

  test("after deleting the open book the focus is not lost", async () => {
    render(<App />);
    await userEvent.click(spine("Dune"));
    await userEvent.click(screen.getByRole("button", { name: "Delete Dune" }));
    await userEvent.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    );
    expect(document.body).not.toHaveFocus();
    expect(shelf().contains(document.activeElement)).toBe(true);
  });
});
