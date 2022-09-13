import { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { SocketContext, UserListContext } from "../App.js";
import Cookies from "universal-cookie";

function Recipient(props) {
  const { socket } = useContext(SocketContext);
  const { room, onlineList } = useContext(UserListContext);
  const { changeRecipient } = props;
  // const { recipient, setRecipient } = useState({ value: "all", label: "all" });
  const [otherUsers, setOtherUsers] = useState([
    { value: "all", label: "all" },
  ]);
  // const [otherUsers, setOtherUsers] = useState([{ value: "username", label: "username" }, { value: "username", label: "username" }, { value: "username", label: "username" }]);

  // const updateOtherUsers = (username) => {
  //   setOtherUsers((prev) => [...prev, { value: username, label: username }]);
  // };

  // console.log("SETRE", changeRecipient)

  // useEffect(() => {
  // console.log(recipient)
  // const cookie = new Cookies();
  // const userdata = cookie.getAll().userdata;
  // console.log(userdata);
  // const username = userdata.userName;
  // updateOtherUsers(username)
  // }, [recipient]);

  useEffect(() => {
    const option = [{ value: "all", label: "all" }];
    const updateRecipientsList = () => {
      onlineList.map((onlineUserName) => {
        option.push({ value: onlineUserName, label: onlineUserName });
      });
      return option;
    };

    setOtherUsers([
      { value: "all", label: "all" },
      { value: "heesoo", label: "heesoo" },
      { value: "moon", label: "moon" },
      { value: "jordon", label: "jordon" },
    ]);
    // setOtherUsers(prev => ({
    // ...prev
    // }));
  }, [onlineList]);

  // const { recipient, setRecipient, nickname, online } = useContext(UserListContext);

  // useEffect(() => {

  //   const onlineOthers = online.filter(user => user.value !== nickname)
  //   return setOtherUsers(onlineOthers)
  // }, [online, nickname])

  return (
    <div className="card d-flex flex-row chat-to-container">
      <label htmlFor="user-name-input" className="chat-to">
        Recipient
      </label>
      <Select
        type="text"
        id="pdown"
        maxLength={12}
        // value={
        // recipient
        // recipient !== null && (recipient ||
        // { value: "all", label: "all" }
        // )
        // }
        defaultValue={{ value: "all", label: "all" }}
        onChange={(e) => changeRecipient(e.value)}
        options={otherUsers}
      />
    </div>
  );
}

export default Recipient;
