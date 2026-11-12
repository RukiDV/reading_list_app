# Reading List

A reading list built with React 19, TypeScript and Vite. No backend, the data is kept in `localStorage`. Read `SPEC.md` before you build anything.

## Commands

- `npm run dev`: start the app on http://localhost:3000
- `npm run test:run`: run the tests once
- `npm run check`: check the types
- `npm run build`: build the app

## Rules

- **Do not change** `src/useBooks.ts`, `src/books.ts`, `src/types.ts` or `src/seed.json`. They are tested and shared between all versions of the app. Only build the view layer.
- Use function components and hooks. No class components.
- No `any`. Type props explicitly.
- Keep components small. One component per file in `src/components`.
- Run `npm run check` and `npm run test:run` before you say a task is done.

## Styling

Approach on this branch (`variant-tailwind`): **Tailwind CSS v4 only**.

- No `tailwind.config.js`. Configure with `@theme` in `src/index.css`.
- Brand, status, danger colors and fonts are tokens in `@theme`. Use them (`bg-brand-600`, `bg-status-done-bg`). Do not invent new colors or use arbitrary values like `p-[13px]`; use the default Tailwind spacing scale.
- No inline `style` props, no other CSS libraries.
- Reuse components. Do not repeat long class lists, extract a component (`Button`, `Dialog`, `StatusBadge`).
- Dialogs use the native `<dialog>` element (focus trap, Escape and focus return come from the browser).

Rules for every approach:

- Every interactive element must work with the keyboard and show a visible focus.
- Colors and spacing come from one place (theme, variables or design scale), do not invent new values.
- Check the layout at 360px and at 1280px.
