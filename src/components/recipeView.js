import React, { useEffect, useState } from 'react';
import Loading from '../components/loading';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const RecipeView = ({ recipeObj, setActiveComponent }) => {
    const recipe = recipeObj;
    const { data: session } = useSession();
    const router = useRouter();
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    if (!session) {
        return <Loading />;
    }

    const handleBack = () => {
        if (setActiveComponent) {
            setActiveComponent('recipes');
        } else {
            router.back();
        }
    };

    return (
        <div className={`h-full overflow-auto pb-4 ${load ? 'opacity-100 transition-opacity duration-500 ease-in-out' : 'opacity-0'}`}>
            <button
                onClick={handleBack}
                className="text-stone-500 hover:text-stone-100 text-sm flex items-center gap-1 mb-6 transition-colors"
                aria-label="Go back"
            >
                &#8592; Back
            </button>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-rose-400 mb-1">{recipe.title}</h1>
                <p className="text-stone-500 text-sm">by {recipe.author}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
                {/* Instructions */}
                <div className="lg:col-span-3 bg-stone-900 border border-stone-800 rounded-lg p-6 overflow-auto">
                    <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-3">
                        {recipe.instructions.map((instruction, index) => (
                            <li key={index} className="text-stone-200 text-sm leading-relaxed">
                                {instruction}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Ingredients */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-6 overflow-auto">
                    <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-stone-200 text-sm flex items-start gap-2">
                                <span className="text-rose-500 mt-0.5">•</span>
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RecipeView;
