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
- Every row shows its priority (P1–P4), energy (🐢 low to 🌪️ chaotic), a relative due date ("due
  tomorrow", "3 days overdue" in red), subtask progress and tags.
- The tab title counts open tasks, and an empty list offers a few starter tasks.
- Deleting (or clearing completed) can be undone for five seconds before it reaches the API.
- ▾ unfolds a details panel: priority, energy and due date pickers, notes, tag chips with
  autocomplete, and a subtask checklist.
- A stats bar pinned to the top: level and XP, streak, today's completions and focus minutes, mood of
  the day, and a procrastination index that turns red past 50%.
- Completing a task fires confetti (more for higher priority) and asks how it felt.
- 🍅 on a row starts a 25-minute focus session with a floating countdown; a session that runs its full
  length stops itself and pays XP.
- `#/board` swaps the list for a kanban board; dragging a card into Done completes it.
- A daily task horoscope sits under the list. It is the same for everyone until midnight UTC.
- Every P1 task is a boss with a name, a bounty and an HP bar that drains as its subtasks are ticked.
  Completing it lands the final blow: a victory banner, extra confetti, and the bounty in XP.

## Roadmap nobody asked for

| Feature | Touches |
| --- | --- |
| "Blocked by" dependencies between tasks | db, api, web |
| Recurring tasks | db, api, web |
| Achievements ("Finished a P1 before noon") | db, api, web |
| Undo for deleted tasks (they are only soft-deleted anyway) | api, web |
| Weekly procrastination report | api, web |
| Export to `.ics` | api |
| Sound effects on completion | web |
| Dark mode | web |
| Keyboard shortcuts | web |

## Credits

Base styles are [todomvc-app-css](https://github.com/tastejs/todomvc-app-css) by Sindre Sorhus,
licensed CC-BY-4.0.
