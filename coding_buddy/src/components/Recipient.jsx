import { useState, useContext } from "react";
import Select from 'react-select';
import { SocketContext } from '../App.js'

function Recipient() {
  const [recipient, setRecipient] = useState(null);
  const { online } = useContext(SocketContext)
  console.log("ONLINE - RECIPIENT.JSX", online)
  return (
    <div className="card d-flex flex-row align-items-center" >
      <label htmlFor="user-name-input" style={{ width: 290 }}>
        Recipient
      </label>
      <Select
        type="text"
        id="recipient-dropdown"
        maxLength={12}
        value={recipient}
        defaultValue={recipient}
        onChange={setRecipient}
        options={online}
      />
    </div>
  );
};

export default Recipient;