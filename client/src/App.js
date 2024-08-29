import { Route, Routes} from "react-router-dom";
import { Login, Signup} from "./pages";
import Home from "./pages/Home";
import LookUp from "./pages/LookUp";
import Collection from "./pages/Collection";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lookup" element={<LookUp />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </div>
  );
}

export default App;