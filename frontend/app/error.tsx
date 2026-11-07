"use client";

/**
 * Shown when the studio itself fails to render. Chat request failures
 * stay inside the conversation panel so the page does not unmount.
 */
export default function StudioError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="studio">
      <section className="sheet" role="alert">
        <header className="masthead">
          <div className="masthead-copy">
            <p className="eyebrow">Scientific atelier</p>
            <h1>The studio hit a snag</h1>
            <p className="lede">
              The conversation could not be shown. Your messages were not saved.
              Try opening the studio again.
            </p>
          </div>
        </header>
        <div className="composer-bar">
          <button type="button" className="send" onClick={reset}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}
