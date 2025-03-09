import { useEffect } from 'react';

export default function useAutoSaveLoad({
  state,
  setState,
  name
}) {
  console.log('>>> useAutoSaveLoad', name)
  
  // useEffect(() => {
  //   const previousBattle = window.localStorage.getItem('battle');
  //   if (previousBattle) {
  //     console.log('>>> LOAD BATTLE', name, previousBattle, typeof previousBattle);
  //     setState(JSON.parse(previousBattle));
  //   }
  // }, []);

  useEffect(() => {
    const { creatures } = state;
    if (creatures.length > 0) {
      console.log('>>> SAVE BATTLE', name, state);
      window.localStorage.setItem('battle', JSON.stringify(state));
    } else {
      console.log('>>> RESET BATTLE', name);
      window.localStorage.removeItem('battle');
    }
  }, [state]);
}
