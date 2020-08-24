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
    <Jumbotron className="story-preview">
        {props.main_image ? (<img className="img-fluid" src={`http://localhost:3000/images/${props.main_image.filename}`}  alt=""/>) : ''}
        <h3 className="list-group-item-heading">{props.title}</h3>
        <Link to={`${match.url}/${props.id}`}>
          <Button>View Story</Button>
        </Link>
    </Jumbotron>
  );
}

export default withRouter(Story);