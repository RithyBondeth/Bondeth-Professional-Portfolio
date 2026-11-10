import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadTypescript } from "./lib/load-typescript.mjs";

const { getProjects } = loadTypescript(
  "features/portfolio/data/localized-content.ts",
);
const publicDir = new URL("../public/", import.meta.url);
const outputDir = new URL("project-thumbnails/", publicDir);
await mkdir(outputDir, { recursive: true });

const projects = getProjects("en").filter(
  (project) => project.image && project.visibility !== "confidential",
);
const dimensions = {};

for (const project of projects) {
  if (!/^\/(?:previews|project-preview)\/[\w.-]+$/.test(project.image)) {
    throw new Error(
      `Expected a local preview for ${project.slug}: ${project.image}`,
    );
  }

  const image = fileURLToPath(new URL(project.image.slice(1), publicDir));
  const thumbnail = await sharp(image)
    .resize(768, 432, { fit: "cover", position: "north" })
    .webp({ quality: 77 })
    .toBuffer();
  const revision = createHash("sha256")
    .update(thumbnail)
    .digest("hex")
    .slice(0, 12);
  const filename = `${project.slug}-${revision}.webp`;
  await writeFile(new URL(filename, outputDir), thumbnail);

  for (const src of [
    project.image,
    ...(project.caseStudy?.gallery ?? []).map((item) => item.src),
  ]) {
    if (dimensions[src]) continue;
    const { width, height } = await sharp(
      fileURLToPath(new URL(src.slice(1), publicDir)),
    ).metadata();
    dimensions[src] = { width, height };
  }
  dimensions[project.image].thumbnail = `/project-thumbnails/${filename}`;
}

await writeFile(
  new URL(
    "../features/portfolio/data/project-image-dimensions.json",
    import.meta.url,
  ),
  `${JSON.stringify(dimensions, null, 2)}\n`,
);
console.log(`Generated ${projects.length} project thumbnails.`);
