# CLI Accessibility & Output Guidelines

When generating, modifying, or refactoring CLI tool outputs, adhere strictly to the following accessibility and environmental standards.

### 1. Color & Contrast Rules
*   **Never Rely Solely on Color:** Always pair color-coded states with explicit text labels (e.g., use `[PASS]` or `[FAIL]`, not just green/red text).
*   **Adhere to Semantic Color Standards:** Use colors strictly according to their established terminal meanings:
    *   **Red:** Critical errors, failures, and destructive actions (e.g., deletions, terminations).
    *   **Green:** Success states, completions, and additions (e.g., creations, updates).
    *   **Yellow:** Warnings, deprecations, and non-fatal issues.
    *   **Cyan/Blue:** Informational notes, subtext, and hyperlinks.
*   **Use Standard ANSI Names:** Prefer standard semantic ANSI colors (and their "Bright" variants for accents) over hardcoded Hex/RGB values to ensure compatibility with both light and dark terminal themes.
*   **Avoid Deep Blue:** Never use standard dark/mid-tone blue for accents or text due to severe contrast issues on dark backgrounds; default to **Bright Cyan** or **Bright Magenta** for decorative accents.

### 2. Environmental & Stream Discipline
*   **Respect Environment Flags:** Automatically strip all ANSI color codes and formatting if `process.env.NO_COLOR` is present or if the output stream is non-interactive (Not a TTY).
*   **Separate Streams:** Send raw data payloads to `stdout` and logs, warnings, or errors to `stderr` to allow clean piping (`tool > output.txt`).
*   **Provide Flat Fallbacks:** Ensure a global flag (e.g., `--plain`, `--no-ansi`, or `--json`) exists to flatten dynamic layouts, stop text overwriting (`\r`), and disable progress animations.

### 3. Text Layout & Screen Readers
*   **Ban Decorative ASCII Art:** Do not use ASCII borders, boxes, or decorative dividers (e.g., `+----+`). They create severe auditory clutter for screen readers.
*   **Linear & Predictable Hierarchy:** Place critical summaries, final statuses, and actionable remediation steps at the very bottom of the command output execution block.