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
    <Card border="dark" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={`./../public/${props.id}_m.webp`} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>Price: {props.price_in_usd}
          <br /> 
          Sub-category: {props.sub_category.name}
        </Card.Text>
        <Link to={`${match.url}/${props.id}`}>
          <Button>View Item</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default withRouter(Product);