import type { ElementType, ReactNode } from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "button"
  | "caption"
  | "overline"
  | "cardTitle"
  | "cardText"
  | "cardFine"
  | "numeric";

// Variant to class name (defined globally in theme/theme.css) and default tag.
const variantMap: Record<TypographyVariant, { className: string; tag: ElementType }> = {
  h1: { className: "typography-h1", tag: "h1" },
  h2: { className: "typography-h2", tag: "h2" },
  h3: { className: "typography-h3", tag: "h3" },
  h4: { className: "typography-h4", tag: "h4" },
  h5: { className: "typography-h5", tag: "h5" },
  h6: { className: "typography-h6", tag: "h6" },
  subtitle1: { className: "typography-subtitle1", tag: "p" },
  subtitle2: { className: "typography-subtitle2", tag: "p" },
  body1: { className: "typography-body1", tag: "p" },
  body2: { className: "typography-body2", tag: "p" },
  button: { className: "typography-button", tag: "span" },
  caption: { className: "typography-caption", tag: "span" },
  overline: { className: "typography-overline", tag: "span" },
  cardTitle: { className: "typography-card-title", tag: "p" },
  cardText: { className: "typography-card-text", tag: "p" },
  cardFine: { className: "typography-card-fine", tag: "p" },
  numeric: { className: "typography-numeric", tag: "span" },
};

export interface TypographyProps {
  readonly variant?: TypographyVariant;
  readonly as?: ElementType;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Typography({ variant = "body1", as, className, children }: TypographyProps) {
  const entry = variantMap[variant];
  const Tag = as ?? entry.tag;
  const classes = className ? `${entry.className} ${className}` : entry.className;
  return <Tag className={classes}>{children}</Tag>;
}
