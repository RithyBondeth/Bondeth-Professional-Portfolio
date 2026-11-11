import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

// Selecting a calendar day must preserve that day across UTC offsets and DST.
for (const timezone of [
  "UTC",
  "Asia/Phnom_Penh",
  "America/Los_Angeles",
  "Pacific/Kiritimati",
]) {
  test(`calendar selections keep their date in ${timezone}`, () => {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
          import assert from "node:assert/strict";
          import { loadTypescript } from "./scripts/lib/load-typescript.mjs";
          const { calendarDateFromISO, calendarDateToISO } = loadTypescript("shared/lib/calendar-date.ts");
          for (const value of ["2024-02-29", "2026-03-08", "2026-11-01", "2026-11-10", "2026-12-31", "2027-01-01"]) {
            const parsed = calendarDateFromISO(value);
            assert.equal(calendarDateToISO(parsed), value);
            const [year, month, day] = value.split("-").map(Number);
            assert.equal(calendarDateToISO(new Date(year, month - 1, day)), value);
          }
        `,
      ],
      {
        cwd: new URL("..", import.meta.url),
        env: { ...process.env, TZ: timezone },
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  });
}
