import React, {useState} from "react";
import { Spinner, Container, Row, Col, Pagination, Jumbotron} from "react-bootstrap";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Product from "./../components/product";
import SearchResult from "./../components/sResult";
import {
  withRouter,
} from "react-router-dom";

//displays story previews in a vertical list
function SearchPage(props) {
  //console.log("DECODED URI: " + decodeURIComponent(props.location.search));
  const searchParams = new URLSearchParams(decodeURIComponent(props.location.search));

  //get term/tags
  //console.log("term: " + searchParams.get('q'));
  //console.log("tags: " + searchParams.getAll('t'));
  const term = searchParams.get('q') || "";
  const tags = searchParams.getAll('t');

  const SEARCH_QUERY = generateQuery(tags);

  //number of results per page, "first" in query
  const itemsPerPage = 20;
  //which page is clicked
  const [clickedPage, setClickedPage] = useState(0);
  //number of results to skip when on current page (clickedpage + 1)
  const offset = (itemsPerPage / 2) * clickedPage;

  const { loading, error, data } = useQuery(SEARCH_QUERY, {variables: {name: term, skip: offset, first: itemsPerPage / 2}});

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>{error.message}</p>;

  //number of pages
  let pages = Math.ceil((data._allProductsMeta.count + data._allStoriesMeta.count) / itemsPerPage);

  return (
    <Container className="story-container" >
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <div className="story-header">
          <h1>Search results for: "{term}" with tag(s): "{tags.join()}"</h1>
          </div>
          <Col lg={12} className="paging">
            <Paging clicked={clickedPage} setClicked={setClickedPage} pages={pages}/>
          </Col>

          <DisplayResults data={data}/>

          <Col lg={12} className="paging">
            <Paging clicked={clickedPage} setClicked={setClickedPage} pages={pages}/>
          </Col>

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

function generateQuery(tags){
  let tagString = createTagParams(tags);

  let allProdParams = `where:{name_contains_i: $name${tagString}}`;
  let allStoryParams = `where:{title_contains_i: $name${tagString}}`;
  const searchQuery = `
    query($name: String!, $skip: Int!, $first: Int!){
      allProducts(${allProdParams}, skip: $skip, first: $first){
        name
        id
        main_image{
          publicUrl
        }
      }
      allStories(${allStoryParams}, skip: $skip, first: $first){
        title
        id
        main_image{
          publicUrl
        }
      }
      _allProductsMeta(${allProdParams}){
        count
      }
      _allStoriesMeta(${allStoryParams}){
        count
      }
    }`;
  //console.log(searchQuery);
  return gql(searchQuery);
}

function createTagParams(tags){
  if(tags.length === 0){
    //console.log("no tags.");
    return ``;
  }else if(tags.length === 1){
    //console.log("only 1 tag.");
    return `, tags_some: {name_i: "${tags[0]}"}`;
  }else{
    //console.log("multiple tags.");
    let multString = ``;
    for(var i = 0; i < tags.length; ++i){
      multString += `{tags_some:{name_i: "${tags[i]}"}}, `;
    }
    //console.log("multString " + multString);
    return `, AND:[${multString}]`;
  }
}

//displays search results passed from props
function DisplayResults(props){
  //console.log(props.data);
  let prod_arr = [];
  let story_arr = [];
  
  if(props.data.allProducts){
    prod_arr = props.data.allProducts.map((newProps) => (
    <Col lg={12} key={"prod-" + newProps.id}><SearchResult prod={newProps}/></Col>
    ));
  }
  if(props.data.allStories){
    story_arr = props.data.allStories.map((newProps) => (
      <Col lg={12} key={"story-" + newProps.id}><SearchResult story={newProps}/></Col>
    ));
  }

  let tot_arr = [...prod_arr, ...story_arr];
  //console.log(tot_arr);
  if(prod_arr.length === 0 && story_arr.length === 0){
    return <p>Theres nothing here right now; Please check back later.</p>
  }else{
    return tot_arr;
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