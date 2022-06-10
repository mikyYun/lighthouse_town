import React from "react";
// import {Outlet} from "react-router-dom";

export default function Register () {
  return (
    <>
      <form>
        EMAIL : <input name="email" id="register_email" rows="1" placeholder="EMAIL" typeof="email"></input><br />
        NAME : <input name="name" id="register_name" rows="1" placeholder="NAME" typeof="text"></input><br />
        PASSWORD : <input name="password" id="register_password" rows="1" placeholder="PASSWORD" type="password"></input><br />
        CONFIRM PASSWORD : <input name="password_confirmation" id="register_password_confirmation" rows="1" placeholder="PASSWORD_CONFIRMATION" type="password"></input><br />
        <button>
          Register
        </button>
      </form>
      {/* <Outlet /> */}
    </>
  );
};