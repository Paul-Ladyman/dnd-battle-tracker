import { useSubscription, gql } from '@apollo/client';
import React from 'react';

const GET_BATTLE = gql`
subscription GetBattle($battleId: String!) {
  onCreateDndbattletracker(battleId: $battleId) {
    battleId
    creatureCount
  }
}
`;

function ExchangeRates({ battleId }) {
  console.log('>>> rendering battle', battleId);
  const { loading, error, data } = useSubscription(GET_BATTLE, {
    variables: { battleId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
    console.log(data);

  return (
      <div><h2>BATTLES {battleId}</h2>{JSON.stringify(data.onCreateDndbattletracker)}</div>
  );
}

export default ExchangeRates;