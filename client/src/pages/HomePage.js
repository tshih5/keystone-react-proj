import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  withRouter,
  Link,
} from "react-router-dom";
import logo from './../img/home_main.png';
import vertBtn1 from './../img/vertical_button_1.png';
import vertBtn2 from './../img/vertical_button_2.png';

function HomePage() {
  return (
    <div>
      <div className="home-banner-1">
        <Container>
          <Row>
            <Col xl={{span: 10, offset: 1}} lg={12}>
              <img src={logo} className="main-img img-fluid"/>
            </Col>
          </Row>
        </Container>
        
      </div>
      <div className="home-banner-2">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center banner-title">石頭種類</h1>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col className="text-center">
              <div>
                <Link to={`/products/壽山石`}>
                  <img className="button-img" src={vertBtn2} />
                  <button className="button-vertical">壽<br/>山<br/>石</button>
                </Link>
              </div>
            </Col>
            <Col className="text-center">
              <div>
                <Link to={`/products/和田玉`}>
                  <img className="button-img" src={vertBtn1} />
                  <button className="button-vertical">和<br/>田<br/>玉</button>
                </Link>
              </div>
            </Col>
            <Col className="text-center">
              <a href="https://www.google.com">
                <div>
                  <div className="button-img">
                    <img className="testing" src={vertBtn1}/>
                  </div>
                  <div className="fake-button"> 
                    T<br/>
                    E<br/>
                    S<br/>
                    T<br/>
                  </div>
                </div>
              </a>
            </Col>
          </Row>
        </Container>
        {/* 
        <Link to={`/products/翡翠`}>
          <button className="ButtonProduct3">翡翠</button>
        </Link>
        <Link to={`/products/`}>
          <button className="ButtonProduct4">product example 4</button>
        </Link>
        */}
      </div>
      <div className="home-banner-3">
        <div className="text-center">
          <h2>mission statement/blog post</h2>
        </div>
          <div className="customerStory">
            <h6>"Wow this is a really great stone i would 10/10 buy"</h6>
          </div>
          <div className="story-button">
            <Link to={`/stories/General`}>{/*Change this to first category tag*/}
              <button className="ButtonProduct3">view more stories</button>
            </Link>
          </div>
      </div>
    </div>
    
  );
}

export default withRouter(HomePage);