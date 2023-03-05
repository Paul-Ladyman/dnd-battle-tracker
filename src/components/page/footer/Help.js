import React from 'react';
import Disclosure from '../../widgets/Disclosure';
import Shortcuts from './Shortcuts';
import Info from './Info';
import DmTips from './DmTips';

export default function Help({ playerSession }) {
  return (
    <dl>
      {!playerSession
        && (
        <Disclosure id="dm-tips" name="Dungeon Master tips">
          <DmTips />
        </Disclosure>
        )}
      <Disclosure id="keyboard-shortcuts" name="Keyboard shortcuts">
        <Shortcuts playerSession={playerSession} />
      </Disclosure>
      <Disclosure id="info" name="Info">
        <Info />
      </Disclosure>
    </dl>
  );
}
