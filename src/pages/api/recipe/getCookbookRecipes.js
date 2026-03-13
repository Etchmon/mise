import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';


/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function cookbookRecipes(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (req.method === 'GET') {
        const cookbookId = req.query.cookbookId;

        if (!ObjectId.isValid(cookbookId)) {
            return res.status(400).json({ message: 'Invalid cookbook ID' });
        }

        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const collection = await db.collection("Cookbooks");
            const recipeCollection = await db.collection("Recipes");

            const cookbook = await collection.findOne({ _id: new ObjectId(cookbookId) });

            // Deduplicate IDs and fetch all recipes in a single $in query
            const uniqueRecipeIds = [...new Set(cookbook.recipes.map(String))];
            const objectIds = uniqueRecipeIds.map((id) => new ObjectId(id));
            const recipes = await recipeCollection.find({ _id: { $in: objectIds } }).toArray();

            res.status(200).json(recipes);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while retrieving recipes' });
        }
    }
}
