import React from "react";

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {
  useLocation,
} from "react-router-dom";


import Product from "../components/product";
import { Container, Row, Col } from 'react-bootstrap';

export default function ProductPage() {
  const location = useLocation();

  return (
    <div>
      <Container>
        <Row>
          <Col>{location.pathname.substring(location.pathname.lastIndexOf('/') + 1)}</Col>
          <Col><h1>ROCKS(in chinese)</h1></Col>
        </Row>
          <FilterGroup />
        <Row>
          <RenderProducts />
        </Row>
      </Container>
    </div>
  );
}

function RenderProducts(){
  const { loading, error, data } = useQuery(gql`
    {
      allProducts{
        name
        price_in_usd
        id
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);

  return data.allProducts.map((props) => (
    <Col md={3}><Product {...props} /></Col>

  ));
}

function FilterGroup(){
  
  return(
    <>
      <Row>
        <Col>
          <MainCatButtons />
        </Col>
      </Row>
      <Row>
        <Col>
          <button className="subRock1" /*onClickHandler*/>SubRock1</button>
          <button className="subRock2" /*onClickHandler*/>SubRock2</button>
          <button className="subRock3" /*onClickHandler*/>SubRock3</button>
          <button className="subRock4" /*onClickHandler*/>SubRock4</button>
          <button className="subRock5" /*onClickHandler*/>SubRock5</button>
          <button className="subRock6" /*onClickHandler*/>SubRock6</button>
        </Col>
      </Row>
    </>
  );
}

/* Render the buttons for the main stone categories
**
**
*/
function MainCatButtons(){
  const location = useLocation();

  const { loading, error, data } = useQuery(gql`
    {
      allMineralMainCategories(where:{name: "${location.pathname.substring(location.pathname.lastIndexOf('/') + 1)}"}){
        subcategories{
          name
        }
      }
    }
  `);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data.allMineralMainCategories[0].subcategories);

  return data.allMineralMainCategories[0].subcategories.map((category) => (
    <button className="mainRock1" /*onClickHandler*/>{category.name}</button>
  ));
}
