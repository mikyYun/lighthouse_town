import { useContext } from "react";
import { SocketContext } from "../App.js";
import Select from "react-select";

export default function Online() {
  const { online } = useContext(SocketContext);
  console.log("online_in_Online.jsx", online);
  const usersOnline = online.map((obj) => <li key={obj.value}>{obj.value}</li>);
  // const friendsList = online.map((name) => <a>{name.value}</a>);

  // console.log("david", usersOnline);

  // console.log("Online.jsx - online", online);
  return (
    <div className="onlinelist">
      {/* <div className="d-flex flex-column onlinelist"> */}
      <button
        className="btn btn-primary"
        type="button"
        data-toggle="collapse"
        data-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        Friends
      </button>
      <div className="collapse" id="friends-list">
        <div className="card card-body">heysadfasdfasdfasdfasdfsdaf</div>
      </div>
      <div className="card d-flex flex-row align-items-center friends-list-div">
        {/* <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Friends
          </button> */}

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {/* {usersOnline} */}
        </div>
      </div>
      <span>Online</span>
      <div>{usersOnline}</div>
      {/* </div> */}
    </div>
  );
}
