import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(new URL("../lib/motion-preference.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

function environment({ reduced = false } = {}) {
  const media = new EventTarget();
  media.matches = reduced;
  const window = { matchMedia: () => media };
  const document = { documentElement: { dataset: {} } };
  const exports = {};
  vm.runInNewContext(code, { exports, window, document });
  return { api: exports, media, document };
}

test("device preference initializes motion and updates subscribers live", () => {
  const { api, media, document } = environment({ reduced: true });
  let changes = 0;
  const stop = api.subscribeToMotionPreference(() => changes++);
  assert.equal(api.isMotionReduced(), true);
  assert.equal(document.documentElement.dataset.motion, "quiet");
  media.matches = false;
  media.dispatchEvent(new Event("change"));
  assert.equal(api.isMotionReduced(), false);
  assert.equal(document.documentElement.dataset.motion, "full");
  assert.equal(changes, 1);
  stop();
  media.matches = true;
  media.dispatchEvent(new Event("change"));
  assert.equal(changes, 1);
});

test("obsolete manual preference does not override the device setting", () => {
  const { api, document } = environment();
  document.documentElement.dataset.quiet = "true";
  const stop = api.subscribeToMotionPreference(() => {});
  assert.equal(api.isMotionReduced(), false);
  assert.equal(document.documentElement.dataset.motion, "full");
  stop();
});

test("motion preference is safe during server rendering", () => {
  const exports = {};
  vm.runInNewContext(code, { exports });
  assert.equal(exports.isMotionReduced(), false);
});
