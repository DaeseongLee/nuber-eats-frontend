import { gql, makeVar, useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { authTokenVar } from '../../apollo';
import { CategoryItem } from '../../components/categoryItem';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';

const RESTAURANT_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!){
        allCategories {
            ok
            error
            categories {
              ...CategoryParts
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
              ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`
export interface IFormProps {
    searchTerm: string;
}

export const Restaurants = () => {
    const [page, setPage] = useState(1);
    const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                page,
            },
        },
    });
    const onNextPageClick = useCallback(() => {
        setPage(current => current + 1);
    }, []);
    const onPrevPageClick = useCallback(() => {
        setPage(current => current - 1)
    }, []);

    const { register, getValues, handleSubmit } = useForm<IFormProps>();
    const history = useHistory();
    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        })
    }


    return (
        <div>
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>
            <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
                <input
                    {...register("searchTerm")}
                    name="searchTerm"
                    type="Search"
                    className="input rounded-md border-0 w-3/4 md:w-3/12"
                    placeholder="Search Restaurants..."
                />
            </form>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="flex justify-around max-w-sm mx-auto">
                        {data?.allCategories.categories?.map(category => (
                            <Link key={category.id} to={`/category/${category.slug}`} >
                                <CategoryItem name={category.name} coverImg={category.coverImg} />
                            </Link>
                        ))}
                    </div>
                    <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurants.results?.map(restaurant => (
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                        {page > 1 ? (
                            <button
                                onClick={onPrevPageClick}
                                className="focus:outline-none font-medium text-2xl"
                            >
                                &larr;
                            </button>
                        ) : (<div></div>)}
                        <span>
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages ? (
                            <button
                                onClick={onNextPageClick}
                                className="focus:outline-none font-medium text-2xl"
                            >
                                &rarr;
                            </button>
                        ) : (<div></div>)}
                    </div>
                </div>
            )}
        </div>
    )
};

