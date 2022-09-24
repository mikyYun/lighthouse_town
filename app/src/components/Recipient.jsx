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
      onlineUsersList.forEach((onlineUserName) => {
        if (onlineUserName !== cookie.userName && onlineList[onlineUserName] !== undefined) {
          option.push({ value: onlineUserName, label: onlineUserName });
        }
      });
      return option;
    };

    setOtherUsers(updateRecipientsList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineList]);

  return (
    <div className="card d-flex flex-row chat-to-container">
      <label htmlFor="user-name-input" className="chat-to">
        Send to :
      </label>
      <Select
        type="text"
        id="pdown"
        maxLength={12}
        value={recipient ? {value: recipient, label: recipient} : { value: "all", label: "all" }}
        defaultValue={{ value: "all", label: "all" }}
        onChange={(e) => changeRecipient(e.value)}
        options={otherUsers}
      />
    </div>
  );
}

export default Recipient;
