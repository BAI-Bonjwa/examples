import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USER_INFO = gql`
  {
    users(last: null) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const Games = () => {
  const { loading, error, data } = useQuery(GET_USER_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="games">
      <h1 className="brightred">Games</h1>
    </div>
  );
}

export default Games;
