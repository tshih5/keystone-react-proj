import React, {useState, useEffect} from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {
  withRouter,
} from "react-router-dom";

import Product from "../components/product";
import { Container, Row, Col, CardDeck } from 'react-bootstrap';

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
          <Col><h1>{props.match.params.category}</h1></Col>
        </Row>
        <Row>
        <SubCatButtons nameFilter={nameFilter} products={products} setProducts={setProducts} oldProducts={oldProducts}/>
        </Row>
        <Row>
          <GetProducts nameFilter={nameFilter} products={products} setProducts={setProducts} setOldProducts={setOldProducts}/>
          <RenderProducts products={products}/>
        </Row>
      </Container>
    </div>
  );
}

/* Get Products based on main category
** Does not return anything
*/
function GetProducts({nameFilter, setProducts, setOldProducts}){
  const { loading, error, data } = useQuery(gql`
    {
      allProducts(where:{main_category:{name: "${nameFilter}"}}){
        name
        price_in_usd
        sub_category{
          name
        }
        id
      }
    }
  `);
  
  useEffect(() => {
    if(loading === false && data){
      setProducts(data.allProducts);
      setOldProducts(data.allProducts);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  //console.log(data);
  return null;
}

function RenderProducts(props){
  return props.products.map((item) => (
    //<Col md={3} key={item.id}><Product {...item} /></Col>
    <CardDeck><Product key={item.id} {...item} /></CardDeck>
  ));
}

/* Render the buttons for the sub categories
**
**
*/
function SubCatButtons(props){
  const { loading, error, data } = useQuery(gql`
    {
      allMineralMainCategories(where:{name: "${props.nameFilter}"}){
        subcategories{
          name
          id
        }
      }
    }
  `);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data.allMineralMainCategories[0].subcategories);
  if(data){
    return data.allMineralMainCategories[0].subcategories.map((category) => (
      <button className="mainRock1" key={category.id} onClick={()=>{FilterProducts(props, category.name)}}>{category.name}</button>
    ));
  }else{
    return <h1>Error :(</h1>
  }
  
}

function FilterProducts(props, sub_name){
  let filteredArray = [];
  for(var i = 0; i < props.oldProducts.length; ++i){
    if(props.oldProducts[i].sub_category.name === sub_name){
      filteredArray.push(props.oldProducts[i]);
    }
  }
  props.setProducts(filteredArray);
}

export default withRouter(ProductPage);