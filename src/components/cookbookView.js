import React, { useEffect, useState } from 'react';
import Loading from '../components/loading';
import { useRouter } from 'next/router';

const CookbookView = (props) => {
    const [recipes, setRecipes] = useState(null);
    const { cookbook, setActiveRecipe, setActiveComponent } = props;
    const router = useRouter();

    const handleBack = () => {
        if (setActiveComponent) {
            setActiveComponent('cookbooks');
        } else {
            router.back();
        }
    };

    const handleClick = (recipe) => {
        setActiveRecipe(recipe);
        setActiveComponent('recipeView');
    };

    useEffect(() => {
        const fetchCookBookRecipes = async () => {
            const cookbookId = cookbook._id;
            const response = await fetch(`/api/recipe/getCookbookRecipes?cookbookId=${cookbookId}`);
            const data = await response.json();
            setRecipes(data.filter(item => item !== null));
        };
        fetchCookBookRecipes();
    }, []);

    if (!cookbook || !recipes) {
        return <Loading />;
    }

    return (
        <div className="h-full overflow-y-auto pb-4">
            <button
                onClick={handleBack}
                className="text-stone-500 hover:text-stone-100 text-sm flex items-center gap-1 mb-6 transition-colors"
                aria-label="Go back"
            >
                &#8592; Back
            </button>
            <h1 className="text-3xl font-bold mb-1 text-rose-400">{cookbook.title}</h1>
            {cookbook.description && (
                <p className="text-stone-400 text-sm mb-6">{cookbook.description}</p>
            )}
            <div className="flex flex-col gap-2">
                {recipes.length === 0 && (
                    <p className="text-stone-500 text-sm">No recipes in this cookbook yet.</p>
                )}
                {recipes.map((recipe) => (
                    <button
                        key={recipe.recipeId ?? recipe._id}
                        className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-left hover:border-stone-600 transition-colors w-full"
                        onClick={() => handleClick(recipe)}
                    >
                        <p className="text-stone-100 font-medium text-sm">{recipe.title}</p>
                        {recipe.description && (
                            <p className="text-stone-500 text-xs mt-0.5 truncate">{recipe.description}</p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CookbookView;
