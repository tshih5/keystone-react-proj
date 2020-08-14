import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Story from "./../components/story";
import {
  withRouter,
} from "react-router-dom";

function StoryPage(props) {
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="header"><h1>{props.match.params.topic}</h1></div>
          <RenderStories {...props}/>
        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col xl={3} md={4} sm={12}>COLUMN 2</Col>
      </Row>
    </Container>
    
  );
}

function RenderStories(props){
  //console.log(props.match.params.topic);
  const { loading, error, data } = useQuery(gql`
    {
      allStories(where:{category:{topic: "${props.match.params.topic}"}}){
        title
        id
        status
        main_image{
          filename
        }
      }
    }
  `);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>{error.message}</p>;

  console.log(data);

  return data.allStories.filter((props) => props.status == "Published").map((props) => (
    <div className="story-preview" key={props.id}>
      <Story {...props} />
    </div>
  ));
}

export default withRouter(StoryPage);