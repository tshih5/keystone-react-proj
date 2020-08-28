import React, {useState, useEffect} from "react";
import "../App.css";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

//This page displays individual products/items

function ProductDisplay(props) {
  let productID = props.match.params.productid;
  const [productData, setProductData] = useState([]);

  console.log(productData);
  return (
    <Container fluid={true}>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <Container className="product-info chinese-text">
            <GetItemData productID={productID} setProductData={setProductData} />
            <h1>{productData.name}</h1>
            <img className="img-fluid" src={productData.main_image == null ? 'http://placehold.jp/600x350.png': `http://localhost:3000/images/${productData.main_image.filename}`} alt=""/>
            <div className="descriptions">
              <br/>
              <p>[seal]: {productData.seal}
              <br/>[dimensions l x w x h]: {productData.length_cm}{productData.width_cm == null ? '' : 'cm x '}{productData.width_cm}{productData.height_cm == null ? '' : 'cm x '} {productData.height_cm}{productData.height_cm == null ? '' : 'cm'}
              <br/>[weight]: {productData.weight}g
              <br/>[creator]: {productData.creator}</p>
              <p>[craftsmanship_comment]: {productData.craftsmanship_comment}</p>
              <p>[item description]: {productData.item_description}</p>
              <p>[item story]: {productData.item_story} </p>
              <p>[note]: {productData.note}</p>
            </div>
          </Container>

        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <div className="tag-list">
            <h3>TAGS</h3>
            <DisplayTags tags={productData.tags} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function GetItemData({productID, setProductData}){
  const { loading, error, data } = useQuery(gql`
    query($pid: ID!){
      allProducts(where:{id: $pid}){
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
        tags{
          tag
        }
        price_in_usd
        id
      }
    }
  `,{variables:{pid: productID}});

  useEffect(() => {
    if(loading === false && data){
      setProductData(data.allProducts[0]);
    }
  }, [data]);

  if(error) return <p>Error :(</p>
  return null;
}

function DisplayTags(props){
  console.log(props);
  if(!isEmpty(props.tags)){
    return props.tags.map((tag) => (
        <Badge className="tag" variant="info">{tag.tag}</Badge>
    ));
  }else{
    return <h5>None</h5>;
  }
}

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

export default withRouter(ProductDisplay);