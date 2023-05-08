import Home from "./pages/Home";
import MyFooter from "./components/Footer/MyFooter";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Home />
        <MyFooter />
      </Router>
    </div>
  );
}

export default App;
