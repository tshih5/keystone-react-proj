import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  withRouter,
  Link,
} from "react-router-dom";

function HomePage() {
  return (
    <div>
      <div className="home-banner-1">
      <Container>
        <Row>
          <Col>
            <div className="home-text text-center">
              <h1>HOME</h1>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
      <div className="home-banner-2">
        <h2>Popular Stones</h2>
        <Link to={`/products/壽山石`}>
          <button className="ButtonProduct1">壽山石</button>
        </Link>
        <Link to={`/products/和田玉`}>
          <button className="ButtonProduct2">和田玉</button>
        </Link>
        <Link to={`/products/翡翠`}>
          <button className="ButtonProduct3">翡翠</button>
        </Link>
        <Link to={`/products/`}>
          <button className="ButtonProduct4">product example 4</button>
        </Link>

      </div>
      <div className="home-banner-3">
        <h2>mission statement/blog post</h2>
          <div className="customerStory">
            <h6>"Wow this is a really great stone i would 10/10 buy"</h6>
          </div>
      </div>
    </div>
    
  );
}

export default withRouter(HomePage);