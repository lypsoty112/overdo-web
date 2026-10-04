// The cheat sheet "?" opens: every keyboard shortcut and what it does. Pressing ? or Esc again, or the
// Close button, dismisses it.
const SHORTCUTS = [
  ["n", "New task"],
  ["j / k", "Select next / previous task"],
  ["x", "Complete or reopen the selected task"],
  ["e", "Edit the selected task's title"],
  ["Delete", "Delete the selected task (undo for 5 s)"],
  ["?", "Show or hide this list"],
  ["Esc", "Close this list, clear the selection"],
];

export function ShortcutHelp({ onClose }: { onClose: () => void }) {
  return (
    <section className="shortcut-help" role="dialog" aria-label="Keyboard shortcuts">
      <h2>Keyboard shortcuts</h2>
      <dl>
        {SHORTCUTS.map(([keys, action]) => (
          <div key={keys}>
            <dt>
              <kbd>{keys}</kbd>
            </dt>
            <dd>{action}</dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </section>
  );
}
