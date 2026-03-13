import React from 'react';
import RecipeCard from './recipeCard';


const RecipeList = ({ recipes, showAddButton, setActiveComponent, setActiveRecipe, updateData }) => {

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 gap-2">
                <p className="text-lg">You have no recipes yet.</p>
                <p className="text-sm">Use the Stream to discover recipes, or add your own.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 mb-auto flex-1 h-full w-full content-start grid-auto-rows overflow-y-auto scrollbar-hidden pb-4">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} showAddButton={showAddButton} setActiveComponent={setActiveComponent} setActiveRecipe={setActiveRecipe} updateData={updateData} />
            ))}
        </div>
    );
};

export default RecipeList;
