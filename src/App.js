import React from 'react';
import './css/App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import MainScreen from "./MainScreen";


class App extends React.Component {
    render() {
        return <div>
            <BrowserRouter>
            <Switch>
                <Route exact path="/" component={MainScreen}/>
                {/*<Route exact path="/:id" component={MainScreen}/>*/}
            </Switch>
            </BrowserRouter>
        </div>;
    }
}

export default App;
