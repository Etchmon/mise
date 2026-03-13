import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';

export default async function addRecipe(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Not Authenticated' });
    }

    if (req.method === 'POST') {
        try {
            const { title, description, ingredients, instructions } = req.body;
            const author = session.user.username; // always use authenticated identity, never trust client-supplied author

            const client = await clientPromise;
            const db = await client.db("CBD");
            const userCollection = await db.collection("Users");
            const recipeCollection = await db.collection("Recipes");

            // If the recipe already exists in the global stream, just add it to the user's collection
            if (req.body._id && ObjectId.isValid(req.body._id)) {
                const existingId = new ObjectId(req.body._id);
                const existingRecipe = await recipeCollection.findOne({ _id: existingId });
                if (existingRecipe) {
                    await userCollection.updateOne(
                        { email: session.user.email },
                        { $addToSet: { "cookbooks.allRecipes": existingId } }
                    );
                    return res.json({ msg: 'Recipe Added' });
                }
            }

            // New recipe — build a plain object; _id is generated here so we control the type
            const recipe = {
                _id: new ObjectId(),
                title,
                description,
                ingredients,
                instructions,
                author,
                comments: []
            };

            await recipeCollection.insertOne(recipe);
            await userCollection.updateOne(
                { email: session.user.email },
                { $addToSet: { "cookbooks.allRecipes": recipe._id } }
            );

            return res.json({ msg: 'Recipe created', recipe });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'An error occurred while adding the recipe' });
        }
    } else {
        return res.status(400).json('Invalid request');
    }
}
