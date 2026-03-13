import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";


/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function allRecipes(req, res) {
    const session = await getSession({ req });

    if (req.method === 'GET') {
        // Process a GET request
        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const collection = await db.collection("Recipes");
            // Limit results and exclude the instructions field — it's large and not needed for list views.
            // The stream is shuffled client-side, so a rotating sample of 50 is sufficient.
            const results = await collection
                .find({}, { projection: { title: 1, description: 1, ingredients: 1, author: 1 } })
                .limit(50)
                .toArray();
            res.status(200).json(results);
        } catch (e) {
            console.log(e);
        }
    }
}