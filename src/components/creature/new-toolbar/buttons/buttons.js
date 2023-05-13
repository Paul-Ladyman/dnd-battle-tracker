import React from 'react';
import { CreatureMenuButton, CreatureMenuToolMenu } from './creatureMenu';
import StatusButton from './status';
import InitiativeButton from './initiative';
import ConditionsButton from './conditions';
import NotesButton from './notes';
import HpButton from './hp';

export default function getButtons() {
  return [
    {
      Button: CreatureMenuButton,
      ToolMenu: CreatureMenuToolMenu,
      ref: React.createRef(),
      key: (id) => `${id}-menu`,
    },
    {
      Button: StatusButton,
      ref: React.createRef(),
      key: (id) => `${id}-kill`,
    },
    {
      Button: HpButton,
      ref: React.createRef(),
      key: (id) => `${id}-hp`,
    },
    {
      Button: InitiativeButton,
      ref: React.createRef(),
      key: (id) => `${id}-initiative`,
    },
    {
      Button: ConditionsButton,
      ref: React.createRef(),
      key: (id) => `${id}-conditions`,
    },
    {
      Button: NotesButton,
      ref: React.createRef(),
      key: (id) => `${id}-notes`,
    },
  ];
}
