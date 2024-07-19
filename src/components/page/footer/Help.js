import React from 'react';
import Disclosure from '../../widgets/Disclosure';
import Shortcuts from './Shortcuts';
import Info from './Info';

export default function Help({ playerSession }) {
  return (
    <dl>
      <Disclosure id="keyboard-shortcuts" name="Keyboard shortcuts">
        <Shortcuts playerSession={playerSession} />
      </Disclosure>
      <Disclosure id="info" name="Info">
        <Info />
      </Disclosure>
    </dl>
  );
}
