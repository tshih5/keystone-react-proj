import React, {useState, useEffect} from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {
  withRouter,
} from "react-router-dom";

import Product from "../components/product";
import { Spinner, Container, Row, Col } from 'react-bootstrap';

//This page displays the added items from the cms in a grid
function ProductPage(props) {
  const nameFilter = props.match.params.category;
  const [products, setProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);

  const { loading, error, data } = useQuery(PRODUCT_QUERY, {variables: {name: nameFilter}});
  
  useEffect(() => {
    if(loading === false && data){
      setProducts(data.allProducts);
      setOldProducts(data.allProducts);
    }
  }, [data, loading]);

  return (
    <div>
      <Container>
        <Row>
          <Col><h1 className="text-center product-header chinese-text">{props.match.params.category}</h1></Col>
        </Row>
        <Row>
          <div className="sub-buttongroup">
            <button className="pill chinese-text" onClick={()=>{setProducts(oldProducts)}}>全部</button>
            <SubCatButtons nameFilter={nameFilter} products={products} setProducts={setProducts} oldProducts={oldProducts}/>
          </div>
        </Row>
      </Container>
      <Container>
        <div className="row card-container product-grid">
          <RenderProducts products={products} loading={loading} error={error}/>
        </div>
      </Container>
    </div>
  );
}

const PRODUCT_QUERY = gql`
  query($name: String!){
    allProducts(where:{main_category:{name: $name}} orderBy: \"name\"){
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
  }`;

function RenderProducts(props){
  if(props.products.length !== 0 && !props.loading){
    return props.products.map((item) => (
      <Col lg={3} md={4} sm={6} key={item.id}><Product  {...item} /></Col>
    ));
  }else if(props.loading){
    return <Spinner animation="border" />;
  }else if(props.error){
    return <h1>{props.error}</h1>
  }else{
    return <h1>No results.</h1>;
  }
}

/* Render the buttons for the sub categories
*/
function SubCatButtons(props){
  const { loading, error, data } = useQuery(gql`
    query($nameFilter: String!){
      allMineralMainCategories(where:{name: $nameFilter}){
        subcategories{
          name
          id
        }
      }
    }
  `, {variables: {nameFilter: props.nameFilter}});
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data.allMineralMainCategories[0].subcategories);
  //check to see if there is at least 1 main category
  if(data && data.allMineralMainCategories[0]){
    return data.allMineralMainCategories[0].subcategories.map((category) => (
      <button className="pill chinese-text" key={category.id} onClick={()=>{FilterProducts(props, category.name)}}>{category.name}</button>
    ));
  }else{
    return null;
  }
  
}

function FilterProducts(props, sub_name){
  let filteredArray = [];
  for(var i = 0; i < props.oldProducts.length; ++i){
    if( props.oldProducts[i].sub_category && props.oldProducts[i].sub_category.name === sub_name){
      filteredArray.push(props.oldProducts[i]);
    }
  }
  props.setProducts(filteredArray);
}

export default withRouter(ProductPage);