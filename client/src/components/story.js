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
        {props.main_image ? (<img className="img-fluid" src={`${props.main_image.publicUrl}`}  alt="story image"/>) : ''}
        <h2 className="list-group-story-heading">{props.title}</h2>
        <Link to={`${match.url}/${props.id}`}>
          <Button className="sp-button">閱讀更多</Button>
        </Link>
    </Jumbotron>
  );
}

export default withRouter(Story);