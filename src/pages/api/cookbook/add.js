import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';


/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function addCookbook(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (req.method === 'POST') {
        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const cookbookCollection = await db.collection("Cookbooks");
            const userCollection = await db.collection("Users");
            const jsonData = JSON.parse(req.body);

            const cookbook = {
                _id: new ObjectId(),
                title: jsonData.title,
                description: jsonData.description,
                recipes: jsonData.recipes
            };

            // Add cookbook to Cookbooks collection and link its _id to the user's myBooks array
            await cookbookCollection.insertOne(cookbook);
            await userCollection.updateOne(
                { email: session.user.email },
                { $push: { "cookbooks.myBooks": cookbook._id } }
            );

            return res.json({ msg: 'cookbook created', cookbook });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}