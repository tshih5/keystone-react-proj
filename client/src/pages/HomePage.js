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

      </div>
      <div className="home-banner-3">

      </div>
    </div>
    
  );
}