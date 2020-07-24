import React, {useState} from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {
  useLocation,
} from "react-router-dom";

import Product from "../components/product";
import { Container, Row, Col } from 'react-bootstrap';

export default function ProductPage() {
  let nameFilter = GetEndPath();

  return (
    <div>
      <Container>
        <Row>
          <Col><h1>{nameFilter}</h1></Col>
        </Row>
        <FilterGroup />
        <Row>
          <RenderProducts nameFilter={nameFilter}/>
        </Row>
      </Container>
    </div>
  );
}

/* Render product cards based on main category
 */
function RenderProducts(props){
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('main_category');

  const { loading, error, data  } = useQuery(gql`
    {
      allProducts(where:{${category}:{name: "${props.nameFilter}"}}){
        name
        price_in_usd
        sub_category{
          name
        }
        id
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);
  
  //TODO: Once Product Cards are finalized, don't send every prop as it is harder to document
  return data.allProducts.map((item) => (
    <Col md={3} key={item.id}><Product {...item} /></Col>

  ));
}

/* Button group for sub categories or tags
 */
function FilterGroup(){
  
  return(
    <>
      <Row>
        <Col>
          <button className="mainRock1" key="all"/*onClickHandler*/>All</button>
          <SubCatButtons />
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

/* Render the buttons for the sub categories
**
**
*/
function SubCatButtons(){
  let endPath = GetEndPath();

  const { loading, error, data } = useQuery(gql`
    {
      allMineralMainCategories(where:{name: "${endPath}"}){
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

  return data.allMineralMainCategories[0].subcategories.map((category) => (
    <button className="mainRock1" key={category.id}/*onClickHandler*/>{category.name}</button>
  ));
}

/* get the last part of the url (e.g. url.com/foo/bar will return bar)
 * 
 */
function GetEndPath(){
  const location = useLocation();
  return location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
}

/*
query{
	allProducts(where:{sub_category}:{name: "ice"}}){
    name
    sub_category{
      name
    }
  }
}
*/