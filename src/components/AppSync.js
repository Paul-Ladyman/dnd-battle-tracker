import { useQuery, gql } from '@apollo/client';
import React from 'react';

const EXCHANGE_RATES = gql`
    query listDndbattletrackers {
      listDndbattletrackers {
        items {
          battleId
        }
      }
    }
`;

function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    console.log(data);
    return (
        <div><h2>BATTLES!</h2>{JSON.stringify(data.listDndbattletrackers.items)}</div>
    );
}

export default ExchangeRates;