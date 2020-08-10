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
      <img src={props.main_image} />
      <h3 className="list-group-item-heading">{props.title}</h3>
      <Link to={`${match.url}/${props.id}`}>
        <Button>View Story</Button>
      </Link>
      {/*currently displays serialized Slate.js structure, needs to be changed*/}
    </>
  );
}

export default withRouter(Story);