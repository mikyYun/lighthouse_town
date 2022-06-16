import { useState, useContext, useEffect } from "react";
import Select from 'react-select';
import { SocketContext } from '../App.js'

function Recipient() {
  const [recipient, setRecipient] = useState(null);
  const { online } = useContext(SocketContext)

  console.log("ONLINE - RECIPIENT.JSX", online)
  // const [options, setOptions] = useState([{ value: 'all', label: 'all' }])

  // useEffect(() => {
  //   console.log("SOCKET is recipient triggered?", socket)//

  //   socket.on("all user names", (obj) => {
  //     console.log('obj', obj) // only contains online users
  //     //obj.users = [name1, name2, name3]

  //     // const usersList = []
  //   })
  // }, [socket])

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