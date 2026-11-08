import { seatColourName, type SeatNumber } from "./resources";

// Seat identity is colour AND shape: circle, square, triangle, cross.
const seatShapes: Readonly<Record<SeatNumber, string>> = {
  1: "M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z",
  2: "M5.5 5.5h13v13h-13z",
  3: "M12 4.5 20 18.5H4z",
  4: "M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z",
};

export interface SeatMarkProps {
  readonly seat: SeatNumber;
  readonly size?: number;
  /** Draw the mark in the seat's contrast colour (for use on a seat-coloured background). */
  readonly onSeatColour?: boolean;
}

export function SeatMark({ seat, size = 20, onSeatColour = false }: SeatMarkProps) {
  const fill = onSeatColour ? `var(--game-seat-${seat}-contrast)` : `var(--game-seat-${seat})`;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={`Seat ${seat}, ${seatColourName[seat]}`}
    >
      <path d={seatShapes[seat]} fill={fill} stroke={onSeatColour ? "none" : "var(--palette-background-default)"} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function seatShapePath(seat: SeatNumber): string {
  return seatShapes[seat];
}
