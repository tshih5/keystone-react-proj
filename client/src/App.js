import React, { useState } from "react";

import { Nav, Navbar, NavDropdown, Form, FormControl, Button} from "react-bootstrap";

import StoryPage from "./pages/StoryPage";
import ProductPage from "./pages/ProductPage";
import HomePage from "./pages/HomePage";
import ProductDisplay from "./pages/ProductDisplay";
import StoryDisplay from "./pages/StoryDisplay";
import logo from './img/logo.png';

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
  Redirect,
} from "react-router-dom";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:3000/admin/api"}),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <KeystoneProvider>
        <Router>
          <div className="wrapper">
            <Navbar bg="black" variant="dark" expand="lg" bsPrefix="navbar">
              <Navbar.Brand href="/">
                <img
                  src={logo}
                  className="d-inline-block align-top"
                  height="35"
                  alt="jhz logo"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} to="/" >首頁</Nav.Link>
                  <NavDropdown title="石頭種類" id="basic-nav-dropdown">
                    <ProductDropDowns />
                  </NavDropdown>
                  <NavDropdown title="趣聞雜談" id="basic-nav-dropdown">
                    <StoryDropDowns />
                  </NavDropdown>
                </Nav>
                <NavSearch/>
              </Navbar.Collapse>
            </Navbar>
            {/*Routes*/}
            <div className="site-content">
              <Switch>
                <Route path="/search/">
                  <h1>Search</h1>
                </Route>
                <Route path="/products/display/:productid">
                  <ProductDisplay />
                </Route>
                <Route path="/products/:category">
                  <ProductPage />
                </Route>
                <Route path="/stories/display/:storyid">
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

            <footer className="py-4 bg-black text-white-50">
              <div className="container text-center">
                <small>&copy;2020 by Tom Shih</small>
              </div>
            </footer>
          </div>
        </Router>
      </KeystoneProvider>
    </ApolloProvider>
  );
}

//Navbar form
function NavSearch(){
  const [searchFilter, setSearchFilter] = useState("Search");

  function handleSubmit(e){
    console.log("hi");
    return <Redirect to={`/search/?q=${searchFilter}`} />
  }

  return(
    <Form inline>
      <FormControl type="text" placeholder={searchFilter} className=" mr-sm-2" onChange={event => setSearchFilter(event.target.value)}/>
      <Link to={`/search/?q=${searchFilter}`}>
          <Button variant="light">Search</Button>
      </Link>
    </Form>
  );
}


/*Render dropdown buttons for story tab*/
function StoryDropDowns(){
  const { loading, error, data } = useQuery(gql`
    query{
      allStoryCategories{
        topic
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);
  
  return data.allStoryCategories.map((category) => (
    //if category name contains spaces/ starting/trailing spaces, trim and replace spaces with "-"
    <NavDropdown.Item key={category.topic} as={Link} to={`/stories/${category.topic.trim().replace(/\s/g, '-')}`}>{category.topic}</NavDropdown.Item>
  ));
}

/* Renders dropdown buttons for the product tab
 */
function ProductDropDowns(){
  const { loading, error, data } = useQuery(gql`
  query{
      allMineralMainCategories{
        name
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allMineralMainCategories.map((category) => (
    //if category name contains spaces/ starting/trailing spaces, trim and replace spaces with "-"
    <NavDropdown.Item key={category.name} as={Link} to={`/products/${category.name.trim().replace(/\s/g, '-')}`}>{category.name}</NavDropdown.Item>
  ));
}
