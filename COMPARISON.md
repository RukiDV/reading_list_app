# Tailwind CSS vs shadcn/ui: Reading List

Person 2: Approach A = **Tailwind CSS v4**, Approach B = **shadcn/ui** (on Tailwind v4).

All numbers were measured on the real branches (`vite build`, `vitest run`, `grep`). Where something is my judgment and not a measurement, it says so.

## The four branches

| Branch | What it is |
| --- | --- |
| `variant-tailwind` | Cards UI, Tailwind only |
| `variant-shadcn` | Cards UI, shadcn/ui |
| `variant-tailwind-bookshelf` | A + bookshelf view, dark mode, extras |
| `variant-shadcn-bookshelf` | B + the same bookshelf view, dark mode, extras |

The first pair is the fair comparison of the two approaches (same features). The second pair shows what happens when the app grows: the extras are the same code in both, so the gap between them stays about the same.

## Numbers

### Cards UI (`variant-tailwind` vs `variant-shadcn`)

| | Tailwind | shadcn/ui |
| --- | ---: | ---: |
| JavaScript, gzip | 72 kB | 148 kB |
| CSS, gzip | 3.5 kB | 9.6 kB |
| Font files in the build | none | 5 files (Geist, 76 kB; a browser loads only the subsets it needs) |
| Added dependencies | 2 (dev only) | 2 dev + 9 runtime |
| Components I wrote (`src/components`) | 15 files, 527 lines | 9 files, 397 lines |
| Components the CLI generated (`src/components/ui`) | 0 | 12 files, 1115 lines |
| `index.css` | 41 lines, 16 color tokens | 154 lines, 68 color tokens |
| `any` / raw colors / palette colors in my components | 0 / 0 / 0 | 0 / 0 / 0 |

### With bookshelf, dark mode and extras

| | Tailwind | shadcn/ui |
| --- | ---: | ---: |
| JavaScript, gzip | 75 kB | 151 kB |
| CSS, gzip | 6.4 kB | 11.9 kB |
| Components I wrote | 24 files, 960 lines | 18 files, 847 lines |
| Generated components | 0 | 12 files, 1115 lines |
| `index.css` | 237 lines | 332 lines |
| Extra logic (sort, pick, theme; identical in both) | 88 lines | 88 lines |
| Tests | 54 | 50 |
| Class strings over 100 characters (my components) | 6 | 5 |

The long class strings are in the shelf components (spine, cover, details, lamp, plaque) in both branches. Tailwind has one more in `Button.tsx`; in shadcn the same list lives in the generated `button.tsx`, which this count does not include.

Not comparable: the test counts (the two branches test different widgets, because shadcn brings its own dialog and select) and the time it took. I did not measure time.

## The review checklist from the README

**Are colors and spacing from one place?** Yes in both. No raw color, no palette color (`blue-500`) and no `any` in any component of any branch. In Tailwind the tokens live in `@theme` in `index.css`. In shadcn they live in `:root` and `.dark`.

**Are the same class lists repeated?** Not after cleanup. In Tailwind I had to extract them myself (`Button`, `Field` with `CONTROL_CLASSES`, `Card`). In shadcn `cva` variants do this and the CLI wrote them.

**Can the whole app be used with the keyboard only?** Yes in both. Checked in headless Chromium at 360px and 1280px.

**Does the dialog trap the focus, close with Escape and return the focus?**
- *Tailwind:* yes, with the native `<dialog>`, and the browser does the work. It still took me real bugs to get right: React StrictMode closed the dialog on its own because of a `close` event from the first effect run, and a click that started inside a field and ended on the backdrop closed it. Both are fixed and tested (`Dialog.tsx`, 67 lines).
- *shadcn:* yes. Base UI does all of it. Focus returned to "+ Add book" after Escape in the browser. I wrote no focus code for dialogs.

**Is there an unused dependency?**
- *Tailwind:* no.
- *shadcn:* `next-themes` is imported only by the generated `sonner.tsx`, and my app passes `theme` to the toaster itself, so the library does nothing useful. It is a library made for Next.js in a Vite app. I left it because the rule in `CLAUDE.md` is to keep generated files as generated. Removing it is a small change I would make.
- Also in generated code: one inline `style` in `sonner.tsx` (breaks our "no inline style" rule for code we write).

