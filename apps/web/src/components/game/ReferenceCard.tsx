import { PlayingCardShell } from "./PlayingCardShell";
import { Typography } from "../Typography/Typography";
import shellStyles from "./playingCardShell.module.css";

export interface ReferenceCardProps {
  readonly title: string;
  readonly text: string;
  readonly width?: number;
}

/** Rules reminder card (no sector market). */
export function ReferenceCard({ title, text, width = 156 }: ReferenceCardProps) {
  return (
    <PlayingCardShell rim="var(--palette-text-secondary)" width={width} ariaLabel={`${title}, reference`}>
      <div className={shellStyles.titleBar}>
        <Typography variant="cardTitle">{title}</Typography>
        <Typography variant="cardFine">Reference</Typography>
      </div>
      <div className={shellStyles.body}>
        <Typography variant="cardText">{text}</Typography>
      </div>
    </PlayingCardShell>
  );
}
