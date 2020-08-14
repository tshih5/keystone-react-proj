import React from "react";
import {Button, Jumbotron, Container} from 'react-bootstrap';
import {
  Link,
  useRouteMatch,
  withRouter,
} from "react-router-dom";

function Story(props) {
  let match = useRouteMatch();
  return(
    <Jumbotron fluid>
      <Container>
        <img src={props.main_image == null ? 'http://placehold.jp/600x350.png': `http://localhost:3000/images/${props.main_image.filename}`} class="img-fluid"/>
        {/*TODO: Scale image such that it does not extend outside the bounds of the jumbotron */}
        <h3 className="list-group-item-heading">{props.title}</h3>
        <Link to={`${match.url}/${props.id}`}>
          <Button>View Story</Button>
        </Link>
      </Container>
    </Jumbotron>
  );
}

export default withRouter(Story);