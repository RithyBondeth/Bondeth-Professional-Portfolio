/**
 * Barrel for the blog data layer.
 *
 * Server-only: get-all-posts and get-post-by-slug read from the filesystem, so
 * importing a *value* from here in a "use client" component pulls `fs` into the
 * browser bundle and breaks the build. Type-only imports are erased and safe;
 * client components needing a pure helper should import its module directly.
 */

/* --------------------------------- Exports ---------------------------------- */
export * from "./blog/get-all-posts";
export * from "./blog/get-categories";
export * from "./blog/get-post-by-slug";
export * from "./blog/get-related-posts";
export * from "./blog/get-reading-time";
export * from "./blog/get-table-of-contents";
export * from "./blog/get-tags";
export * from "./blog/slugify-tag";
