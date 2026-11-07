/**
 * Client for the FastAPI coach at POST /api/chat.
 *
 * The browser only talks to this Next.js origin. In local development,
 * next.config.ts forwards /api to the Python server. On Vercel, the root
 * vercel.json sends /api to the same FastAPI app. The OpenAI key never
 * reaches this file.
 */

export type PriorTurn = {
  speaker: "visitor" | "coach";
  text: string;
};

/** Keeps a single message short enough to type and review comfortably. */
const MESSAGE_LIMIT = 2000;

/**
 * The API accepts one string. Earlier turns are folded into that string
 * so the coach can follow the thread, then trimmed from the oldest end
 * if the transcript grows too long.
 */
const CONTEXT_BUDGET = 12_000;

type ChatPayload = {
  reply?: unknown;
  detail?: unknown;
};

export function messageLimit(): number {
  return MESSAGE_LIMIT;
}

/**
 * Build the body the API expects. The first message is sent as written.
 * Later messages include the visible thread so the coach has memory
 * without a second endpoint.
 */
export function composeCoachMessage(message: string, prior: PriorTurn[]): string {
  const trimmed = message.trim();
  if (prior.length === 0) {
    return trimmed;
  }

  const lines = prior.map((turn) => {
    const name = turn.speaker === "coach" ? "Coach" : "You";
    return `${name}: ${turn.text.trim()}`;
  });
  lines.push(`You: ${trimmed}`);

  while (lines.length > 1 && lines.join("\n\n").length > CONTEXT_BUDGET) {
    lines.shift();
  }

  return [
    "This is an ongoing conversation with a supportive mental coach.",
    "Reply only to the latest message from You. Use the earlier lines as context.",
    "",
    lines.join("\n\n"),
  ].join("\n");
}

function readableError(status: number, detail: string): string {
  if (detail.includes("OPENAI_API_KEY")) {
    return "The coach is not ready yet. Start the API with an OpenAI key, then send your message again.";
  }
  if (detail.toLowerCase().includes("no credits") || detail.includes("429")) {
    return "The coach cannot answer right now because the OpenAI account has no credits left.";
  }
  if (status === 404) {
    return "The coach could not be found. Start the API, then try again.";
  }
  if (status >= 500 || status === 0) {
    return "The coach ran into a problem answering. Please try again in a moment.";
  }
  if (detail.trim() !== "") {
    return detail;
  }
  return "The coach could not answer just now. Please try again in a moment.";
}

/**
 * Ask the coach. Network and server failures become short sentences
 * the studio can show; raw provider errors stay off the page.
 */
export async function requestCoachReply(
  message: string,
  prior: PriorTurn[] = [],
): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: composeCoachMessage(message, prior) }),
    });
  } catch {
    throw new Error(
      "Could not reach the coach. From the project root, run `uv run uvicorn api.index:app --reload`, then try again.",
    );
  }

  let payload: ChatPayload = {};
  try {
    payload = (await response.json()) as ChatPayload;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const detail = typeof payload.detail === "string" ? payload.detail : "";
    throw new Error(readableError(response.status, detail));
  }

  if (typeof payload.reply !== "string" || payload.reply.trim() === "") {
    throw new Error("The coach sent an empty reply. Please try again.");
  }

  return payload.reply.trim();
}
