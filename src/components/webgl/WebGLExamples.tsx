import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import "./WebGLExamples.scss";

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
    <div className="webgl-examples">
      <h1>WebGL Examples</h1>
      { loading && <p>Loading..</p> }
      { error && <p>Error..</p> }
      <ul>
        { data && data.webglExamples.map(({
          id, identifier, name
        } : {
          id: string, identifier: string,
          name: string
        }) => (
          <li key={id}>
            <Link to={`/webgl/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WebGLExamples;