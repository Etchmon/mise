// Imports
import clientPromise from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function deleteCookbook(req, res) {
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

    const { id } = JSON.parse(req.body);

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid cookbook ID' });
    }

    // Ownership check — only the cookbook's owner may delete it
    const ownedIds = (session.user.cookbooks?.myBooks || []).map(String);
    if (!ownedIds.includes(id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const client = await clientPromise;
        const db = await client.db("CBD");
        const collection = await db.collection("Cookbooks");

        // Delete the cookbook in the database
        const result = await collection.findOneAndDelete(
            { _id: new ObjectId(id) }
        );

        if (result.modifiedCount === 0) {
            //  If no matching cookbook found, return not found status
            res.status(404).json({ message: 'Cookbook not found' });
            return;
        }

        res.status(200).json({ message: 'Cookbook deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}