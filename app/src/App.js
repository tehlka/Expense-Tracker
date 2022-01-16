import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Login from './components/Login/login';
import Dashboard from './components/Dashboard/dashboard';
import My404Component from './components/404/my404component';
import AddTransaction from './components/transaction/addTransaction'
import ShowReminder from "./components/reminder/showReminder";
import ShowTransaction from "./components/transaction/showTransaction";
import AddReminder from "./components/reminder/addReminder";
import SpendAnalytics from "./components/spendAnalytics/spendAnalytics";

function App() {
    return (
    <Router>
        <Switch>
            <Route component={Login} exact path="/" />
            <Route component={Dashboard} exact path="/dashboard" />
            <Route component={AddTransaction} exact path="/add_transaction" />
            <Route component={ShowTransaction} exact path="/show_transaction" />
            <Route component={AddReminder} exact path="/add_reminder" />
            <Route component={ShowReminder} exact path="/show_reminder" />
            <Route component={SpendAnalytics} exact path="/spend_analytics" />
            <Route path='*' exact={true} component={My404Component} />
        </Switch>
    </Router>
    );
}

export default App;