import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Story() {
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

  console.log("Story Data" + data);

  return data.allStories.map(({ title, story_content }) => (
    <div key={title}>
      <p>
        {title}: {story_content}
      </p>
    </div>
  ));
}