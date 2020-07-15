import React from "react";
import { Card } from "react-bootstrap";

export default function Story(props) {
  return(
    <div key={props.title}>
      <h4 className="list-group-item-heading">{props.title}</h4>
      <p className="list-group-item-text">{props.content}</p>
    </div>
  );
}