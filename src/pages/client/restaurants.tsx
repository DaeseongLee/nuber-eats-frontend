import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';

const RESTAURANT_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!){
        allCategories {
            ok
            error
            categories {
                id
                name
                coverImg
                slug
                restaurantCount
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                id
                name
                coverImg
                category{
                    name
                }
                address
                isPromoted
            }
        }
    }
`

const Restaurants = () => {
    const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                page: 1,
            },
        },
    });
    console.log(data);
    return (<h1>Restaurants</h1>
    )
};

export default Restaurants;