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
    <Card className="card-child" border="dark">
      <Card.Img variant="top" src={props.thumbnail == null ? 'http://placehold.jp/150x100.png': `http://localhost:3000/images/${props.thumbnail.filename}`} />
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