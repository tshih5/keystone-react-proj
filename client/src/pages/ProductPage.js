import React, {useState, useEffect} from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {
  withRouter,
} from "react-router-dom";

import Product from "../components/product";
import { Container, Row, Col, Spinner} from 'react-bootstrap';

//This page displays the added items from the cms in a grid
function ProductPage(props) {
  const [nameFilter, setNameFilter] = useState(props.match.params.category);
  const [products, setProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);
  //console.log(props);

  useEffect(() => {
    setNameFilter(props.match.params.category);
  }, [props.match.params.category]);

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
      <GetProducts nameFilter={nameFilter} products={products} setProducts={setProducts} setOldProducts={setOldProducts}/>
      <Container>
        <div className="row card-container product-grid">
          <RenderProducts products={products}/>
        </div>
      </Container>
    </div>
  );
}

/* Get Products based on main category
** Does not return anything
*/
function GetProducts({nameFilter, setProducts, setOldProducts}){
  const { loading, error, data } = useQuery(gql`
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
    }
  `, {variables: {name: nameFilter}});
  
  useEffect(() => {
    if(loading === false && data){
      setProducts(data.allProducts);
      setOldProducts(data.allProducts);
    }
  }, [data]);

  if (error) return <p>Error :(</p>;
  return null;
}

function RenderProducts(props){
  if(props.products.length !== 0){
    return props.products.map((item) => (
      <Col lg={3} md={4} sm={6} key={item.id}><Product  {...item} /></Col>
    ));
  }else{
    return null;
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