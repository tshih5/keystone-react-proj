import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";

export default function HomePage() {
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
        <button /*onClick*/>product example 1</button>
        <button>product example 2</button>
        <button>product example 3</button>
        <button>product example 4</button>

      </div>
      <div className="home-banner-3">
        <h2>mission statement/blog post</h2>

      </div>
    </div>
    
  );
}