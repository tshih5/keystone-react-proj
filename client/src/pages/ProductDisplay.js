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
            <img className="img-fluid" src={productData.main_image == null ? 'http://placehold.jp/600x350.png': `${productData.main_image.publicUrl}`} alt="stone main image"/>
            <div className="descriptions">
              <br/>
              <p>[石種]: {productData.material}
              <br/>[印紐]: {productData.seal}
              <br/>[尺寸]: {productData.length_mm}{productData.width_mm == null ? '' : 'mm x '}{productData.width_mm}{productData.height_mm == null ? '' : 'mm x '} {productData.height_mm}{productData.height_mm == null ? '' : 'mm'}
              <br/>[石質]: {productData.quality}
              <br/>[重量]: {productData.weight}g
              <br/>[作者]: {productData.creator}</p>
              <p>[雕材賞析/雕工]: <br/>{productData.craftsmanship_comment}</p>
              <p>[物品說明]: <br/>{productData.item_description}</p>
              <p>[背後典故]: <br/>{productData.item_story} </p>
              <span>[備註]: <div dangerouslySetInnerHTML={createMarkup(productData.note)} className="product-note"/></span>
              
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
        material
        seal
        length_mm
        height_mm
        width_mm
        quality
        weight
        creator
        craftsmanship_comment
        item_description
        item_story
        note
        main_image{
          publicUrl
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

function createMarkup(story_content){
  return {__html: story_content};
}
export default withRouter(ProductDisplay);