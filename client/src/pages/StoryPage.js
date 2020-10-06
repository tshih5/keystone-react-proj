import React, { useState, useEffect }from "react";
import { Spinner, Container, Row, Col, ListGroup} from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Story from "./../components/story";
import {
  Link,
  withRouter,
} from "react-router-dom";

//displays story previews in a vertical list
function StoryPage(props) {
  const storyFilter = props.match.params.topic;
  const [stories, setStories] = useState([]);

  const { loading, error, data } = useQuery(STORY_QUERY, {variables: {topic: storyFilter}});

  useEffect(() => {
    if(loading === false && data){
      setStories(data.allStories);
    }
  }, [data, loading]);

  return (
    <Container>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <Container className="story-container">
            <div className="story-header">
              <h1>{props.match.params.topic.replace(/-/g, ' ')}</h1>
            </div>
            <RenderStories loading={loading} error={error} stories={stories}/>
          </Container>
        </Col>
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <Container className="sticky-bar-right">
            <div className="category-list chinese-text">
              <h4>趣聞雜談</h4>
              <ListGroup variant="flush">
                <StoryCategoryList />
              </ListGroup>
            </div>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const STORY_QUERY = gql`
  query($topic: String!){
    allStories(where:{category:{topic: $topic}, status: Published}){
      title
      id
      status
      main_image{
        publicUrl
      }
    }
  }`;

//renders a story preview with an image and title; only displayes published stories
function RenderStories(props){
  //console.log(props.match.params.topic);

  if (props.loading) return <Spinner animation="border" />;
  if (props.error) return <p>{props.error.message}</p>;
  //console.log("Story results length:", props.stories.length);

  if(props.stories[0] && !props.loading){
    return props.stories.map((props) => (
      <div key={props.id}>
        <Story {...props} />
      </div>
    ));
  }else{
    return <p>Theres nothing here right now; Please check back later.</p>
  }
  
}

//graphql query to get story categories for the dropdown buttons
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
export default withRouter(StoryPage);