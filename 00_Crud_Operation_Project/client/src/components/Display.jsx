import React, { useEffect, useState } from "react";
import axios from "axios";

const Display = () => {
  const [mydata, setMydata] = useState([]);

  const loadData = async () => {
    const res = await axios.get("http://localhost:3001/students/display");
    setMydata(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page">
      <h2>Display Records</h2>

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

export default Display;
