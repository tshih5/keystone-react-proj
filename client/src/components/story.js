import React from "react";


export default function Story(props) {
  return(
    <>
      <h4 className="list-group-item-heading">{props.title}</h4>
      <p className="list-group-item-text">{props.story_content.document}</p>
      {/*currently displays serialized Slate.js structure, needs to be changed*/}
    </>
  );
}