import React from "react";
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { Query, KeystoneProvider } from '@keystonejs/apollo-helpers';

import CampaignCards from "./CampaignCards";

import "../styles/main.css";

const client = new ApolloClient({
  link: new HttpLink({ uri: '/admin/api' }),
  cache: new InMemoryCache(),
});

export default function Campaigns() {

  const GET_DATA = gql`
  {
    allNewsletters{
      id
      campaignId
      name
      sendDate
      image {
        publicUrl
      }
    }
  }`

  return (
    <ApolloProvider client={client}>
      <KeystoneProvider>
        <div className="container">
          <div className="header-container">
            <h1 className="header-text">Campaigns</h1>
          </div>
          <div className="campaign-container">
            <Query query={GET_DATA}>
              {({ data, loading, error }) => (
                loading ? (
                  <div>Loading...</div>
                ) : (
                  <CampaignCards newsletters={data.allNewsletters} />
                )
              )}
            </Query>
          </div>
        </div>
      </KeystoneProvider>
    </ApolloProvider>
  );
}