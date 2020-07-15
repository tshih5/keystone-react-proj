import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Product(props) {
  console.log();
  return(
    <div key={props.name}>
      <h3 className="list-group-item-heading">{props.name}</h3>
      <h4 className="list-group-item-origin">{props.origin}</h4>
      <p className="list-group-item-text">{props.price}</p>
    </div>
  );
}