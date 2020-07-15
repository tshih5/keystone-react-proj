import React from "react";
import { Card } from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Product(props) {
  console.log();
  return(
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="https://via.placeholder.com/286x180" />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Subtitle>{props.origin}</Card.Subtitle>
        <Card.Text>${props.price_in_usd}</Card.Text>
      </Card.Body>
    </Card>
    
  );
}