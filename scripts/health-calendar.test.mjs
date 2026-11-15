import assert from "node:assert/strict";
import test from "node:test";
import { belgradeDate, healthObservances } from "../src/lib/health-calendar.ts";

test("uses Belgrade dates across midnight and daylight saving changes", () => {
  assert.equal(belgradeDate(new Date("2025-12-31T22:59:59Z")), "2025-12-31");
  assert.equal(belgradeDate(new Date("2025-12-31T23:00:00Z")), "2026-01-01");
  assert.equal(belgradeDate(new Date("2026-06-30T21:59:59Z")), "2026-06-30");
  assert.equal(belgradeDate(new Date("2026-06-30T22:00:00Z")), "2026-07-01");
});

test("shows at most one daily and monthly observance when campaigns overlap", () => {
  const overlap = healthObservances("2026-10-29");
  assert.equal(overlap.daily.length, 1);
  assert.match(overlap.daily[0].title, /можданог удара/);
  assert.equal(overlap.monthly.length, 1);
  assert.match(overlap.monthly[0].title, /дојке/);
  assert.equal(healthObservances("2026-11-14").daily.length, 1);
});

test("shows one November campaign and WHO awareness week within its dates", () => {
  const november = healthObservances("2026-11-14");
  assert.equal(november.monthly.length, 1);
  assert.match(november.monthly[0].title, /дијабетесу/);
  assert.equal(healthObservances("2026-11-17").weekly.length, 0);
  assert.match(healthObservances("2026-11-18").weekly[0].title, /антимикробној/);
  assert.equal(healthObservances("2026-11-24").weekly.length, 1);
  assert.equal(healthObservances("2026-11-25").weekly.length, 0);
  assert.equal(healthObservances("2026-04-25").weekly.length, 1);
  assert.equal(healthObservances("2026-04-25").daily.length, 1);
  assert.equal(healthObservances("2026-08-07").weekly.length, 1);
  assert.equal(healthObservances("2026-08-08").weekly.length, 0);
});

test("shows a WHO week without a daily observance and keeps the monthly campaign", () => {
  const calendar = healthObservances("2026-10-20");
  assert.deepEqual(calendar.daily, []);
  assert.match(calendar.weekly[0].title, /тровања оловом/);
  assert.match(calendar.monthly[0].title, /дојке/);
  assert.equal(healthObservances("2026-10-17").weekly.length, 0);
  assert.equal(healthObservances("2026-10-24").weekly.length, 1);
  assert.equal(healthObservances("2026-10-25").weekly.length, 0);
  assert.equal(healthObservances("2027-10-20").weekly.length, 0);
});

test("includes additional dates from WHO campaigns alongside monthly topics", () => {
  for (const [date, title] of [
    ["2026-09-10", /превенције самоубиства/],
    ["2026-12-03", /особа са инвалидитетом/],
    ["2026-12-12", /здравствене покривености/],
  ]) {
    const calendar = healthObservances(date);
    assert.match(calendar.daily[0].title, title);
    assert.equal(calendar.monthly.length, 1);
  }
});

test("provides a monthly topic for every month, including dates without daily events", () => {
  for (let month = 1; month <= 12; month++) {
    const calendar = healthObservances(`2026-${String(month).padStart(2, "0")}-02`);
    assert.ok(calendar.monthly.length);
    assert.ok(calendar.monthly.every((item) => item.title && item.description));
  }
  assert.deepEqual(healthObservances("2026-02-02").daily, []);
  assert.equal(healthObservances("2024-02-29").day, "29");
});

test("rejects malformed or impossible calendar dates", () => {
  for (const date of ["2025-02-29", "2026-04-31", "2026-13-01", "2026-1-01", "not-a-date"]) {
    assert.throws(() => healthObservances(date), /Неисправан датум/);
  }
});
