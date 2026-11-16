import { lazy, Suspense, type ReactNode } from "react";
import { AppShell } from "./AppShell";
import { useHashRoute } from "./useHashRoute";
import { ComingSoonPage } from "../pages/ComingSoonPage/ComingSoonPage";

const StylePage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/StylePage/StylePage")) : null;
const GalleryPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/GalleryPage/GalleryPage")) : null;
const TilesPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/TilesPage/TilesPage")) : null;
const S1CardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/S1CardsPage/S1CardsPage")) : null;
const S2CardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/S2CardsPage/S2CardsPage")) : null;
const S3CardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/S3CardsPage/S3CardsPage")) : null;
const S4CardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/S4CardsPage/S4CardsPage")) : null;
const CrewCardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/CrewCardsPage/CrewCardsPage")) : null;
const MissionCardsPage = __DEV_PAGES__ ? lazy(() => import("../pages/dev/MissionCardsPage/MissionCardsPage")) : null;

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
    if (path === "/dev/tiles" && TilesPage) return <TilesPage />;
    if (path === "/dev/s1-cards" && S1CardsPage) return <S1CardsPage />;
    if (path === "/dev/s2-cards" && S2CardsPage) return <S2CardsPage />;
    if (path === "/dev/s3-cards" && S3CardsPage) return <S3CardsPage />;
    if (path === "/dev/s4-cards" && S4CardsPage) return <S4CardsPage />;
    if (path === "/dev/crew-cards" && CrewCardsPage) return <CrewCardsPage />;
    if (path === "/dev/mission-cards" && MissionCardsPage) return <MissionCardsPage />;
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
