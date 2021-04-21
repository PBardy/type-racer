import React from "react";
import { Link } from "react-router-dom";

export default class HomeView extends React.Component {

  render() {
    return (
      <div className="app">
        <div className="page">
          <Link to="/race">Race screen</Link>
        </div>
      </div>
    )
  }

}