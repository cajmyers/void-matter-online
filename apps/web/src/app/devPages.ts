// The /dev/* pages ship in dev and in the preview build, and are stripped from
// the production build (docs/implementation-plan.md, Stage 0).
//
// Use `__DEV_PAGES__` directly where a lazy import must be removable: it is a
// compile-time literal, so the branch is eliminated in production. This
// re-export is a runtime value, fine for UI that merely hides a link.
export const devPagesEnabled: boolean = __DEV_PAGES__;
