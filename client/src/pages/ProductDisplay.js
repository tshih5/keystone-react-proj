import React, {useState, useEffect} from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function ProductDisplay(props) {
  let productID = props.match.params.productid;
  const [productData, setProductData] = useState([]);

  console.log(productData);
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <GetItemData productID={productID} setProductData={setProductData} />
          <h2>{productData.name}</h2>
          <img className="img-fluid" src={productData.main_image == null ? 'http://placehold.jp/600x350.png': `http://localhost:3000/images/${productData.main_image.filename}`} alt=""/>
          <div className="descriptions">
            <p>[name]:</p>
            <p>[seal]:</p>
            <p>[dimensions l x w x h]: {productData.length_cm} x {productData.width_cm} x {productData.height_cm}</p>
            <p>[weight]: {productData.weight}</p>
            <p>[creator]: </p>
            <p>[craftsmanship_comment]: {productData.craftsmanship_comment}</p>
            <p>[item description]: {productData.item_description}</p>
            <p>[item story]: {productData.item_story} </p>
            <p>[note]: </p>
            <p>ProductID: {productID}</p>
          </div>
        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col xl={3} md={4} sm={12}>
          <h3>Col 2</h3>
        </Col>
      </Row>
    </Container>
  );
}

function GetItemData({productID, setProductData}){
  const { loading, error, data } = useQuery(gql`
    {
      allProducts(where:{id:"${productID}"}){
        name
        seal
        length_cm
        height_cm
        width_cm
        weight
        creator
        craftsmanship_comment
        item_description
        item_story
        note
        main_image{
          filename
        }
        price_in_usd
        id
      }
    }
  `);

  useEffect(() => {
    if(loading === false && data){
      setProductData(data.allProducts[0]);
    }
  }, [data]);

  if(error) return <p>Error :(</p>
  return null;
}

export default withRouter(ProductDisplay);