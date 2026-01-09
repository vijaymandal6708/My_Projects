import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import Insert from "./components/Insert";
import Display from "./components/Display";
import Search from "./components/Search";
import Update from "./components/Update";
import Edit from "./components/Edit";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="insert" element={<Insert />} />
        <Route path="display" element={<Display />} />
        <Route path="search" element={<Search />} />
        <Route path="update" element={<Update />} />
        <Route path="edit/:id" element={<Edit />} />
      </Route>
    </Routes>
  );
};

export default App;
