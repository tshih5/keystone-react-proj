import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Product() {
    const { loading, error, data } = useQuery(gql`
    {
      allProducts{
        name
        price_in_usd
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allProducts.map(({ name, price_in_usd }) => (
    <div key={name}>
      <p>
        {name}: {price_in_usd}
      </p>
    </div>
  ));
}