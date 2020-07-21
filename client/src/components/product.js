import React from "react";
import { Card } from "react-bootstrap";

export default function Product(props) {
  console.log();
  return(
    <Card style={{ width: '12rem' }}>
      <Card.Img variant="top" src="https://via.placeholder.com/200x200" />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>${props.price_in_usd}</Card.Text>
      </Card.Body>
    </Card>
    
  );
}