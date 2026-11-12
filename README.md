# CSS Frameworks Landscape: Reading List Start

A small React app with TypeScript and tests. The **logic is finished**, the **UI is not**. Today you build the UI **twice**, with two different styling approaches. Tomorrow, the same app is built in a different framework.

This README describes the whole task. Read it completely before you start.

## The task

You build the Reading List with **two** styling approaches: Bootstrap, Tailwind CSS, styled-components or shadcn/ui. The app is the same in both versions, only the styling changes.

### The app

A reading list that keeps its data in `localStorage`. There is no backend. The full description (user stories, data model, screens and acceptance criteria) is in `SPEC.md`. **Read it first.** In short:

- See all books as cards (title, author, status, rating).
- Add a book and edit a book in a dialog (title, author, status, rating, notes).
- Delete a book after a confirmation.
- A toast message after add, edit and delete.
- Filter by status and search by title, and an empty state.
- Works from 360px to 1280px width, and with the keyboard only.

### What is already done

You do **not** write the logic. It is tested, and it is the same for all approaches:

- `src/useBooks.ts`: `books`, `addBook`, `updateBook`, `deleteBook`, kept in `localStorage`.
- `src/books.ts`: `filterBooks` (status and search) and `STATUS_LABELS`.
- `src/types.ts` and `src/seed.json` (ten books).
- `src/App.tsx`: an unstyled list that shows the data flows.

**Do not change** `useBooks.ts`, `books.ts`, `types.ts` or `seed.json`. You only build the view layer (`src/App.tsx` and new components in `src/components`).

The `@/` alias for `src` is already set up in `tsconfig.json` and `vite.config.ts`. shadcn/ui needs it.

### Your two approaches

Work in groups of four. Each person builds **two** approaches. Every approach is built by exactly two people in your group, so you can compare notes.

| Person | Approach A | Approach B |
| --- | --- | --- |
| 1 | Bootstrap | Tailwind CSS |
| 2 | Tailwind CSS | shadcn/ui |
| 3 | shadcn/ui | styled-components |
| 4 | styled-components | Bootstrap |

shadcn/ui builds on Tailwind CSS, so the work of person 2 overlaps. This is fine.

### Steps for each approach

Use the setup commands of the handout (section "Setup in a Vite + React + TypeScript Project").

1. Work in a git repository (`git init -b main`, `git add .`, `git commit -m "Initial commit"`). Create a branch for the approach: `variant-bootstrap`, `variant-tailwind`, `variant-shadcn` or `variant-styled`. Your second approach starts on a **new branch from the starter**, not from your first approach.
2. Set up the approach and write its rules in the `Styling` section of `CLAUDE.md` **before** you build.
3. Plan the work with the agent in **plan mode**. Read the plan, correct it and only then approve it.
4. Build the UI: layout, book card, add and edit dialog, delete confirmation, toast, filter and search.
5. Check the app at 360px and at 1280px width, and with the keyboard only. Open and close a dialog with the keyboard, and check the focus.
6. Run `npm run check`, `npm run test:run` and `npm run build`. Commit when everything passes.

Notes for the approaches:

- **Bootstrap:** use classes for layout and typography. For the dialog and the toast use `react-bootstrap` (`npm i react-bootstrap`), because Bootstrap's own JavaScript does not work well with React.
- **shadcn/ui:** run `npx shadcn@latest init -d` after Tailwind is set up. Add the components you need with `npx shadcn@latest add ...`. A toast comes from `sonner`, remember to render its `<Toaster />` once in the app.
- **styled-components:** props that are only for styling start with `$` (`$status`).

If you run out of time, skip the toast and the search first. **Never skip the keyboard check.**

### Review your result

Review the code the agent wrote, not only the look:

- Are colors and spacing values from one place, or did the agent invent new ones?
- Are the same class lists or styled blocks repeated?
- Can you use the whole app with the keyboard only?
- Does the dialog trap the focus, close with Escape and return the focus to the button that opened it?
- Is there an unused dependency or an `any` in the diff?

### Bonus

- **Dark mode** in one of your versions. It follows the system setting and has a toggle. Use the way your approach is made for this: the `dark:` prefix in Tailwind, `data-bs-theme` in Bootstrap, a theme object with `ThemeProvider` in styled-components, the CSS variables of the theme in shadcn/ui. Check the contrast in both modes.
- **Design tokens:** define colors and spacing once and use them in both of your versions. Which approach makes this easier, and which makes it harder?
- **A third approach** that you have not used yet. Write down three things you would change after your review.

## What is in the starter

- `SPEC.md`: user stories, screens and acceptance criteria.
- `CLAUDE.md`: project rules for the coding agent, with a styling section for you to fill in.
- `src`: the finished logic with tests, and the unstyled `App.tsx`.

## Development

Install the dependencies with `npm i` first (Node.js 22.22 or newer is required).

- `npm run dev` starts the app in the browser
- `npm run test` runs the tests in the watch mode, `npm run test:run` runs them once
- `npm run check` checks the types
- `npm run build` builds the app
