import React from "react";
import {Button, Jumbotron} from 'react-bootstrap';
import {
  Link,
  useRouteMatch,
  withRouter,
} from "react-router-dom";

//story preview component used in the story page
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