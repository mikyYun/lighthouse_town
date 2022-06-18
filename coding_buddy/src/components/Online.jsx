import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import Select from "react-select";

export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  console.log("online_in_Online.jsx", online);
  const usersOnline = online.map((obj) => <li key={obj.value}>{obj.value}</li>);
  const friendsListing = friendList.map(friendName => <li key={friendName}>{friendName}</li>)
  // const [friendList, setFriendList] = useState([])
  console.log("MY FRIENDS", friendList)
  // console.log("david", usersOnline);
  useEffect(() => {
    socket.emit("friendsList", {socketID: socket.id})
    console.log("ONLINE USEEFFECT")
  
    
    // return () => {
    //   socket.disconnect();
    // };
  }, [online])
  // const friendsListing = friendList.length > 0 ? friendList.map(arr => <span>{arr}</span>) : ""
  // console.log(friendList)
  // if (friendList.length > 0) {
  // }
  // useEffect(() => {
    // socket.on("friendsListBack", (e => {
      // console.log("2222222222222222222222222222",e)
      // setFriendList(e)
    // }))
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [])



  // console.log("Online.jsx - online", online);
  return (
    <div className="onlinelist">
      <div>Friends</div>
      {friendsListing}
      {/* <div className="d-flex flex-column onlinelist"> */}
      {/* <button
        className="btn btn-primary"
        type="button"
        data-toggle="collapse"
        data-target="#friends-list"
        aria-expanded="false"
        aria-controls="friends-list"
      >
        Toggle second element
      </button>
      <div class="row">
        <div className="col">
          <div className="collapse multi-collapse" id="friends-list">
            <div className="card card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. Nihil anim keffiyeh
              helvetica, craft beer labore wes anderson cred nesciunt sapiente
              ea proident.
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="collapse" id="friends-list">
        <div className="card card-body">
          {/* {fakeFriendsList} */}
      {/* testloooooooooooooooooooooong */}
      {/* </div> */}
      {/* </div> */}
      {/* <div className="card d-flex flex-row align-items-center friends-list-div">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Friends
          </button>

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {usersOnline}
        </div>
      </div> */}
      <span>Online</span>
      <div>{usersOnline}</div>
      {/* </div> */}
    </div>
  );
}
