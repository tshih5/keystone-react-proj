import React from "react";
import {Button} from 'react-bootstrap';
import {
  Link,
  useRouteMatch,
  withRouter,
} from "react-router-dom";

function Story(props) {
  let match = useRouteMatch();
  return(
    <>
      <img src={props.main_image == null ? 'http://placehold.jp/600x350.png': `http://localhost:3000/images/${props.main_image.filename}`} />
      <h3 className="list-group-item-heading">{props.title}</h3>
      <Link to={`${match.url}/${props.id}`}>
        <Button>View Story</Button>
      </Link>
    </>
  );
}

export default withRouter(Story);