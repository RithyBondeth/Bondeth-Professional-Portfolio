import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { test } from "node:test";
import { loadTypescript } from "../scripts/lib/load-typescript.mjs";

const { getProjects } = loadTypescript(
  "features/portfolio/data/localized-content.ts",
);
const { PROJECT_GROUPS } = loadTypescript(
  "features/portfolio/domain/project-category.ts",
);
const imageDimensions = JSON.parse(
  readFileSync(
    new URL(
      "../features/portfolio/data/project-image-dimensions.json",
      import.meta.url,
    ),
    "utf8",
  ),
);

test("both project catalogs share slugs, approved assets, and collections", () => {
  const english = getProjects("en");
  const khmer = getProjects("km");
  const slugs = new Set(english.map(({ slug }) => slug));
  assert.equal(slugs.size, english.length, "slugs must be unique");
  assert.ok(!slugs.has("dreamscape"), "Dreamscape is excluded");
  assert.equal(khmer.length, english.length);
  for (const [index, project] of english.entries()) {
    const localized = khmer[index];
    assert.equal(localized.slug, project.slug);
    assert.equal(localized.group, project.group);
    assert.ok(PROJECT_GROUPS.includes(project.group));
    assert.ok(localized.description);
    if (project.visibility === "confidential") continue;
    for (const asset of [
      project.image,
      project.logo,
      imageDimensions[project.image]?.thumbnail,
    ]) {
      assert.ok(
        asset?.startsWith("/"),
        `${project.slug} is missing local media`,
      );
      const file = new URL(`../public${asset}`, import.meta.url);
      assert.ok(statSync(file).size > 0, `${project.slug} is missing ${asset}`);
    }
    assert.ok(
      project.caseStudy?.problem && localized.caseStudy?.problem,
      project.slug,
    );
    assert.ok(project.caseStudy.decisions.length > 0, project.slug);
    for (const image of project.caseStudy.gallery ?? []) {
      assert.ok(
        image.sourceUrl.startsWith("https://"),
        `${image.src} needs a public screenshot source`,
      );
      assert.match(
        image.capturedAt,
        /^\d{4}-\d{2}-\d{2}$/,
        `${image.src} needs a capture date`,
      );
    }
    for (const src of [
      project.image,
      ...(project.caseStudy.gallery ?? []).map((image) => image.src),
    ]) {
      const dimensions = imageDimensions[src];
      assert.ok(
        dimensions?.width > 0 && dimensions?.height > 0,
        `${src} is missing its original dimensions`,
      );
      assert.ok(statSync(new URL(`../public${src}`, import.meta.url)).size > 0);
    }
    assert.ok(
      project.tags.length > 0 && project.tags.length <= 6,
      project.slug,
    );
    assert.equal(new Set(project.tags).size, project.tags.length, project.slug);
  }
});

test("landing captures and generated thumbnails use content-versioned URLs", () => {
  for (const project of getProjects("en")) {
    if (!project.image || project.visibility === "confidential") continue;
    const assets = [imageDimensions[project.image].thumbnail];
    if (project.previewType === "landing") assets.push(project.image);
    for (const asset of assets) {
      const bytes = readFileSync(new URL(`../public${asset}`, import.meta.url));
      const revision = createHash("sha256")
        .update(bytes)
        .digest("hex")
        .slice(0, 12);
      assert.ok(
        asset.endsWith(`-${revision}.webp`),
        `${asset} must change when its content changes`,
      );
    }
  }
});

test("documentation and source links stay off limited and confidential profiles", () => {
  for (const project of getProjects("en")) {
    if (project.visibility === "public") continue;
    assert.ok(
      project.links.every((link) => !["repo", "docs"].includes(link.kind)),
      project.slug,
    );
  }
});
