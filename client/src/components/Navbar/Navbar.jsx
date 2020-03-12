import React from 'react';
import { Popover, Avatar, Button } from 'antd';
import { Link } from '@reach/router';
import './navbar.scss';

const Navabar = (props) => {
  return (
    <div className="Navbar">
      <div className="logo">
        <img src="/dice.png" alt="dice"/>
        <Link to="/">
          <h2>TOKYO</h2>
        </Link>
      </div>
      <div className="profile">
        <span>{props.user && props.user.name}</span>
        <Popover placement="bottom" content={<Button onClick={props.onLogout}>Logout</Button>} trigger="click">
          <Avatar className="avatar" icon="user" />
        </Popover>
      </div>
    </div>
  );
}

export default Navabar;
