/** Payload shape depends on pending prompt kind; engine validates. */
export type DecisionPayload = unknown;

export interface Decision {
  readonly promptId: string;
  readonly payload: DecisionPayload;
}