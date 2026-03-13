import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import Loading from './loading'

const CookbookEdit = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { cookbook, myRecipes } = props;
    const [recipes, setRecipes] = useState([]);

    const [load, setLoad] = useState(false)

    useEffect(() => {
        const fetchCookBookRecipes = async () => {
            const cookbookId = cookbook._id; // Replace with your actual cookbook ID
            const response = await fetch(`/api/recipe/getCookbookRecipes?cookbookId=${cookbookId}`);
            const data = await response.json();
            setRecipes(data);
        };
        fetchCookBookRecipes();
        setValue({ title: cookbook.title, description: cookbook.description });
        setLoad(true);
    }, []);

    const [value, setValue] = useState({
        title: '',
        description: ''
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        recipes: [],
    });


    const handleChange = (event) => {
        setValue({ ...value, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { title, description } = value;

        // Perform input validation
        let validationErrors = {};
        let isValid = true;

        if (title.trim() === "") {
            validationErrors.title = "Title is required";
            isValid = false;
        } else if (title.trim().length < 3) {
            validationErrors.title = "Title must be at least 3 characters long";
            isValid = false;
        }

        if (description.trim() === "") {
            validationErrors.description = "Description is required";
            isValid = false;
        }

        if (recipes.length === 0) {
            validationErrors.recipes = "At least 1 recipe is required";
            isValid = false;
        }


        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const res = await fetch('/api/cookbook/update', {
            method: 'PUT',
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: cookbook._id,
                title: value.title,
                description: value.description,
                recipes: recipes
            }),
        });
        await res.json();
        router.push('/dashboard')
    }

    const addToBook = (event, recipe) => {
        event.preventDefault();
        if (recipes.includes(recipe)) return;
        setRecipes([...recipes, recipe]);
    };

    const removeFromBook = (event, recipe) => {
        event.preventDefault();
        const filteredArray = recipes.filter(item => item !== recipe)
        setRecipes([...filteredArray]);
    };

    if (!recipes) {
        return <Loading />;
    }

    return (
        <div className={`bg-stone-950 h-screen text-stone-200 flex flex-col ${load ? 'opacity-100 transition-opacity duration-500 ease-in-out' : 'opacity-0'
            }`}>
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-0 mt-10">
                <form className="w-full sm:w-1/2 mx-auto" noValidate>
                    <h1 className="text-3xl font-bold mb-4 text-red-400">Edit Cookbook</h1>

                    <label className="block mb-4">
                        <span className="text-lg font-semibold text-stone-200">Cookbook name:</span>
                        <input
                            type="text"
                            name="title"
                            className="block w-full bg-stone-800 border-stone-600 border-2 py-2 px-4 rounded-lg mt-2 text-stone-100"
                            value={value.title}
                            onChange={handleChange}
                            aria-required="true"
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? "title-error" : undefined}
                        />
                        {errors.title && <p id="title-error" role="alert" className="text-red-400 text-sm mt-1">{errors.title}</p>}
                    </label>

                    <label className="block mb-4">
                        <span className="text-lg font-semibold text-stone-200">Description:</span>
                        <textarea
                            name="description"
                            className="block w-full bg-stone-800 border-stone-600 border-2 py-2 px-4 rounded-lg mt-2 text-stone-100"
                            value={value.description}
                            onChange={handleChange}
                            aria-required="true"
                        />
                        {errors.description && <p role="alert" className="text-red-400 text-sm mt-1">{errors.description}</p>}
                    </label>

                    <button className="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-500 w-full sm:w-auto font-semibold" onClick={handleSubmit}>Save Changes</button>
                </form>
            </div>

            <div className="flex-1 flex flex-wrap grid grid-cols-2 mt-8 justify-center items-center">
                <div className="h-full w-full overflow-y-auto pr-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">My Recipes</h2>
                    <ul className="pl-8 inline-block max-width-content items-center">
                        {myRecipes.map(recipe => (
                            <li key={recipe._id} className='text-start mb-2 flex items-center gap-2'>
                                <button
                                    aria-label={`Add ${recipe.title} to cookbook`}
                                    className="p-2 min-w-[2rem] min-h-[2rem] rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center"
                                    onClick={(e) => addToBook(e, recipe)}
                                >+</button>
                                {recipe.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="h-full w-full overflow-y-auto pr-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">In this Cookbook</h2>
                    <ul className="pl-8 inline-block max-width-content items-center">
                        {recipes.map((recipe) => (
                            <li key={recipe._id} className="mb-2 text-start flex items-center gap-2">
                                <button
                                    aria-label={`Remove ${recipe.title} from cookbook`}
                                    className="p-2 min-w-[2rem] min-h-[2rem] rounded-lg bg-red-700 hover:bg-red-600 text-white flex items-center justify-center"
                                    onClick={(e) => removeFromBook(e, recipe)}
                                >-</button>
                                {recipe.title}
                            </li>
                        ))}
                    </ul>
                    {errors.recipes && <p role="alert" className="text-red-400 text-sm mt-2">{errors.recipes}</p>}
                </div>
            </div>
        </div>
    )
}

export default CookbookEdit;
