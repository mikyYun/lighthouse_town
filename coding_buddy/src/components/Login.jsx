import React from "react";
import Cookies from "universal-cookie";

// import {Outlet} from "react-router-dom";

export default function Register() {
  const cookies = new Cookies();

  // document.addEventListener("click", () => {
  //   // get input value
  //   const target = document.querySelectorAll("input");
  //   // console.log(target)
  //   target.forEach((each) => {
  //     console.log(each.value);
  //   });
  // });
  // 쿠키 삭제 테스트
  document.addEventListener("keyPress", (e) => {
    console.log(e.value)
    // if (e.key === "q") cookies.remove("test");
    // console.log(cookies.get("test"));
  });
  return (
    <>
      <form action="/game" method="GET" id="form_login">
        EMAIL :{" "}
        <input
          name="email"
          id="register_email"
          rows="1"
          placeholder="EMAIL"
          typeof="email"
        ></input>
        <br />
        PASSWORD :{" "}
        <input
          name="password"
          id="register_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
        ></input>
        <br />
        <button
          onClick={(e) => {
            // 데이터 validation ... is true? else preventdefault
            // 쿠키 세팅
            const target = document.querySelectorAll("input");

            // cookies.set(target[0].value, target[1].value, { path: "/" });
            cookies.set(target[0].value, target[1].value);
            // console.log(cookies.get("test"));
          }}
        >
          Register
        </button>
      </form>
      {/* <Outlet /> */}
    </>
  );
}
