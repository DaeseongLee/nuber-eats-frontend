import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NotFount } from '../pages/404';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';


export const LoggedOutRouter = () => {
    return (
        <Router>
            <Switch>
                <Route path="/create-account">
                    <CreateAccount />
                </Route>
                <Route path="/" exact>
                    <Login />
                </Route>
                <Route>
                    <NotFount />
                </Route>
            </Switch>
        </Router>
    )
}