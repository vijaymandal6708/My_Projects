import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    rollno: "",
    name: "",
    city: "",
    fees: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3001/students/edit/${id}`)
      .then((res) => setData(res.data));
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:3001/students/edit/${id}`,
      data
    );
    alert("Data Updated");
    navigate("/update");
  };

  return (
    <div className="page">
      <h2>Edit Student</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input name="rollno" value={data.rollno} onChange={handleChange} />
        <input name="name" value={data.name} onChange={handleChange} />
        <input name="city" value={data.city} onChange={handleChange} />
        <input name="fees" value={data.fees} onChange={handleChange} />
        <button>Update</button>
      </form>
    </div>
  );
};

export default Edit;
