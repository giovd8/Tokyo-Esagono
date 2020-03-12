import React from 'react';
import { Button } from 'antd';
import { navigate } from "@reach/router";
import './not-found.scss';

const NotFoundPage = () => {
  return (
    <div className="NotFound">
      <div className="error">
        <h1>404</h1>
        <h2>Page Not Found!</h2>
        <Button
          type="primary"
          shape="round"
          icon="home"
          size="large"
          onClick={() => navigate(`/`)}>
          Back Home
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
