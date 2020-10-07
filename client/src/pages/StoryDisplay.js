import React, { useState, useEffect } from "react";
import "../App.css";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

function StoryDisplay(props) {
  //const [storyID, setstoryID] = useState(props.match.params.storyid);
  const storyID = props.match.params.storyid;
  const { loading, error, data } = useQuery(STORY_QUERY,{variables: {sid: storyID}});

  return (
    <Container>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <DisplayStory data={data} loading={loading} error={error}/>
        </Col>
        {/*divider for second column */}
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <Container className="sticky-bar-right">
            <div className="category-list">
              <h4>趣聞雜談</h4>
              <ListGroup variant="flush">
                <StoryCategoryList />
              </ListGroup>
            </div>
            <br />
            <br />
            <div>
              <h4>TAGS</h4>
              <DisplayTags data={data} loading={loading} error={error} />
            </div>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const STORY_QUERY = gql`
  query($sid: ID!){
    Story(where:{id: $sid}){
      status
      title
      category{
        topic
      }
      date_published
      story_content
      main_image{
        publicUrl
      }
      tags{
        name
      }
    }
  }`;

function DisplayStory(props){
  if(props.error) return <h1>Error: {props.error.message}</h1>;
  if(props.loading) return <h1>Loading...</h1>;
  if(props.data.Story.status !== "Published") return <h1>404: Page not found</h1>;

  if(props.data && !props.loading){
    const storyData = props.data.Story;
    return(
      <Container className="descriptions">
        <h1>{storyData.title}</h1>
        {storyData.main_image == null ? '': <img className="img-fluid" src={`${storyData.main_image.publicUrl}`} alt="story main" />}
        <p>Date Published: {storyData.date_published}</p>
        <div dangerouslySetInnerHTML={createMarkup(storyData.story_content)} />
      </Container>
    );
  }
  return null;
}

//graphql query for sidebar list
function StoryCategoryList(){
  const { loading, error, data } = useQuery(gql`
  query{
      allStoryCategories{
        topic
        id
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);

  return data.allStoryCategories.map((category) => (
    //TODO: if category name contains spaces/ starting/trailing spaces, trim value and replace spaces with a "-" or ""
    /*does not account for spaces in the category name, may cause URL issues */
    <ListGroup.Item key={category.id} as={Link} to={`/stories/${category.topic.trim().replace(/\s/g, '-')}`}>{category.topic}</ListGroup.Item>
  ));
}

//display tags as badges
function DisplayTags(props){
  if(props.error) return <p>Error: {props.error.message}</p>;
  if(props.loading) return <h5>Loading . . .</h5>;

  if(!isEmpty(props.data.Story.tags)){
    return props.data.Story.tags.map((tag) => (
      <Badge key={tag.name} className="tag" variant="info" as={Link} to={`/search/?t=${tag.name}`}>{tag.name}</Badge>
    ));
  }else{
    return <h5>None</h5>;
  }
}

function createMarkup(story_content){
  return {__html: story_content};
}

//check if obj is empty
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key)){
        return false;
      }
  }
  return true;
}

export default withRouter(StoryDisplay);