## Design tokens

**Tailwind makes this easier.** A token is written in `@theme` and the utility class exists (`bg-status-want-bg`). A dark value is one more line in one override block. That is **2 places** per color.

**shadcn needs 3 places** per color: the `@theme inline` mapping, `:root` and `.dark`. In return it gives a ready vocabulary (`background`, `foreground`, `muted-foreground`, `border`, `ring`) that every generated component already uses, so the dialog, select and toast followed the theme without extra work. It also ships 26 sidebar and chart tokens that this app never uses.

Tailwind needed 23 hand-written dark values. For shadcn the dark values of its own tokens came with `init`, and I only added about 12 for the shelf and the status colors.

## Dark mode

- **Tailwind:** I used the tokens, not the `dark:` prefix. The components contain **zero** `dark:` classes. A `data-theme` attribute on `<html>` switches one block of variables.
- **shadcn:** a `dark` class on `<html>` and the CSS variables, as the README suggests. The 27 `dark:` classes are all inside the generated files. My own components have none.
- **Both:** a small script in `index.html` sets the theme before the first paint (no flash), the OS setting is the default, and the choice is remembered in `localStorage`.
- **Contrast:** checked in both modes. Gold lettering on spines 6.2 to 6.5, dark-mode text 7.6 to 14.5.
- **A real finding:** shadcn's default red Delete button has a contrast of only **3.9** (minimum 4.5). I fixed it in one place by darkening the `--destructive` token to about 5.0. Nobody would see this without measuring.

## What went wrong (and what I learned)

1. **Tailwind silently ignores a class that does not exist.** `writing-vertical-rl` is not in Tailwind 4.3.5, so the book titles stayed horizontal with no error. I now check every new class in the built CSS and look at the page.
2. **`py-*` is `padding-block`.** On a vertical spine this padded left and right and made every book 80 to 96 px wide. Physical `pt-`/`pb-` fixed it.
3. **`--open false` in Vite opens `/false` in your browser.** Use `--no-open`.
4. **My CLAUDE.md said "Radix" but the CLI generated Base UI.** I wrote the rule from memory, before looking at the generated code. Fixed.
5. **I copied a block of CSS between branches by script** and brought a dead `data-theme` block along. Because of the cascade order it overrode the dark-mode lamp glow, so the dark shelf was dimmer than it should be. I found it only while collecting the numbers for this document. Fixed in `fb5d214`.
6. **jsdom has no `matchMedia`**, which the toast library calls. One small stub in `setupTests.ts`.
7. **The dialogs are async in shadcn tests**, and the toast adds its own `region`. The ported tests needed `findBy...` and a name for the details region.

## Summary

| | Tailwind | shadcn/ui |
| --- | --- | --- |
| Weight | About one third of the transfer size | Heavier, most of it the component library |
| Code you own | Everything, 24 files | 18 files plus 1115 lines you did not write |
| Dialog, select, toast, focus | You build and test them | Done, themed and accessible out of the box |
| Tokens | Simpler, 2 places | Richer vocabulary, 3 places |
| Risk | You can get accessibility wrong (I did, twice) | You must read what the CLI wrote (I found a contrast problem and an unused dependency) |
| Good for | Small apps, full control, tiny bundle | Apps with many forms and overlays, a team that wants a shared vocabulary |

My judgment: for **this** app, with one dialog, two selects and a toast, Tailwind is the better fit. The weight of shadcn is not paid back by four widgets. For an app with ten forms, popovers, menus and tables, the numbers would turn.

## Not checked

- Firefox and Safari (the 3D book cover is the most likely to differ).
- The shadcn Select with the keyboard in a real browser (only clicks in a real browser, and a click flow in tests).
- A screen reader (only the accessibility tree through the tests).
- Time and effort. The line counts say less code by hand for shadcn, but I did not measure how long either took.
- This was built with an agent, for one small app, by one person. Treat the numbers as a data point, not a rule.
