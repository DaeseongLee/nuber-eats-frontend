import { gql, useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
    query category($input: CategoryInput!) {
        category(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category {
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`

interface ICategoryParams {
    slug: string;
}

export const Category = () => {
    const [page, setPate] = useState(1);
    const params = useParams<ICategoryParams>();

    const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page,
                slug: params.slug,
            },
        },
    });
    const onNextPageClick = useCallback(() => setPate(current => current + 1), []);
    const onPrevPageClick = useCallback(() => setPate(current => current - 1), []);
    return (
        <div>
            <Helmet>
                <title>Category | Nuber Eats</title>
            </Helmet>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.category?.restaurants?.map(restaurant => (
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
                            Page {page} of {data?.category?.totalPages}
                        </span>
                        {page !== data?.category?.totalPages ? (
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
    );
}
