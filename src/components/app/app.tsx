import React from 'react';
import { Helmet } from 'react-helmet';
import { MainPage } from '@components/main-page';

export const App = () => (
  <>
    <Helmet>
      <title>CV Builder</title>
      <meta name="description" content="Build your own cv" />
    </Helmet>
    <MainPage />
  </>
);
