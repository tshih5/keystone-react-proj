import React from "react";

function createMarkup(props){
  return {__html: props.content_test};
}

export default function Story(props) {
  return(
    <>
      <h1 className="list-group-item-heading">{props.title}</h1>
      <div dangerouslySetInnerHTML={createMarkup(props)} />
      {/*currently displays serialized Slate.js structure, needs to be changed*/}
    </>
  );
}