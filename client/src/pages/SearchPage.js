import React, {useState} from "react";
import { Spinner, Container, Row, Col, Pagination} from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Product from "./../components/product";
import {
  withRouter,
} from "react-router-dom";
import { Query } from "@keystonejs/apollo-helpers";

//displays story previews in a vertical list
function SearchPage(props) {
  console.log("DECODED URI: " + decodeURIComponent(props.location.search));
  const searchParams = new URLSearchParams(decodeURIComponent(props.location.search));
  const searchName = searchParams.get('q');
  //get all tags
  console.log("term: " + searchParams.get('q'));
  console.log("tags: " + searchParams.getAll('t'));

  //let sq = generateQuery();

  //number of results per page, "first" in query
  const itemsPerPage = 20;
  //which page is clicked
  const [clickedPage, setClickedPage] = useState(0);
  //number of results to skip when on current page (clickedpage + 1)
  const offset = itemsPerPage * clickedPage;

  const { loading, error, data } = useQuery(gql`
    query($name: String!, $skip: Int!, $first: Int!){
      allProducts(search: $name, skip: $skip, first: $first){
        name
        price_in_usd
        sub_category{
          name
        }
        thumbnail{
          publicUrl
        }
        id
      }
      _allProductsMeta(search: $name){
        count
      }
    }
  `, {variables: {name: searchName, skip: offset, first: itemsPerPage}});

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>{error.message}</p>;

  //number of pages
  let pages = Math.ceil(data._allProductsMeta.count / itemsPerPage);

  return (
    <Container className="story-container" >
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="story-header">
              <h1>Search results for: "{searchName}"</h1>
          </div>
          <Container>
            <Paging clicked={clickedPage} setClicked={setClickedPage} pages={pages}/>
          </Container>

          <Container>
              <DisplayResults data={data}/>
          </Container>

          <Container>
            <Paging clicked={clickedPage} setClicked={setClickedPage} pages={pages}/>
          </Container>
        </Col>
        <Col className="d-sm-none d-md-block" xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <div className="category-list chinese-text">
          <h3>Page: {clickedPage + 1}</h3>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function generateQuery(){

  let variableDef = `$name: String!, $tag: String!`;
  let allProdParams = `where:{name_contains: $name, tags_some: {name_contains:$tag}}`
  let allStoryParams = `where:{title_contains: $name, tags_some:{name_contains:$tag}}`

  const searchQuery = `
    query(${variableDef}, $skip: Int!, $first: Int!){
      allProducts(${allProdParams}, skip: $skip, first: $first){
        name
        id
        tags{
          name
        }
      }
      allStories(${allStoryParams}, skip: $skip, first: $first){
        title
        id
        tags{
          name
        }
      }
      _allProductsMeta(${allProdParams}){
        count
      }
      _allStoriesMeta(${allStoryParams}){
        count
      }
    }`;
  console.log(searchQuery);
  return gql`${searchQuery}`;
}

//displays search results passed from props
function DisplayResults(props){
  if(props.data.allProducts){
    return props.data.allProducts.map((newProps) => (
      <Col lg={6} key={newProps.id}><Product  {...newProps} /></Col>
    ));
  }else{
    return <p>Theres nothing here right now; Please check back later.</p>
  }
  
}

function Paging(props){
  const pages = props.pages;
  let items = [];
  
  for (let number = 0; number <= pages - 1; number++) {
    items.push(
      <Pagination.Item key={number} active={number === props.clicked} onClick={() => {props.setClicked(number); scrollToTop()}}>
        {number + 1}
      </Pagination.Item>
    );
  }

  return(
    <div>
      <Pagination size="lg">{items}</Pagination>
      <br />
    </div>
  );
}

function scrollToTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
export default withRouter(SearchPage);