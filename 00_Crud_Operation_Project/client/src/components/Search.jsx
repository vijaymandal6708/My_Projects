import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [rno, setRno] = useState("");
  const [mydata, setMydata] = useState([]);

  const handleSubmit = async () => {
    const res = await axios.post(
      "http://localhost:3001/students/search",
      { rno }
    );
    setMydata(res.data);
  };

  return (
    <div className="page">
      <h2>Search Student</h2>

      <input
        type="text"
        placeholder="Enter Roll No"
        value={rno}
        onChange={(e) => setRno(e.target.value)}
      />
      <button onClick={handleSubmit}>Search</button>

      <table>
        <thead>
          <tr>
            <th>RollNo</th>
            <th>Name</th>
            <th>City</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody>
          {mydata.map((item) => (
            <tr key={item._id}>
              <td>{item.rollno}</td>
              <td>{item.name}</td>
              <td>{item.city}</td>
              <td>{item.fees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Search;
