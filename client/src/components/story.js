import React from "react";

function createMarkup(props){
  return {__html: props.story_content};
}

export default function Story(props) {
  return(
    <>
      <img src={props.main_image} />
      <h3 className="list-group-item-heading">{props.title}</h3>
      {/*currently displays serialized Slate.js structure, needs to be changed*/}
    </>
  );
}