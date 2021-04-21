import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeView from "../views/home";
import RaceView from "../views/race";

export default class SecureRouter extends React.Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={HomeView} exact />
          <Route path="/race" component={RaceView} exact />
        </Switch>
      </Router>
    )
  }

}