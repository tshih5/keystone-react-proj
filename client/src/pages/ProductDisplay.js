import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";

function ProductDisplay(props) {
  return (
    <div>
      <h1>Hello from Product Display</h1>
      <p>ProductID: {props.match.params.productid}</p>
    </div>
  );
}
export default withRouter(ProductDisplay);