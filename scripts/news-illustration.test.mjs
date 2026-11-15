import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { newsCategories } from "../src/lib/news-categories.ts";
import { newsIllustration } from "../src/lib/news-illustration.ts";

test("uses a schedule illustration for Serbian exam and class schedules", () => {
  for (const title of ["Распоред ученика прве године", "Испити у августовском року", "Raspored ispita"]) {
    assert.equal(newsIllustration(title, "obavestenja"), "/images/news/raspored.svg");
  }
});

test("provides an existing local illustration for every category", () => {
  for (const category of newsCategories) {
    const path = newsIllustration("Објава", category.id);
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
  }
  assert.ok(existsSync(new URL("../public/images/news/raspored.svg", import.meta.url)));
});
