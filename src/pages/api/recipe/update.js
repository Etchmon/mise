// Imports
import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';

export default async function updateRecipe(req, res) {
    if (req.method !== 'PUT') {
        // Only allow PUT requests
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    const session = await getSession({ req });
    if (!session) {
        res.status(401).json({ message: 'Not Authenticated' });
        return;
    }

    const { id, title, description, ingredients, instructions } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    try {
        const client = await clientPromise;
        const db = await client.db("CBD");
        const recipeCollection = await db.collection("Recipes");

        // Ownership check — only the recipe's author may update it
        const existing = await recipeCollection.findOne({ _id: new ObjectId(id) });
        if (!existing) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if (existing.author !== session.user.username) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Update the recipe in the database
        const result = await recipeCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title,
                    description,
                    ingredients,
                    instructions,
                },
            }
        );

        if (result.modifiedCount === 0) {
            //  If no matching recipe found, return not found status
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }

        res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }

}



