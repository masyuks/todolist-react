import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Home from "./Home.js";
import Report from "./Report";
 
class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul className="header bg-primary">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/report">Laporan Chat</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/report" component={Report}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;

