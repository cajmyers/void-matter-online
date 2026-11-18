import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "./BoardViewport.module.css";

const minZoom = 0.45;
const maxZoom = 1.8;
const defaultZoom = 1;
/** Wheel / trackpad sensitivity; lower = slower zoom. */
const zoomWheelSensitivity = 0.0016;

interface CameraState {
  readonly pan: { readonly x: number; readonly y: number };
  readonly zoom: number;
}

export interface BoardViewportProps {
  readonly children: ReactNode;
  readonly initialPan?: { readonly x: number; readonly y: number };
  /** Wheel zoom is enabled while the pointer is inside this region (defaults to the viewport). */
  readonly wheelRegionRef?: RefObject<HTMLElement | null>;
}

function pointerInRect(clientX: number, clientY: number, rect: DOMRectReadOnly): boolean {
  return (
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  );
}

function clampZoom(zoom: number): number {
  return Math.min(maxZoom, Math.max(minZoom, zoom));
}

/** Pan and zoom wrapper for the play-table board (`implementation-plan.md` §5.3). */
export function BoardViewport({ children, initialPan, wheelRegionRef }: BoardViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<CameraState>(() => ({
    zoom: defaultZoom,
    pan: initialPan ?? { x: 0, y: 0 },
  }));
  const didAutoCenter = useRef(initialPan !== undefined);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useLayoutEffect(() => {
    if (didAutoCenter.current) return;
    const viewport = viewportRef.current;
    const board = boardRef.current;
    if (!viewport || !board || board.offsetWidth === 0) return;
    didAutoCenter.current = true;
    setCamera((current) => ({
      ...current,
      pan: {
        x: (viewport.clientWidth - board.offsetWidth * current.zoom) / 2,
        y: (viewport.clientHeight - board.offsetHeight * current.zoom) / 2,
      },
    }));
  });

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const region = wheelRegionRef?.current ?? viewport;
      if (!pointerInRect(event.clientX, event.clientY, region.getBoundingClientRect())) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = viewport.getBoundingClientRect();
      /** Focal point: pointer position in viewport space (works even if the wheel target is a sibling layer). */
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;
      const factor = Math.exp(-event.deltaY * zoomWheelSensitivity);

      setCamera((current) => {
        const nextZoom = clampZoom(current.zoom * factor);
        if (nextZoom === current.zoom) return current;

        const wx = (cx - current.pan.x) / current.zoom;
        const wy = (cy - current.pan.y) / current.zoom;

        return {
          zoom: nextZoom,
          pan: {
            x: cx - wx * nextZoom,
            y: cy - wy * nextZoom,
          },
        };
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [wheelRegionRef]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragOrigin.current = { x: event.clientX, y: event.clientY, panX: camera.pan.x, panY: camera.pan.y };
      setDragging(true);
    },
    [camera.pan.x, camera.pan.y],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = event.clientX - dragOrigin.current.x;
    const dy = event.clientY - dragOrigin.current.y;
    setCamera((current) => ({
      ...current,
      pan: { x: dragOrigin.current.panX + dx, y: dragOrigin.current.panY + dy },
    }));
  }, [dragging]);

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }, []);

  const { pan, zoom } = camera;

  return (
    <div
      ref={viewportRef}
      className={dragging ? `${styles.viewport} ${styles.viewportDragging}` : styles.viewport}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="presentation"
    >
      <div
        ref={boardRef}
        className={styles.cameraLayer}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {children}
      </div>
    </div>
  );
}