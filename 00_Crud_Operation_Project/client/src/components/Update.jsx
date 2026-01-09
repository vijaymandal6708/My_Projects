import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Update = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await axios.get(
      "http://localhost:3001/students/updatedata"
    );
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteData = async (id) => {
    await axios.delete(
      `http://localhost:3001/students/updatedelete?id=${id}`
    );
    loadData();
  };

  return (
    <div className="page">
      <h2>Update / Delete</h2>

      <table>
        <thead>
          <tr>
            <th>RollNo</th>
            <th>Name</th>
            <th>City</th>
            <th>Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s._id}>
              <td>{s.rollno}</td>
              <td>{s.name}</td>
              <td>{s.city}</td>
              <td>{s.fees}</td>
              <td>
                <button onClick={() => navigate(`/edit/${s._id}`)}>
                  Edit
                </button>
                <button onClick={() => deleteData(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Update;
