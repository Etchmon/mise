// Imports
import clientPromise from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';


export default async function deleteRecipe(req, res) {
    if (req.method !== 'DELETE') {
        // Only allow DELETE requests
        res.status(405).json({ message: 'Method not Allowed' });
        return;
    }

    const session = await getSession({ req });
    if (!session) {
        res.status(401).json({ message: 'Not Authenticated' });
        return;
    }


    const { id } = req.body;

    try {
        const client = await clientPromise;
        const db = await client.db("CBD");
        const collection = await db.collection("Recipes");

        // Fetch the recipe first to verify ownership before deleting
        const recipe = await collection.findOne({ _id: new ObjectId(id) });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Only the recipe's author may delete it
        if (recipe.author !== session.user.username) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await collection.deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}