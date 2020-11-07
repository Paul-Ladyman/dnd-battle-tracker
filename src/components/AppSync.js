import { useQuery, gql } from '@apollo/client';
import React from 'react';

const GET_BATTLE = gql`
query GetBattle($battleId: String!) {
  getDndbattletracker(battleId: $battleId) {
    id: battleId
  }
}
`;

function ExchangeRates({ battleId }) {
  console.log('>>> rendering battle', battleId);
  const { loading, error, data } = useQuery(GET_BATTLE, {
    variables: { battleId },
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    console.log(data);
    return (
        <div><h2>BATTLES {battleId}</h2>{JSON.stringify(data.getDndbattletracker)}</div>
    );
}

export default ExchangeRates;