import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";

function ProductDisplay(props) {
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <h1>Hello from Product Display</h1>
          <p>ProductID: {props.match.params.productid}</p>
        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col xl={3} md={4} sm={12}>COLUMN 2</Col>
      </Row>
    </Container>
  );
}
export default withRouter(ProductDisplay);