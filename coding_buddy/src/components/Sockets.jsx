import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
// socket.id for client
// step 1. install socket.id-client
// must match version with server = client
// step 2. import socket.id-client
// import socketIoClient from 'socket.io-client';
const { io } = require("socket.io-client");
// ip connect to server
// const socket = io.connect("http://localhost:8000", {
//   reconnectionDelay: 1000,
//   reconnection: true,
//   reconnectionAttemps: 10,
//   transports: ['websocket'],
//   agent: false,
//   upgrade: false,
//   rejectUnauthorized: false
// }); // same domain

// function Sockets() {

export default function Sockets() {
  // const [socket, setSocket] = useState();

  // useEffect(() => {
  //   const socket = io("/");

  //   socket.on("CONNECT", (e) => {
  //     console.log("CONNECTED", e);
  //   });

  //   setSocket(socket);
  //   return () => socket.disconnect(); // => prevent memory leak..
  // }, []);

  // const RegistrationChecker = (e) => {
  //   socket.emit("REGISTERED", e);
  // };

  // const loginHandler = (e) => {
  //   socket.emit("LOGIN", e);
  // };

  // const setCookies = (e) => {
  //   socket.emit("SET COOKIES");
  // };

  return <></>;
}
// const [user, setUser] = useState('');
// const [users, setUsers] = useState([]);
// useEffect(() => {
//   // http://socket.io/docs/v4/emit-cheatsheet/
//   // socket.on(server's first message, (server's second message)=> {...}
//   // 백앤드에서 받아옴
//   socket.on('greeting', (data) => { // to brand new user
//     // console.log('second data from server', data)
//     console.log("greeting received from server");
//     // setUser([])
//     // setUsers([])
//     setUser(prev => data.randName);
//     setUsers(prev => data.users);
//   });
//   socket.on("New User Connection", (data) => { // to all current users
//     if (!users.includes(data)) {
//       setUsers(data);
//     }
//   });
//   socket.on("DISCONNECT", (data) => {
//     setUsers(prev => (
//       prev.filter(name => name !== data)
//     ));
//   });
// }, [user]);
// }, [socket]);
// console.log(users);
// console.log(user);
// return (
// <div>
//   {/* <h1>
//     oneUser : {user}
//   </h1>
//   <h3>User List</h3>
//   <p>
//     {users.map(user => <li key={users.indexOf(user)}>{user}</li>)}
//   </p>
//   <button onClick={() => socket.emit("CLICKED", 'clicked')}>
//     Click Me
//   </button> */}
// {/* </div> */}
// );
// }

// export default Sockets;
