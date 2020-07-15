import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Product from "../components/product"

export default function ProductPage() {
  return <RenderProducts />;
}

function RenderProducts(){
  const { loading, error, data } = useQuery(gql`
    {
      allProducts{
        name
        price_in_usd
        origin
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allProducts.map(({ name, price_in_usd, origin }) => (
    <Product name={name} price={price_in_usd} origin={origin}/>
  ));
}