import React, {useState} from "react";
import "../App.css";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

//This page displays individual products/items with lots of info

function ProductDisplay(props) {
  //const [productID, setProductID] = useState(props.match.params.productid);
  const productID = props.match.params.productid;
  const { loading, error, data } = useQuery(PRODUCT_QUERY,{variables:{pid: productID}});

  return (
    <Container>
      <Row xl={3} md={3} sm={1}>
        <Col xl={8} md={7} sm={12}>
          <DisplayProduct data={data} loading={loading} error={error}/>
        </Col>
        <Col xl={1} md={1} sm={12}></Col>
        <Col className="sticky-col" xl={3} md={4} sm={12}>
          <Container>
            <div className="sticky-bar-right">
              <h4>TAGS</h4>
              <DisplayTags data={data} loading={loading} error={error}/>
            </div>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const PRODUCT_QUERY = gql`
  query($pid: ID!){
    Product(where:{id: $pid}){
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
        name
      }
      price_in_usd
      id
    }
  }`;

function DisplayProduct(props){
  if(props.error) return <h1>Error: {props.error.message}</h1>;
  if(props.loading) return <h1>Loading</h1>;

  if(props.data && !props.loading){
    const productData = props.data.Product;
    return(
      <Container className="product-info">
        <h1>{productData.name}</h1>
        <img className="img-fluid" src={productData.main_image == null ? 'http://placehold.jp/600x350.png': `${productData.main_image.publicUrl}`} alt="stone main"/>
        <div className="descriptions">
          <p>[印紐 / Seal]: {productData.seal}
          <br/>[尺寸 / Dimensions]: {productData.length_mm}{productData.width_mm == null ? '' : 'mm x '}{productData.width_mm}{productData.height_mm == null ? '' : 'mm x '} {productData.height_mm}{productData.height_mm == null ? '' : 'mm'}
          <br/>[重量 / weight]: {productData.weight}g</p>
          {/*<p>[石種 / Material]: <br/>{productData.material}</p>*/}
          {productData.material ? <p>[石種 / Material]: <br /> ${productData.material}</p> : ''}
          <p>[石質 / Quality]: <br/>{productData.quality}</p>
          <p>[作者 / Artist]: <br/>{productData.creator}</p>
          <p>[雕材賞析/雕工 Craftsmanship]: <br/>{productData.craftsmanship_comment}</p>
          <p>[物品說明 / Item Description]: <br/>{productData.item_description}</p>
          <p>[背後典故 / Story]: <br/>{productData.item_story}</p>
          <span>[備註 / Note]: <div dangerouslySetInnerHTML={createMarkup(productData.note)} className="product-note"/></span>
        </div>
      </Container>
    );
  }
  return null;
}

function DisplayTags(props){
  if(props.error) return <p>Error: {props.error.message}</p>;
  if(props.loading) return <h5>Loading . . .</h5>;

  if(!isEmpty(props.data.Product.tags)){
    return props.data.Product.tags.map((tag) => (
        <Badge key={tag.name} className="tag" variant="info">{tag.name}</Badge>
    ));
  }else{
    return <h5>None</h5>;
  }
}

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key)){
        return false;
      }
  }
  return true;
}

function createMarkup(story_content){
  return {__html: story_content};
}
export default withRouter(ProductDisplay);