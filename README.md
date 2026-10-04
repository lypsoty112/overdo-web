# overdo-web

The UI for **Overdo**, the to-do list that does far too much. It starts as a faithful TodoMVC (the
stock `todomvc-app-css` stylesheet and markup) and bolts features onto it from there. React + Vite;
the API is `overdo-api`, the schema `overdo-db`.

## Run it

```bash
bun install
bun run dev        # http://localhost:5173
```

The dev server proxies `/api` to `overdo-api` on `http://localhost:3700`, so start that first.

## What it does

- Everything TodoMVC does: add, toggle, toggle all, double-click to edit, delete, filter
  (`#/active`, `#/completed`), clear completed.

## Credits

Base styles are [todomvc-app-css](https://github.com/tastejs/todomvc-app-css) by Sindre Sorhus,
licensed CC-BY-4.0.
