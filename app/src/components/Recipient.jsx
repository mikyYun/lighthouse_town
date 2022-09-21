import Cookies from "universal-cookie";
import { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { UserListContext } from "../App.js";

function Recipient(props) {
  const { onlineList } = useContext(UserListContext);
  const { changeRecipient, recipient } = props;
  const [otherUsers, setOtherUsers] = useState([
    { value: "all", label: "all" },
  ]);
  useEffect(() => {
    const updateRecipientsList = () => {
      const option = [{ value: "all", label: "all" }];
      const onlineUsersList = Object.keys(onlineList);
      const cookie = new Cookies().getAll().userdata
      onlineUsersList.map((onlineUserName) => {
        if (onlineUserName !== cookie.userName && onlineList[onlineUserName] !== undefined) {
          option.push({ value: onlineUserName, label: onlineUserName });
        }
      });
      return option;
    };

    setOtherUsers(updateRecipientsList());
  }, [onlineList, recipient]);

  return (
    <div className="card d-flex flex-row chat-to-container">
      <label htmlFor="user-name-input" className="chat-to">
        Recipient
      </label>
      <Select
        type="text"
        id="pdown"
        maxLength={12}
        defaultValue={{ value: "all", label: "all" }}
        onChange={(e) => changeRecipient(e.value)}
        options={otherUsers}
      />
    </div>
  );
}

export default Recipient;
