import { useState } from "react";
import Select from 'react-select';
const options = [
  { value: 'all', label: 'all' },
  { value: 'moon', label: 'moon' },
  { value: 'mike', label: 'mike' },
  { value: 'heesoo', label: 'heesoo' },
];

function Recipient() {
  const [recipient, setRecipient] = useState(null);

  return (
    <div className="card d-flex flex-row align-items-center">
      <label htmlFor="user-name-input" style={{ width: 60 }}>
        Recipient
      </label>
      <Select
        type="text"
        id="recipient-dropdown"
        maxLength={12}
        value={recipient}
        defaultValue={recipient}
        onChange={setRecipient}
        options={options}
      />
    </div>
  );
}

export default Recipient;