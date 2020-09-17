import React, { useState, useEffect } from "react";
import "../App.css";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function StoryDisplay(props) {
  let storyID = props.match.params.storyid;
  const [storyData, setStoryData] = useState([]);
  console.log(storyData)
  return (
    <Container className="story-container">
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <Container className="descriptions">
            <GetStoryData storyID={storyID} setStoryData={setStoryData} />
            <h1>{storyData.title}</h1>
            {storyData.main_image == null ? '': <img className="img-fluid" src={`${storyData.main_image.publicUrl}`} alt="story main image" />}
            <p>Date Published: {storyData.date_published}</p>
            <div dangerouslySetInnerHTML={createMarkup(storyData.story_content)} />
          </Container>
        </Col>
        {/*divider for second column */}
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <Container>
            <div className="category-list">
              <h4>趣聞雜談</h4>
              <ListGroup variant="flush">
                <StoryCategoryList />
              </ListGroup>
            </div>
            <div className="tag-list">
              <h4>TAGS</h4>
              <DisplayTags tags={storyData.tags} />
            </div>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

function GetStoryData({storyID, setStoryData}){
  const { loading, error, data } = useQuery(gql`
    query($sid: ID!){
      Story(where:{id: $sid}){
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
          tag
        }
      }
    }
  `,{variables: {sid: storyID}});

  useEffect(() => {
    if(loading === false && data){
      setStoryData(data.Story);
    }
  }, [data]);

  if(error) return <p>Error :(</p>
  return null;
}

//graphql query 
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
    <ListGroup.Item eventKey={category.id} as={Link} to={`/stories/${category.topic.trim().replace(/\s/g, '-')}`}>{category.topic}</ListGroup.Item>
  ));
}

//display tags as badges
function DisplayTags(props){
  if(!isEmpty(props.tags)){
    return props.tags.map((tag) => (
        <Badge className="tag" variant="info">{tag.tag}</Badge>
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
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

export default withRouter(StoryDisplay);