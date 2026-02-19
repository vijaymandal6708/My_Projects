import { useEffect,useState } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';


const userGetAllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState([]);
    useEffect(()=>{
        const getUsers = async()=>{
          setLoading(true);
        try {
          const token = Cookies.get("jwt");
          await axios.get("/api/user/getUserInfo", {
            Credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          setAllUsers(Response.data);
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
