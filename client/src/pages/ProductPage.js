import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Product from "../components/product"

export default function ProductPage() {
  return (
    <div className="wrapper">
      <RenderProducts />
    </div>
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