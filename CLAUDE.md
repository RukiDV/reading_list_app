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

Approach for this branch: **shadcn/ui** (on Tailwind CSS v4).

- shadcn components are copied into `src/components/ui` with the CLI (`npx shadcn@latest add <name>`). Do not hand-write what the CLI can add. They are our code, so we may edit them, but prefer to change tokens or use `variant`s.
- Tailwind v4 only. No `tailwind.config.js`. Design tokens are CSS variables in `src/index.css` (shadcn's `:root` and `.dark` blocks, mapped with `@theme inline`).
- Use the semantic token classes (`bg-background`, `text-muted-foreground`, `border-input`...), never raw palette colors or arbitrary values.
- Use `cn()` from `src/lib/utils.ts` to merge classes. No inline `style` props, no other CSS libraries.
- App components stay in `src/components` (one per file) and compose the `ui` components. Do not repeat long class lists, extract a component.
- The CLI writes the `ui` files. They may contain things we would not write ourselves (for example an inline `style` in `sonner.tsx`). Leave those as generated.
- Dialog, Select and Toast come from shadcn (Base UI and sonner), so we do not build our own.

Rules for every approach:

- Every interactive element must work with the keyboard and show a visible focus.
- Colors and spacing come from one place (theme, variables or design scale), do not invent new values.
- Check the layout at 360px and at 1280px.
