import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Story from "./../components/story";

export default function StoryPage() {
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="header"><h1>TAGNAME</h1></div>
          <RenderStories />
        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col xl={3} md={4} sm={12}>COLUMN 2</Col>
      </Row>
    </Container>
    
  );
}

function RenderStories(){
  const { loading, error, data } = useQuery(gql`
    {
      allStories{
        title
        main_image
        id
      }
    }
  `);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allStories.map((props) => (
    <div key={props.id}>
      <Story {...props} />
    </div>
  ));
}