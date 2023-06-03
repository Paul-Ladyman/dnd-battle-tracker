import React from 'react';
import { CreatureMenuButton, CreatureMenuToolMenu } from './creatureMenu';
import StatusButton from './status';
import { InitiativeButton, InitiativeToolMenu } from './initiative';
import ConditionsButton from './conditions';
import { NotesButton, NotesToolMenu } from './notes';
import { HpButton, HpToolMenu } from './hp';

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
      ToolMenu: HpToolMenu,
      ref: React.createRef(),
      key: (id) => `${id}-hp`,
    },
    {
      Button: InitiativeButton,
      ToolMenu: InitiativeToolMenu,
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
      ToolMenu: NotesToolMenu,
      ref: React.createRef(),
      key: (id) => `${id}-notes`,
    },
  ];
}
