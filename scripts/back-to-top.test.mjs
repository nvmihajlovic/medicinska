import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/back-to-top.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const realRequire = createRequire(import.meta.url);

function fixture(reducedMotion = false) {
  let time = 0;
  let nextFrame = 0;
  const frames = new Map();
  const listeners = new Map();
  const motion = {
    matches: reducedMotion,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  const window = {
    scrollY: 2000,
    matchMedia: () => motion,
    scrollTo: ({ top }) => { window.scrollY = top; },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: testModule,
    exports: testModule.exports,
    require: (id) => {
      if (id === "react") return { useEffect: () => {}, useRef: (value) => ({ current: value }), useState: (value) => [value, () => {}] };
      if (id === "next/navigation") return { usePathname: () => "/" };
      if (id === "@/lib/localization") return { localeFromPath: () => "sr" };
      return realRequire(id);
    },
    window,
    performance: { now: () => time },
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  const button = testModule.exports.BackToTop();
  return {
    window,
    listeners,
    frames,
    click: () => button.props.onClick({ detail: 1 }),
    advance: (now) => {
      time = now;
      const [id, callback] = frames.entries().next().value;
      frames.delete(id);
      callback(now);
    },
  };
}

test("back to top moves gradually and finishes at the top", () => {
  const f = fixture();
  f.click();
  f.advance(300);
  assert.ok(f.window.scrollY > 0 && f.window.scrollY < 2000);
  f.advance(1400);
  assert.equal(f.window.scrollY, 0);
  assert.equal(f.frames.size, 0);
  assert.equal(f.listeners.size, 0);
});

test("wheel and keyboard scrolling interrupt the animation", () => {
  for (const [event, value] of [["wheel", {}], ["keydown", { key: "ArrowDown" }]]) {
    const f = fixture();
    f.click();
    f.advance(200);
    const position = f.window.scrollY;
    f.listeners.get(event)(value);
    assert.equal(f.window.scrollY, position);
    assert.equal(f.frames.size, 0);
    assert.equal(f.listeners.size, 0);
  }
});

test("reduced motion goes directly to the top", () => {
  const f = fixture(true);
  f.click();
  assert.equal(f.window.scrollY, 0);
  assert.equal(f.frames.size, 0);
});
