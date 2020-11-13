import { useSubscription, gql } from '@apollo/client';
import React from 'react';

const GET_BATTLE = gql`
subscription GetBattle($battleId: String!) {
  onCreateDndbattletracker(battleId: $battleId) {
    id: battleId
  }
}
`;

function ExchangeRates({ battleId }) {
  console.log('>>> rendering battle', battleId);
  const { loading, error, data } = useSubscription(GET_BATTLE, {
    variables: { battleId }
  });

  console.log(loading, error, data);
  if (loading) return <p>Loading...</p>;
  console.log(error);
  if (error) return <p>Error :(</p>;

  return (
      <div><h2>BATTLES {battleId}</h2>{JSON.stringify(data.getDndbattletracker)}</div>
  );
}

export default ExchangeRates;