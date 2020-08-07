import React, { useState, useEffect } from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function StoryDisplay(props) {
  let storyID = props.match.params.storyid;
  const [storyData, setStoryData] = useState([]);
  console.log(storyData)
  return (
    <Container fluid={true}>
    <Row xl={3} md={3} sm={1}>
      <Col xl={8} md={7} sm={12}>
        <GetStoryData storyID={storyID} setStoryData={setStoryData} />
        <h2>{storyData.title}</h2>
        <img src={storyData.main_image} />
        <h3>Date Published: {storyData.date_published}</h3>
      </Col>
      <Col xl={1} md={1} sm={12}></Col>
      <Col xl={3} md={4} sm={12}>COLUMN 2</Col>
    </Row>
  </Container>
  );
}

function GetStoryData({storyID, setStoryData}){
  const { loading, error, data } = useQuery(gql`
    {
      allStories(where:{id:"${storyID}"}){
        title
        category{
          topic
        }
        date_published
        story_content
        main_image
      }
    }
  `);

  useEffect(() => {
    if(loading === false && data){
      setStoryData(data.allStories[0]);
    }
  }, [data]);

  if(error) return <p>Error :(</p>
  return null;
}

export default withRouter(StoryDisplay);