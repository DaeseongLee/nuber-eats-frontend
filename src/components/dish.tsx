import React from 'react';
import { myRestaurant_myRestaurant_restaurant_menu_options } from '../__generated__/myRestaurant';

interface IDishProps {
    description: string;
    name: string;
    price: number;
    options: myRestaurant_myRestaurant_restaurant_menu_options[] | null;
}
export const Dish: React.FC<IDishProps> = ({ description, name, price, options }) => {
    return (
        <div className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all">
            <div className="mb-5">
                <h3 className="text-lg font-medium ">{name}</h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
            {options?.length !== 0 && (
                <div className="border-2 mt-3">
                    <span className="text-lg font-medium text-red-400">options</span>
                    <div className="mt-2">
                        {options?.map((option, index) => (
                            <div key={index} >
                                <span className="mr-3">{option.name}</span>
                                <span>{option.extra}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div>
    )
}