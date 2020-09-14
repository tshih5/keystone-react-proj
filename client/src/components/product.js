import React from "react";
import {Card, Button} from "react-bootstrap";
import {
  Link,
  useRouteMatch,
  withRouter,
} from "react-router-dom";

//product preview card used in product page
function Product(props) {
  let match = useRouteMatch();
  return(
    <Card className="card-child" border="dark">
      <Card.Img variant="top" src={props.thumbnail == null ? 'http://placehold.jp/150x100.png': `${props.thumbnail.publicUrl}`} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
      </Card.Body>
      <Card.Footer className="text-center">
        <Link to={`${match.url}/${props.id}`}>
          <Button variant="dark" block>View Item</Button>
        </Link>
      </Card.Footer>
    </Card>
  );
}

export default withRouter(Product);