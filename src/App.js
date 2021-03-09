import AppBar from "./Components/appBar";
import AddCustomer from "./Components/AddCutomer";
import AddReagent from "./Components/AddReagent";
import AddTest from "./Components/AddTest";
import ImportReagent from "./Components/ImportReagent";
import PendingSample from "./Components/PendingSample";
import AllSample from "./Components/AllSample";
import AllReagent from "./Components/AllReagent";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/login";
import Register from "./Components/register";

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
                <Route path="/addTest" component={AddTest} />
                <Route path="/importReagent" component={ImportReagent} />
                <Route path="/allSample" component={AllSample} />
                <Route path="/allReagent" component={AllReagent} />
                <Route path ="/register" exact component={Register}/>
            </div>
        </Router>
  ):<Login isLogin={isLogin} setLogin = {setLogin}/>
}

export default App;
