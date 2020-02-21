import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from "react-router-dom";

const WebGLExamples = () => {

  const GET_WEBGL_EXAMPLES = gql`
    {
      webglExamples(last: null) {
        id
        identifier
        name
        description
        publicPath
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_WEBGL_EXAMPLES);

  return (
    <div>
      { loading && <p>Loading..</p> }
      { error && <p>Error..</p> }
      { data && data.webglExamples.map(({
        id, identifier, name
      } : {
        id: string, identifier: string,
        name: string
      }) => (
        <p key={id}>
          <Link to={`/webgl/${id}`}>{name}</Link>
        </p>
      ))}
    </div>
  )
}

export default WebGLExamples;