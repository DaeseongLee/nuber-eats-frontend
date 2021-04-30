import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { Dish } from '../../components/dish';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
    query restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            ok
            error
        }
    }
`

interface IRestaurantParams {
    id: string;
}

export const RestaurantDetail = () => {
    const params = useParams<IRestaurantParams>();
    const { loading, data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId: +params.id,
            }
        }
    });
    const [orderStarted, setOrderStarted] = useState(false);
    const [orderItem, setOrderItem] = useState<CreateOrderItemInput[]>([]);
    const triggerStartOrder = () => {
        setOrderStarted(true);
    };
    const isSelected = (dishId: number) => {
        return Boolean(orderItem.find(order => order.dishId === dishId));
    }
    const addItemToOrder = (dishId: number) => {
        if (isSelected(dishId)) {
            return;
        }
        setOrderItem(current => [{ dishId, }, ...current])
    };

    const removeFromOrder = (dishId: number) => {
        setOrderItem(current => current.filter(dish => dish.dishId !== dishId));
    }
    console.log(orderItem);
    return (
        <div>
            <Helmet>
                <title>{data?.restaurant?.restaurant?.name || ""}</title>
            </Helmet>
            <div className="bg-gray-800 bg-center bg-cover py-48"
                style={{
                    backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`
                }}>
                <div className="bg-white w-3/12 py-8 pl-48">
                    <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                    <h5 className="text-sm font-light mb-2">
                        {data?.restaurant.restaurant?.category?.name}
                    </h5>
                    <h6 className="text-sm font-light">
                        {data?.restaurant.restaurant?.address}
                    </h6>
                </div>
            </div>
            <div className="container pb-32 flex flex-col items-end mt-20">
                <button onClick={triggerStartOrder} className="btn px-10">
                    {orderStarted ? "Ordering" : "Start Order"}
                </button>
                <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.restaurant.restaurant?.menu.map((dish) => (
                        <Dish key={dish.id}
                            isSelected={isSelected(dish.id)}
                            id={dish.id}
                            orderStarted={orderStarted}
                            name={dish.name}
                            description={dish.description}
                            price={dish.price}
                            isCustomer={true}
                            options={dish.options}
                            addItemToOrder={addItemToOrder}
                            removeFromOrder={removeFromOrder} />
                    ))}
                </div>
            </div>
        </div>
    )
};


