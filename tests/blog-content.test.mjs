import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTypescript } from "./helpers/load-typescript.mjs";

const { getAllPosts } = loadTypescript("features/blog/server/get-all-posts.ts");
const { getPostBySlug } = loadTypescript(
  "features/blog/server/get-post-by-slug.ts",
);

for (const locale of ["en", "km"]) {
  test(`${locale} blog listings and detail pages return identical content and metadata`, async () => {
    const posts = await getAllPosts(locale);
    assert.ok(posts.length > 0);
    for (const post of posts) {
      const detail = await getPostBySlug(post.slug, locale);
      assert.equal(JSON.stringify(detail), JSON.stringify(post));
      assert.ok(post.readingTime >= 1);
    }
    const timestamps = posts.map((post) => new Date(post.date).getTime());
    assert.deepEqual(
      timestamps,
      [...timestamps].sort((a, b) => b - a),
    );
  });
}

test("unknown blog slugs return null in both locales", async () => {
  assert.equal(await getPostBySlug("missing-post", "en"), null);
  assert.equal(await getPostBySlug("missing-post", "km"), null);
});
