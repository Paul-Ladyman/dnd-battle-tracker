import React, { useEffect, useRef } from 'react';

function creatureDescription(creatures) {
  const names = creatures.map(({ name }) => name).filter(Boolean);
  if (names.length === 0) return 'No creatures';

  const visibleNames = names.slice(0, 3).join(', ');
  const remaining = names.length - 3;
  return remaining > 0 ? `${visibleNames} +${remaining}` : visibleNames;
}

export default function RecentBattlesDialog({
  show,
  battles,
  onClose,
  onRestore,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (show) dialogRef.current?.querySelector('button')?.focus();
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const buttons = Array.from(
        dialogRef.current?.querySelectorAll('button') || [],
      );
      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];

      if (!firstButton || !lastButton) return;

      if (event.shiftKey && event.target === firstButton) {
        event.preventDefault();
        lastButton.focus();
      } else if (!event.shiftKey && event.target === lastButton) {
        event.preventDefault();
        firstButton.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div className="alert-dialog--background" />
      <div
        role="dialog"
        className="alert-dialog recent-battles-dialog"
        aria-modal="true"
        aria-labelledby="recent-battles-title"
        aria-describedby="recent-battles-description"
        ref={dialogRef}
      >
        <h2 id="recent-battles-title" className="alert-dialog--header">Recent battles</h2>
        <p id="recent-battles-description">
          Stored only in this browser. Restoring a battle keeps the current player sharing session.
        </p>
        <ul className="recent-battles">
          {battles.map((snapshot) => {
            const { savedAt, state } = snapshot;
            const creatures = state.creatures || [];
            const count = creatures.length;
            const countLabel = `${count} ${count === 1 ? 'creature' : 'creatures'}`;
            const description = creatureDescription(creatures);
            const creatureLabel = `${countLabel}: ${description}`;

            return (
              <li className="recent-battles--item" key={savedAt}>
                <div className="recent-battles--details">
                  <strong>{new Date(savedAt).toLocaleString()}</strong>
                  <span className="recent-battles--creatures">
                    {creatureLabel}
                  </span>
                </div>
                <button
                  type="button"
                  className="recent-battles--restore"
                  aria-label={`Restore battle with ${creatureLabel}`}
                  onClick={() => onRestore(snapshot)}
                >
                  Restore
                </button>
              </li>
            );
          })}
        </ul>
        <div className="alert-dialog--buttons">
          <button
            type="button"
            className="alert-dialog--button"
            aria-label="Close recent battles"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
