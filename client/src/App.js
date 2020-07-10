import React from "react";
import { ApolloClient } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Query, KeystoneProvider } from '@keystonejs/apollo-helpers';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { Nav, Navbar, NavItem, Form, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

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
              <Navbar.Brand href="/">Navbar</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="home">Home</Nav.Link>
                <LinkContainer to="/"><NavItem>Home</NavItem></LinkContainer>
                <LinkContainer to="/about"><NavItem>About</NavItem></LinkContainer>
                <LinkContainer to="/topics"><NavItem>Topics</NavItem></LinkContainer>
              </Nav>
            </Navbar>

            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/topics">
                <Topics />
              </Route>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/cats">
                <h1>Cats</h1>
              </Route>
              <Route path="/dogs">
              <h1>Dogs</h1>
              </Route>
            </Switch>
          </div>
        </Router>
      </KeystoneProvider>
    </ApolloProvider>
  );
}

function Home() {
  const { loading, error, data } = useQuery(gql`
    {
      allProducts{
        name
        origin
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allProducts.map(({ name, origin }) => (
    <div key={name}>
      <p>
        {name}: {origin}
      </p>
    </div>
  ));
}

function About() {
  const { loading, error, data } = useQuery(gql`
    {
      allStories{
        title
        story_content
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return data.allStories.map(({ title, story_content }) => (
    <div key={title}>
      <p>
        {title}: {story_content}
      </p>
    </div>
  ));
}

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