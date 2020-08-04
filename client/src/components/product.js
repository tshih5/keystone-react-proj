import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  Link,
  useRouteMatch,
  withRouter,
} from "react-router-dom";

function Product(props) {
  let match = useRouteMatch();
  return(
    <Card style={{ width: '12rem' }}>
      <Card.Img variant="top" src="https://via.placeholder.com/200x200" />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>{props.price_in_usd}</Card.Text>
        <Card.Text>Sub-category: {props.sub_category.name}</Card.Text>
        <Link to={`${match.url}/${props.id}`}>
          <Button>View Item</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default withRouter(Product);