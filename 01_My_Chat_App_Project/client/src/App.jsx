import Left from "./home/left/Left";
import { BrowserRouter } from "react-router-dom";
import Logout from "./home/left1/Logout";
import Right from "./home/right/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";


function App() {
  return (
    <>
      <BrowserRouter>
        {/* <div className="flex h-screen">
          <Logout></Logout>
          <Left></Left>
          <Right></Right>
        </div> */}

        <Signup></Signup>

        {/* <Login></Login> */}

        {/* <Routes>
          <Route path="/">
            <Route></Route>
          </Route>
        </Routes> */}
      </BrowserRouter>
    </>
  );
}

export default App;
