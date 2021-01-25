import React from 'react';
import { Helmet } from 'react-helmet';
import MainPage from './MainPage';

const App = () => (
  <>
    <Helmet>
      <title>CV Builder</title>
      <meta name="description" content="Build your own cv" />
    </Helmet>
    <MainPage />
  </>
);

export default App;
