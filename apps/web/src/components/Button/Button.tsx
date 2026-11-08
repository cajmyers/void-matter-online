import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "contained" | "outlined" | "text";
export type ButtonColour = "primary" | "secondary" | "error";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly colour?: ButtonColour;
  /** "large" is for the one primary action on screen, such as End Turn. */
  readonly size?: "medium" | "large";
}

export function Button({ variant = "contained", colour = "primary", size = "medium", className, type = "button", ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[colour], size === "large" ? styles.large : undefined, className]
    .filter(Boolean)
    .join(" ");
  return <button type={type} className={classes} {...rest} />;
}
