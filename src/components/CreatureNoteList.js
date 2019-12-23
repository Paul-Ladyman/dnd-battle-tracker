import React from 'react';
import Timer from './Timer';
import ExternalLink from './ExternalLink';
import RemoveIcon from './icons/RemoveIcon';

function CreatureNoteList({
  creatureId,
  label,
  noteList,
  dismissHandler,
  round,
  secondsElapsed,
  className
}) {
  return (
    <React.Fragment>
      {/* <div className="creature-note-list--label">{label}</div> */}
      {/* <div className="creature-note-list"> */}
        {noteList.map((note, i) => {
          const noteText = note.url ?
            <b><ExternalLink url={note.url} text={note.text} /></b> :
            <span><b>{i+1}.</b> {`${note.text[0].toUpperCase()}${note.text.substring(1)}`}</span>;
          const lastClassName = i === noteList.length -1 ? 'creature-note-list--last' : '';

          const item =
            <div className={`creature-note-list--item ${lastClassName}`} key={i}>
                <div className="creature-note-list--note" >
                  {noteText}.
                  <Timer
                    startRound={note.appliedAtRound}
                    endRound={round}
                    startTime={note.appliedAtSeconds}
                    endTime={secondsElapsed}
                    className="creature-note-list--timer"
                  />
                </div>
              <button className="creature-note-list--button" title="Remove note" onClick={() => dismissHandler(creatureId, note)}>
                <RemoveIcon />
              </button>
            </div>;

          return i === 0 ?
            <div className="creature-note-list--first">
              {/* <div className="expanded-creature--separator" /> */}
              <div className="creature-note-list--label">{label}</div>
              {item}
            </div> :
            item;
        })}
      {/* </div> */}
    </React.Fragment>
  );
}

export default CreatureNoteList;