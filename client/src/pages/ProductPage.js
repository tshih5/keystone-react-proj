import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Product from "../components/product"

export default function ProductPage() {
  return (
    <div>
    <h1>ROCKS(in chinese)</h1>
    <div>
      <button className="mainRock1" /*onClickHandler*/>Rock1</button>
      <button className="mainRock2" /*onClickHandler*/>Rock2</button>
      <button className="mainRock3" /*onClickHandler*/>Rock3</button>
      <button className="mainRock4" /*onClickHandler*/>Rock4</button>
    </div>
      <div>
        <button className="subRock1" /*onClickHandler*/>SubRock1</button>
        <button className="subRock2" /*onClickHandler*/>SubRock2</button>
        <button className="subRock3" /*onClickHandler*/>SubRock3</button>
        <button className="subRock4" /*onClickHandler*/>SubRock4</button>
        <button className="subRock5" /*onClickHandler*/>SubRock5</button>
        <button className="subRock6" /*onClickHandler*/>SubRock6</button>
      </div>
  </div>
  //<RenderProducts />
  );
}

function RenderProducts(){
  const { loading, error, data } = useQuery(gql`
    {
      allProducts{
        name
        price_in_usd
        origin
        id
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allProducts.map((props) => (
    <Product {...props} />

  ));
}