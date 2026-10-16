export type ClarifyQuestion = { id: string; text: string; type: "yesno" | "choice"; options: string[] };
export type ClarifyResult = { enabled: boolean; failed?: boolean; questions: ClarifyQuestion[]; searchNeeds: string[] };
export type Answer = { choice?: string | undefined; text?: string | undefined; skipped?: boolean | undefined };
