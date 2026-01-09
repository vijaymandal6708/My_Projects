import React, { useState } from "react";
import axios from "axios";

const Insert = () => {
  const [frmData, setFrmData] = useState({});

  const handleInput = (e) => {
    setFrmData({ ...frmData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:3001/students/create",
      frmData
    );
    alert(res.data);
  };

  return (
    <div className="page">
      <h2>Insert Student Data</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input type="text" name="rollno" placeholder="Roll No" onChange={handleInput} />
        <input type="text" name="name" placeholder="Name" onChange={handleInput} />
        <input type="text" name="city" placeholder="City" onChange={handleInput} />
        <input type="text" name="fees" placeholder="Fees" onChange={handleInput} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Insert;
