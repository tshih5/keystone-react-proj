import React from "react";

import { Nav, Navbar, NavDropdown} from "react-bootstrap";

import StoryPage from "./pages/StoryPage";
import ProductPage from "./pages/ProductPage";
import HomePage from "./pages/HomePage";
import ProductDisplay from "./pages/ProductDisplay";
import StoryDisplay from "./pages/StoryDisplay";

import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { KeystoneProvider } from '@keystonejs/apollo-helpers';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";


const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/admin/api'}),
  cache: new InMemoryCache(),
});


export default function App() {
  return (
    <ApolloProvider client={client}>
      <KeystoneProvider>
        <Router>
          <div>
            <Navbar bg="dark" variant="dark" expand="lg">
              <Navbar.Brand href="/">Nav</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <NavDropdown title="Stories" id="basic-nav-dropdown">
                    <StoryDropDowns />
                  </NavDropdown>
                  <NavDropdown title="Products" id="basic-nav-dropdown">
                    <ProductDropDowns />
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

            <Switch>
              <Route path="/products/:category/:productid">
                <ProductDisplay />
              </Route>
              <Route path="/products/:category">
                <ProductPage />
              </Route>
              <Route path="/stories/:topic/:storyid">
                <StoryDisplay />
              </Route>
              <Route path="/stories/:topic">
                <StoryPage />
              </Route>
              <Route exact path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Router>
      </KeystoneProvider>
    </ApolloProvider>
  );
}

/*Render dropdown buttons for story tab*/
function StoryDropDowns(){
  const { loading, error, data } = useQuery(gql`
    {
      allStoryCategories{
        topic
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);
  
  return data.allStoryCategories.map((category) => (
    //TODO: if category name contains spaces/ starting/trailing spaces, trim value and replace spaces with a "-"
    /*does not account for spaces in the category name, may cause URL issues */
    <NavDropdown.Item key={category.topic} as={Link} to={`/stories/${category.topic.trim().replace(/\s/g, '-')}`}>{category.topic}</NavDropdown.Item>
  ));
}

/* Renders dropdown buttons for the product tab
 */
function ProductDropDowns(){
  const { loading, error, data } = useQuery(gql`
    {
      allMineralMainCategories{
        name
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allMineralMainCategories.map((category) => (
    //TODO: if category name contains spaces/ starting/trailing spaces, trim value and replace spaces with a "-"
    /*does not account for spaces in the category name, may cause URL issues */
    <NavDropdown.Item key={category.name} as={Link} to={`/products/${category.name.trim().replace(/\s/g, '-')}`}>{category.name}</NavDropdown.Item>
  ));
}
