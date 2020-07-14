import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Product from "../components/product"

export default function ProductPage() {
  return <Product />;
}