import "server-only";

/**
 * Barrel for the blog data layer.
 *
 * Server-only: get-all-posts and get-post-by-slug read from the filesystem, so
 * importing a *value* from here in a "use client" component pulls `fs` into the
 * browser bundle and breaks the build. Type-only imports are erased and safe;
 * client components needing a pure helper should import its module directly.
 */

export * from "@/features/blog/server/get-all-posts";
export * from "@/features/blog/server/get-categories";
export * from "@/features/blog/server/get-post-by-slug";
export * from "@/features/blog/server/get-related-posts";
export * from "@/features/blog/server/get-tags";
