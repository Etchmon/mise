import React from 'react';
import RecipeCard from './recipeCard';

const Stream = ({ recipes, showAddButton, updateData, setActiveComponent, setActiveRecipe }) => {

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 gap-2">
                <p className="text-lg">The stream is empty.</p>
                <p className="text-sm">Be the first to add a recipe!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 mb-auto flex-1 h-full content-start grid-auto-rows overflow-y-auto scrollbar-hidden pb-4">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} showAddButton={showAddButton} updateData={updateData} setActiveComponent={setActiveComponent} setActiveRecipe={setActiveRecipe} />
            ))}
        </div>
    );
};

export default Stream;