"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { messageLimit, requestCoachReply } from "@/lib/chat";

type Speaker = "visitor" | "coach";

type Turn = {
  id: string;
  speaker: Speaker;
  text: string;
};

const STARTERS = [
  "I feel stuck and I am not sure where to begin.",
  "Help me start one small habit this week.",
  "I could use a steadier kind of confidence.",
  "Talk me through a stressful day without judging it.",
];

/**
 * The conversation studio. Messages live only in this tab:
 * a mental-coach chat should not be written to local storage.
 */
export default function ChatStudio() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const limit = messageLimit();
  const remaining = limit - draft.length;
  const showCount = draft.length > limit - 400;

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) {
      return;
    }
    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  }, [turns, pending, error]);

  async function ask(text: string) {
    const message = text.trim();
    if (!message || pending) {
      return;
    }

    if (message.length > limit) {
      setError(`Keep the message under ${limit} characters.`);
      return;
    }

    const visitorTurn: Turn = {
      id: crypto.randomUUID(),
      speaker: "visitor",
      text: message,
    };

    setTurns((current) => [...current, visitorTurn]);
    setDraft("");
    setError(null);
    setPending(true);

    try {
      const reply = await requestCoachReply(
        message,
        turns.map((turn) => ({ speaker: turn.speaker, text: turn.text })),
      );
      setTurns((current) => [
        ...current,
        { id: crypto.randomUUID(), speaker: "coach", text: reply },
      ]);
    } catch (caught) {
      const description =
        caught instanceof Error
          ? caught.message
          : "The coach could not answer just now. Please try again in a moment.";
      // Drop the unsent turn so a retry does not show the same message twice.
      setTurns((current) => current.filter((turn) => turn.id !== visitorTurn.id));
      setError(description);
      setDraft(message);
    } finally {
      setPending(false);
      fieldRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(draft);
  }

  function onClear() {
    if (pending) {
      return;
    }
    setTurns([]);
    setError(null);
    setDraft("");
    fieldRef.current?.focus();
  }

  return (
    <section className="sheet" aria-labelledby="studio-title">
      <header className="masthead">
        <div className="mark" aria-hidden="true">
          <span />
        </div>
        <div className="masthead-copy">
          <p className="eyebrow">Scientific atelier</p>
          <h1 id="studio-title">A quiet room for a supportive coach</h1>
          <p className="lede">
            Share what is on your mind. The coach answers with encouragement,
            a next step, and room to think. This conversation stays in this tab.
          </p>
        </div>
      </header>

      <div
        className="thread"
        ref={threadRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation with the coach"
      >
        {turns.length === 0 ? (
          <div className="welcome">
            <p>Try one of these, or write your own.</p>
            <div className="starters">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  className="starter"
                  disabled={pending}
                  onClick={() => {
                    void ask(starter);
                  }}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ol className="turns">
            {turns.map((turn) => (
              <li key={turn.id} className={`turn turn-${turn.speaker}`}>
                <span className="speaker">
                  {turn.speaker === "coach" ? "Coach" : "You"}
                </span>
                <p>{turn.text}</p>
              </li>
            ))}
          </ol>
        )}

        {pending ? (
          <p className="status" role="status">
            <span className="pulse" aria-hidden="true" />
            The coach is thinking
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="composer" onSubmit={onSubmit}>
        <label htmlFor={fieldId}>Message to your coach</label>
        <textarea
          id={fieldId}
          ref={fieldRef}
          value={draft}
          maxLength={limit}
          rows={3}
          placeholder="What would you like to work through?"
          disabled={pending}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void ask(draft);
            }
          }}
        />
        <div className="composer-bar">
          <p className="hint">
            Enter sends. Shift+Enter starts a new line.
            {showCount ? ` ${remaining} characters left.` : ""}
          </p>
          <div className="actions">
            <button
              type="button"
              className="ghost"
              onClick={onClear}
              disabled={pending || (turns.length === 0 && draft.length === 0)}
            >
              Clear
            </button>
            <button type="submit" className="send" disabled={pending || draft.trim() === ""}>
              {pending ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      </form>

      <p className="care">
        This is a reflective coach, not a clinician. If you are in crisis,
        contact local emergency services or call or text 988.
      </p>
    </section>
  );
}
