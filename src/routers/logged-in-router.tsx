import React from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../components/404';
import { Category } from '../pages/client/category';
import { RestaurantDetail } from '../pages/client/restaurantDetail';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';

const commontRoutes = [
    { path: "/confirm", component: <ConfirmEmail />, },
    { path: "/edit-profile", component: <EditProfile />, },
    { path: "/orders/:id", component: <Order />, },
]

const clientRoutes = [
    { path: "/", component: <Restaurants />, },
    { path: "/search", component: <Search />, },
    { path: "/category/:slug", component: <Category />, },
    { path: "/restaurant/:id", component: <RestaurantDetail />, },
];

const ownerRouted = [
    { path: "/", component: <MyRestaurants /> },
    { path: "/add-restaurant", component: <AddRestaurant /> },
    { path: "/restaurant/:id", component: <MyRestaurant /> },
    { path: "/restaurant/:restaurantId/add-dish", component: <AddDish /> },
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
                {data.me.role === "Client" &&
                    clientRoutes.map(route => {
                        console.log(route);
                        return (
                            <Route exact key={route.path} path={route.path}>
                                {route.component}
                            </Route>
                        )
                    })}
                {data.me.role === "Owner" &&
                    ownerRouted.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))}
                {commontRoutes.map(route => (
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                ))}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}