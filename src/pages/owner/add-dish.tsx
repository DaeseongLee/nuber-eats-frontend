import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { Button } from "../../components/button";
import { createDish, createDishVariables } from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
    mutation createDish($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`;

interface IForm {
    name: string;
    price: string;
    description: string;
}

interface IParams {
    restaurantId: string;
}
export const AddDish = () => {
    const { restaurantId } = useParams<IParams>();
    const history = useHistory();
    const [createDishMutation, { loading, error }] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
        refetchQueries: [ //dish를 만드는 즉시 query를 refech해와서 cache에 넣는다.
            {
                query: MY_RESTAURANT_QUERY,
                variables: {
                    input: {
                        id: +restaurantId
                    },
                },
            },
        ],
    });
    const { register, handleSubmit, formState, getValues } = useForm<IForm>({ mode: "onChange" });
    const onSubmit = () => {
        const { name, price, description } = getValues();
        console.log(name, price, description, restaurantId);
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +restaurantId,
                },
            },
        });

        history.goBack();
    }
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Dish | Nuber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input {...register("name", { required: "Name is required.", minLength: 5 })}
                    className="input" type="text" name="name" placeholder="Name" />
                <input {...register("price", { required: "Price is required." })}
                    className="input" type="number" name="price" placeholder="Price" min={0} />
                <input {...register("description", { required: "Description is required.", minLength: 5 })} className="input" type="text"
                    name="description" placeholder="Description" />
                <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
            </form>
        </div>
    )
}