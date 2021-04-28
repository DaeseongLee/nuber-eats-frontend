import React from 'react';

interface ICategoryItem {
    name: string;
    coverImg: string | null;
}

export const CategoryItem: React.FC<ICategoryItem> = ({ name, coverImg }) => {
    return (
        <div className="flex flex-col group items-center cursor-pointer" >
            <div className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                style={{ backgroundImage: `url(${coverImg})` }}></div>
            <span className="mt-1 text-sm text-center font-medium">
                {name}
            </span>
        </div>
    )
};

