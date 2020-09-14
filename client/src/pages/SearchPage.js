import React from "react";
import { Spinner, Container, Row, Col, ListGroup} from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Story from "./../components/story";
import {
  Link,
  withRouter,
} from "react-router-dom";

//displays story previews in a vertical list
function SearchPage(props) {
  return (
    <Container className="story-container" fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="story-header">
              <h1>Searchy Search</h1>
              <h2>{props.location.search}</h2>
          </div>
          <Container>
              
          </Container>
        </Col>
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <div className="category-list chinese-text">
            <h3>lol</h3>
          </div>
        </Col>
      </Row>
    </Container>
    
  );
}

//renders a story preview with an image and title; only displayes published stories
function RenderStories(props){
  //console.log(props.match.params.topic);
  const { loading, error, data } = useQuery(gql`
    query($topic: String!){
      allStories(where:{category:{topic: $topic}}){
        title
        id
        status
        main_image{
          publicUrl
        }
      }
    }
  `,{variables:{topic: props.match.params.topic}});

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>{error.message}</p>;

  console.log(data);

  if(data.allStories[0] && !loading){
    return data.allStories.filter((props) => props.status === "Published").map((props) => (
      <div key={props.id}>
        <Story {...props} />
      </div>
    ));
  }else{
    return <p>Theres nothing here right now; Please check back later.</p>
  }
  
}

export default withRouter(SearchPage);