import React from "react";
import {Outlet} from "react-router-dom";
import Login from "./Login";
import Navbar from "./Navbar";

const Layout = (props) => {
  // console.log("layouts", props)
  const setUser = props.setUser
  // const clearCookies = props.click
  return (
    <>
      {/* <Navbar /> */}
      {/* <Outlet /> */}
      <Login setUser={setUser}/>
    </>
  );
};

export default Layout;