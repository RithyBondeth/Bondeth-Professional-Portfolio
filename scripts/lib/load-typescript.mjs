import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "../..");
const modules = new Map();

/** Load server adapters in Node tests without Next's server-only build marker. */
export function loadTypescript(relativePath) {
  const filename = path.join(root, relativePath);
  if (modules.has(filename)) return modules.get(filename);
  const exports = {};
  modules.set(filename, exports);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(
    code,
    {
      exports,
      process,
      require(specifier) {
        if (specifier === "server-only") return {};
        if (specifier.startsWith("@/")) {
          return loadTypescript(`${specifier.slice(2)}.ts`);
        }
        return require(specifier);
      },
    },
    { filename },
  );
  return exports;
}
