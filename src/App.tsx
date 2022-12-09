import * as React from "react"
import { useState } from 'react'
import * as ReactDOM from "react-dom"
import { BrowserRouter as Router, Routes, Route, useRoutes } from "react-router-dom";
import './App.css'
import Home from "./routes/Home";
import Test from './routes/Test'


const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "test", element: <Test /> },
    // ...
  ]);
  return routes;
};

const AppRouterWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

ReactDOM.render(
  <AppRouterWrapper />,
  document.getElementById("root")
);


export default AppRouterWrapper
