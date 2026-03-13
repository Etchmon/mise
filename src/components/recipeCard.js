import { React, useState } from 'react';
import { useSession } from 'next-auth/react';

const RecipeCard = ({ recipe, showAddButton, updateData, setActiveComponent, setActiveRecipe }) => {
    const { data: session } = useSession();
    const userRecipes = session.user.cookbooks.allRecipes;
    const [statusMsg, setStatusMsg] = useState('');

    const showStatus = (msg) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const handleAdd = async (recipeId) => {
        if (userRecipes.includes(recipeId)) {
            showStatus('Already in your collection');
            return;
        }
        try {
            const response = await fetch('/api/recipe/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe),
            });
            if (response.ok) {
                if (updateData) updateData();
                showStatus('Added to your collection');
            } else {
                showStatus('Failed to add recipe');
            }
        } catch {
            showStatus('Failed to add recipe');
        }
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        try {
            const response = await fetch('/api/recipe/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: recipeId }),
            });
            if (response.ok) {
                if (updateData) updateData();
            } else {
                showStatus('Failed to delete recipe');
            }
        } catch {
            showStatus('Failed to delete recipe');
        }
    };

    const handleClick = (recipe) => {
        setActiveRecipe(recipe);
        setActiveComponent('recipeView');
    };

    return (
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-stone-600 transition-colors">
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                    <h2 className="text-base font-semibold text-stone-100 truncate">{recipe.title}</h2>
                    <span className="text-stone-500 text-xs whitespace-nowrap shrink-0">by {recipe.author}</span>
                </div>
                {recipe.description && (
                    <p className="text-stone-400 text-sm mb-2 truncate">{recipe.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                        <span
                            key={`${ingredient}-${index}`}
                            className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full"
                        >
                            {ingredient}
                        </span>
                    ))}
                    {recipe.ingredients.length > 5 && (
                        <span className="text-xs text-stone-500 self-center">+{recipe.ingredients.length - 5} more</span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
                <p aria-live="polite" className="text-xs text-stone-400 min-h-[1rem] text-right">{statusMsg}</p>
                <div className="flex gap-2">
                    <button
                        className="bg-rose-600 text-white py-1.5 px-3 rounded hover:bg-rose-500 text-sm font-medium transition-colors"
                        onClick={() => handleClick(recipe)}
                    >
                        View
                    </button>
                    {!showAddButton && (
                        <button
                            aria-label={`Delete ${recipe.title}`}
                            className="bg-stone-800 text-stone-300 py-1.5 px-3 rounded hover:bg-red-700 hover:text-white text-sm transition-colors"
                            onClick={() => handleDelete(recipe._id)}
                        >
                            Delete
                        </button>
                    )}
                    {showAddButton && (
                        <button
                            aria-label={`Add ${recipe.title} to your collection`}
                            className="bg-stone-800 text-stone-300 py-1.5 px-3 rounded hover:bg-rose-600 hover:text-white text-sm transition-colors"
                            onClick={() => handleAdd(recipe._id)}
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
