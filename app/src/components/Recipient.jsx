import { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { SocketContext, UserListContext } from "../App.js";
import Cookies from "universal-cookie";

function Recipient() {
  const { socket } = useContext(SocketContext);
  const { room, onlineList } = useContext(UserListContext);
  const { recipient, setRecipient } = useState({ value: "all", label: "all" });
  const [otherUsers, setOtherUsers] = useState([]);

  const updateOtherUsers = (username) => {
    setOtherUsers((prev) => [...prev, { value: username, label: username }]);
  };

  useEffect(() => {
    const cookie = new Cookies();
    const userdata = cookie.getAll().userdata;
    console.log(userdata);
    const username = userdata.userName;
    // updateOtherUsers(username)
  }, []);

  useEffect(() => {
    console.log("onlineList", onlineList);
    const updateRecipientsList = () => {
      const option = [];
      onlineList.map((list) => {
        option.push({ value: list, label: list });
      });
      return option;
    };
    setOtherUsers(updateRecipientsList());
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
        value={
          // recipient
          // recipient !== null && (recipient ||
          { value: "all", label: "all" }
          // )
        }
        // defaultValue={"all"}
        // onChange={setRecipient}
        options={otherUsers}
      />
    </div>
  );
}

export default Recipient;
