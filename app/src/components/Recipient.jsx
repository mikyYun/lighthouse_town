import { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { SocketContext, UserListContext } from "../App.js";
import Cookies from "universal-cookie";

function Recipient(props) {
  const { socket } = useContext(SocketContext);
  const { room, onlineList } = useContext(UserListContext);
  const { changeRecipient, recipient } = props;
  // const { recipient, setRecipient } = useState({ value: "all", label: "all" });
  const [otherUsers, setOtherUsers] = useState([
    { value: "all", label: "all" },
  ]);
  const [selectValue, setSelectValue] = useState()
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
    const updateRecipientsList = () => {
      const option = [{ value: "all", label: "all" }];
      const onlineUsersList = Object.keys(onlineList);
      // onlineList.map((onlineUserName) => {
      onlineUsersList.map((onlineUserName) => {
        option.push({ value: onlineUserName, label: onlineUserName });
      });
      return option;
    };

    setOtherUsers(updateRecipientsList());
  }, [onlineList]);

  useEffect(() => {
    console.log("RERERE", recipient);
    // setSelectValue(recipient)
  }, [recipient]);


  return (
    <div className="card d-flex flex-row chat-to-container">
      <label htmlFor="user-name-input" className="chat-to">
        Recipient
      </label>
      <Select
        type="text"
        id="pdown"
        maxLength={12}
        value={
          // recipient
          (!recipient && { value: "all", label: "all" }) || {value: recipient, label: recipient}
        }
        defaultValue={{ value: "all", label: "all" }}
        onChange={(e) => changeRecipient(e.value)}
        options={otherUsers}
      />
    </div>
  );
}

export default Recipient;
