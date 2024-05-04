import React from 'react';
import TabList from '../../../../widgets/TabList';
import { maxSpellSlots } from '../../../../../domain/spellcasting';
import SpellSlotGrid from './SpellSlotGrid';
import SpellList from './SpellList';

export default function SpellcastingTool({
  creatureId,
  creatureName,
  toolMenuId,
  totalSpellSlots,
  addTotalSpellSlots,
  usedSpellSlots,
  addUsedSpellSlots,
  addSpell,
  addSpellTotalUses,
  addSpellUses,
  spells,
}) {
  const tabs = [
    {
      label: 'Used slots',
      id: 'used-slots',
    },
    {
      label: 'Total slots',
      id: 'total-slots',
    },
    {
      label: 'Used spells',
      id: 'used-spells',
    },
    {
      label: 'Total spells',
      id: 'total-spells',
    },
  ];
  const panels = [
    <SpellSlotGrid
      id="used"
      creatureId={creatureId}
      defaultValue="0"
      values={usedSpellSlots}
      defaultMaxValues={maxSpellSlots}
      maxValues={totalSpellSlots}
      addSpellSlots={addUsedSpellSlots}
      displayMaxExceeded
    />,
    <SpellSlotGrid
      id="total"
      creatureId={creatureId}
      defaultValue=""
      values={totalSpellSlots}
      defaultMaxValues={maxSpellSlots}
      maxValues={maxSpellSlots}
      addSpellSlots={addTotalSpellSlots}
    />,
    <SpellList
      id="used"
      creatureId={creatureId}
      creatureName={creatureName}
      spells={spells}
      spellProperty="used"
      addSpell={addSpell}
      defaultValue="0"
      useSpellMax
      onSpellChange={addSpellUses}
      displayMaxExceeded
    />,
    <SpellList
      id="total"
      creatureId={creatureId}
      creatureName={creatureName}
      spells={spells}
      spellProperty="total"
      addSpell={addSpell}
      defaultValue=""
      onSpellChange={addSpellTotalUses}
    />,
  ];
  const labelledBy = `${toolMenuId}-spellcasting`;
  const id = `${toolMenuId}-spellcasting-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} panels={panels} id={id} customClasses="spellcasting-container" />
  );
}
