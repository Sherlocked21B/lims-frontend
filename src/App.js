import AppBar from "./Components/appBar";
import AddCustomer from "./Components/AddCutomer";
import AddReagent from "./Components/AddReagent";
import AddSample from "./Components/AddSample";
import ImportReagent from "./Components/ImportReagent";
import PendingSample from "./Components/PendingSample";
import AllSample from "./Components/AllSample";
import AllReagent from "./Components/AllReagent";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/login";

function App() {
  const token = localStorage.getItem("token");
    const [isLogin, setLogin] = useState(token ? true : false);

  return isLogin ? (
    <Router>
            <div className="App">
                <AppBar />
                <Route path="/" exact component={PendingSample} />
                <Route path="/addCustomer" component={AddCustomer}/>
                <Route path="/addReagent" component={AddReagent} />
                <Route path="/addSample" component={AddSample} />
                <Route path="/importReagent" component={ImportReagent} />
                <Route path="/allSample" component={AllSample} />
                <Route path="/allReagent" component={AllReagent} />
            </div>
        </Router>
  ):<Login isLogin={isLogin} setLogin = {setLogin}/>
}

export default App;
