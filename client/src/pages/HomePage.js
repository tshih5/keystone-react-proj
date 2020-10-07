import React from "react";
import "../App.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  withRouter,
  Link,
} from "react-router-dom";
import logo from './../img/home_main.png';
import vertBtn1 from './../img/vertical_button_1.png';
import vertBtn2 from './../img/vertical_button_2.png';
import vertBtn3 from './../img/vertical_button_3.png';
import mainStory from './../img/main_story.png';

//3 section homepage

function HomePage() {
  return (
    <div>
      <div className="home-banner-1">
        <Container>
          <Row>
            <Col xl={{span: 10, offset: 1}} lg={12}>
              <img src={logo} className="main-img img-fluid" alt="logo"/>
            </Col>
          </Row>
        </Container>
        
      </div>
      <div className="home-banner-2">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center banner-title ">收藏種類</h1>
            </Col>
          </Row>
          <Row>
            <Col className="text-center" sm={6} lg={4}>
              <div>
                <Link to={`/products/壽山石`}>
                  <img className="button-img" src={vertBtn2} alt="stone button"/>
                  <button className="button-vertical ">壽<br/>山<br/>石</button>
                </Link>
              </div>
            </Col>
            <Col className="text-center" sm={6} lg={4}>
              <div>
                <Link to={`/products/和田玉`}>
                  <img className="button-img" src={vertBtn1} alt="stone button"/>
                  <button className="button-vertical ">和<br/>田<br/>玉</button>
                </Link>
              </div>
            </Col>
            <Col className="text-center" sm={12} lg={3}>
              <div>
                <Link to={`/products/其它(樣品)`}>
                  <img className="button-img" src={vertBtn3} alt="stone button"/>
                  <button className="button-vertical ">其<br/>它</button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="home-banner-3">
        <Container>
          <Row>
            <Col className="text-center banner-title">
              <h1>趣聞雜談</h1>
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} className="text-center">
              <img className="img-fluid main-story-img" src={mainStory} alt=" Some stone display"/>
            </Col>
            <Col lg={6} sm={12}>
              <div className="shortStory">
                <p>小小收藏，方寸間內藏乾坤萬千，鑒賞是一種風格，收藏是一種態度，路要自已親自領略。
                  這裡分享了有關國石的藝術、濟先齋相關的點點滴滴，期望和各位朋友結緣、共同參與印石和國石文化。
                  在鑒賞、分享、藝術與收藏之中，希望各界能在這裡得到最大尋石樂趣。
                </p>
              </div>
              <div >
                <Link to={`/stories/壽山石學`}>{/*Change this to first category tag*/}
                  <Button variant="dark" className="story-button">更多故事</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
    
  );
}

export default withRouter(HomePage);