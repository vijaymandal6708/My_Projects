import { useEffect,useState } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';


const userGetAllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const getUsers = async()=>{
          setLoading(true);
        try {
          const token = Cookies.get("jwt");
          const response = await axios.get("/api/user/getUserInfo", {
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          setAllUsers(response.data);
          setLoading(false);
        } catch (error) {
          console.log("Error in userGetAllUsers"+error); 
        }
        };
        getUsers();
    },[]);
  return [allUsers, loading];
}

export default userGetAllUsers
