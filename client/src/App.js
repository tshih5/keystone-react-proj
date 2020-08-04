import React from "react";

import { Nav, Navbar, NavDropdown} from "react-bootstrap";

import StoryPage from "./pages/StoryPage";
import ProductPage from "./pages/ProductPage";
import HomePage from "./pages/HomePage";
import ProductDisplay from "./pages/ProductDisplay";

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
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="/">Nav</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <NavDropdown title="Stories" id="basic-nav-dropdown">
                  <StoryDropDowns />
                </NavDropdown>
                <NavDropdown title="Products" id="basic-nav-dropdown">
                  <ProductDropDowns />
                </NavDropdown>
              </Nav>
            </Navbar>

            <Switch>
              <Route path="/products/:category/:productid">
                <ProductDisplay />
              </Route>
              <Route path="/products/:category">
                <ProductPage />
              </Route>
              <Route path="/stories/:topic/:storyid">
                <h1>StoryID</h1>
              </Route>
              <Route path="/stories/:topic">
                <StoryPage />
              </Route>
              <Route path="/topics">
                <Topics />
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
      allStoryTags{
        topic
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //console.log(data);

  return data.allStoryTags.map((category) => (
    //TODO: if category name contains spaces/ starting/trailing spaces, trim value and replace spaces with a "-"
    /*does not account for spaces in the category name, may cause URL issues */
    <NavDropdown.Item key={category.topic} as={Link} to={`/stories/${category.topic}`}>{category.topic}</NavDropdown.Item>
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
    <NavDropdown.Item key={category.name} as={Link} to={`/products/${category.name}`}>{category.name}</NavDropdown.Item>
  ));
}

//TODO: remove this later
function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}