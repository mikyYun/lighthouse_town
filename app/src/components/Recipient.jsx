import { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { UserListContext } from "../App.js";

function Recipient(props) {
  const { onlineList } = useContext(UserListContext);
  const { changeRecipient, recipient } = props;
  // const { recipient, setRecipient } = useState({ value: "all", label: "all" });
  const [otherUsers, setOtherUsers] = useState([
    { value: "all", label: "all" },
  ]);
  useEffect(() => {
    const updateRecipientsList = () => {
      const option = [{ value: "all", label: "all" }];
      const onlineUsersList = Object.keys(onlineList);
      onlineUsersList.map((onlineUserName) => {
        option.push({ value: onlineUserName, label: onlineUserName });
      });
      return option;
    };

    setOtherUsers(updateRecipientsList());
  }, [onlineList]);

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
