import { lazy, Suspense, type ReactNode } from "react";
import { AppShell } from "./AppShell";
import { useHashRoute } from "./useHashRoute";
import { ComingSoonPage } from "../pages/ComingSoonPage/ComingSoonPage";

const StylePage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/StylePage/StylePage")) : null;
const GalleryPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/GalleryPage/GalleryPage")) : null;

function pageFor(path: string): ReactNode {
  if (path === "/") {
    return (
      <ComingSoonPage
        title="The table"
        stage="Stage 1c"
        description="The full play screen (board, ships, markets, player mat, prompts) rendered from fixtures. Not built yet. The style page shows the look it will have."
      />
    );
  }
  if (__DEV_PAGES__) {
    if (path === "/dev/style" && StylePage) return <StylePage />;
    if (path === "/dev/gallery" && GalleryPage) return <GalleryPage />;
    if (path === "/dev/lab") {
      return (
        <ComingSoonPage
          title="Motion lab"
          stage="Stage 1e"
          description="Tile flips, card moves, dice throws and combat effects. Not built yet."
        />
      );
    }
  }
  return <ComingSoonPage title="Not found" stage="" description={`There is no page at ${path}.`} />;
}

export function App() {
  const path = useHashRoute();
  return (
    <AppShell path={path}>
      <Suspense fallback={null}>{pageFor(path)}</Suspense>
    </AppShell>
  );
}
