import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";

const Layout = (props) => {
  console.log("layouts", props)
  // const clearCookies = props.click
  return (
    <>
      <Navbar click={props.click}/>
      {/* <Outlet /> */}
    </>
  );
};

export default Layout;