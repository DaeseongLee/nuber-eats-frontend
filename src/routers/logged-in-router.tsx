import React from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import Restaurants from '../pages/client/restaurants';

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
    </Route>
]


export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();
    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading ...</span>
            </div>
        )
    }
    return (
        <Router>
            <Header />
            <Switch>
                {data.me.role === "Client" && ClientRoutes}
                <Route path="/my-profile">
                    <h1>commone</h1>
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    )
}