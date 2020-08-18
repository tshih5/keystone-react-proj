import React from "react";
import { Spinner, Container, Row, Col, ListGroup} from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Story from "./../components/story";
import {
  Link,
  withRouter,
} from "react-router-dom";

function StoryPage(props) {
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="story-header text-center">
            <h1>{props.match.params.topic.replace(/-/g, ' ')}</h1>
          </div>
          <RenderStories {...props}/>
        </Col>
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col xl={3} md={4} sm={12}>
          <h3>趣聞雜談</h3>
          <ListGroup variant="flush">
            <StoryCategoryList />
          </ListGroup>
        </Col>
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

  return data.allStories.filter((props) => props.status === "Published").map((props) => (
    <div className="story-preview" key={props.id}>
      <Story {...props} />
    </div>
  ));
}

function StoryCategoryList(){
  const { loading, error, data } = useQuery(gql`
    {
      allStoryCategories{
        topic
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);
  
  return data.allStoryCategories.map((category) => (
    //TODO: if category name contains spaces/ starting/trailing spaces, trim value and replace spaces with a "-" or ""
    /*does not account for spaces in the category name, may cause URL issues */
    <ListGroup.Item><Link to={`/stories/${category.topic.trim().replace(/\s/g, '-')}`}>{category.topic}</Link></ListGroup.Item>
  ));
}
export default withRouter(StoryPage);