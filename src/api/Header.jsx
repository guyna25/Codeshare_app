import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
  return (
    <header className="App-header">
      <Link className="App-title" to="/">Realtime Code Share</Link>
    </header>
  );
};

export default Header;