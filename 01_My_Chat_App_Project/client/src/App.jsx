import Left from "./home/left/Left";
import Logout from "./home/left1/Logout";
import Right from "./home/right/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Navigate, Route,Routes } from "react-router-dom";


function App() {
    const [authUser, setAuthUser] = useAuth();
    console.log(authUser);
  return (
    <>
      <Routes>
        <Route
          path="/" 
          element={authUser ? (
           <div className="flex h-screen">
             <Logout></Logout>
             <Left></Left>
             <Right></Right>
           </div>
          ): (
            <Navigate to={"/login"} />
          )}
        />
        <Route path="/login" element={authUser ? <Navigate to={"/"}/> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to={"/"}/> : <Signup />} />
      </Routes>
    </>
  );
}

export default App;
