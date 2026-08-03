/**
 * What a project link actually points at.
 *
 * The distinction matters: only `app` is a running product you can use in the
 * browser, so only `app` earns the green "live" pill. A native app's landing
 * page is `site` — a brochure, not the product.
 */
export type TProjectLinkKind =
  | "app"
  | "site"
  | "appstore"
  | "playstore"
  | "download"
  | "repo"
  | "video";
