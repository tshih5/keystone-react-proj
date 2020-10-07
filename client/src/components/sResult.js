import React from "react";
import {Button, Jumbotron} from 'react-bootstrap';
import {
  Link,
  withRouter,
} from "react-router-dom";

//Result preview on search page
function SearchResult(props) {
  //console.log(props);
  if(props.prod){
    return(
      <Jumbotron className="story-preview">
          {props.prod.main_image ? (<img className="img-fluid" src={`${props.prod.main_image.publicUrl}`}  alt="product main"/>) : ''}
          <h5 className="list-group-story-heading">{props.prod.name}</h5>
          <Link to={`/products/display/${props.prod.id}`}>
            <Button variant="dark" className="sp-button">閱讀更多</Button>
          </Link>
      </Jumbotron>
    );
  }else if(props.story){
    return(
      <Jumbotron className="story-preview">
          {props.story.main_image ? (<img className="img-fluid" src={`${props.story.main_image.publicUrl}`}  alt="story main"/>) : ''}
          <h5 className="list-group-story-heading">{props.story.title}</h5>
          <Link to={`/stories/display/${props.story.id}`}>
            <Button variant="dark" className="sp-button">閱讀更多</Button>
          </Link>
      </Jumbotron>
    );
  }
  
}

export default withRouter(SearchResult);