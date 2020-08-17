import React from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  withRouter,
  Link,
} from "react-router-dom";
import logo from './../img/home_main.png'

function HomePage() {
  return (
    <div>
      <div className="home-banner-1">
        <img src={logo} className="center"/>
      </div>
      <div className="home-banner-2">
        <h2>石頭種類</h2>
        <Link to={`/products/壽山石`}>
          <button className="ButtonProduct1">壽山石</button>
        </Link>
        <Link to={`/products/和田玉`}>
          <button className="ButtonProduct2">和田玉</button>
        </Link>
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
        <h2>mission statement/blog post</h2>
          <div className="customerStory">
            <h6>"Wow this is a really great stone i would 10/10 buy"</h6>
          </div>
          <div className="story-button">
            <Link to={`/stories/General`}>
              <button className="ButtonProduct3">view more stories</button>
            </Link>
          </div>
      </div>
    </div>
    
  );
}

export default withRouter(HomePage);