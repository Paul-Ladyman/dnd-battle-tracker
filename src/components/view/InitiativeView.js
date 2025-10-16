import React from 'react';
import Footer from '../page/footer/Footer';
import { addCreature } from '../../state/CreatureListManager';
import CreateCreatureForm from '../page/create-creature-form/CreateCreatureForm';
import Creatures from '../page/Creatures';
import Welcome from '../page/Welcome';

export default function InitiativeView({
  updateBattle,
  creaturesRef,
  creatures,
  activeCreatureId,
  errorCreatureId,
  focusedCreature,
  round,
  secondsElapsed,
  creatureManagement,
}) {
  return (
    <>
      <main className="main">
        <CreateCreatureForm
          createCreature={updateBattle(addCreature)}
        />
        {creatures.length === 0 && <Welcome />}
        {creatures.length > 0 && (
          <Creatures
            ref={creaturesRef}
            creatures={creatures}
            activeCreatureId={activeCreatureId}
            errorCreatureId={errorCreatureId}
            focusedCreature={focusedCreature}
            round={round}
            secondsElapsed={secondsElapsed}
            creatureManagement={creatureManagement}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
