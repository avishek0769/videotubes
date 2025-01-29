import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"
import AWS from "aws-sdk"
import { ApiError } from "./ApiError.js"

dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_2,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_2,
    region: process.env.AWS_REGION
});

const deleteFromCloud = async (publicURL, resourceType) => {
    try {
        let publicID = publicURL.split("/").slice(-2).join("/").split(".")[0];
        const response = await cloudinary.api.delete_resources(
            [publicID],
            { type: 'upload', resource_type: resourceType }
        )
        console.log(response.deleted);
        return response.deleted[`${publicID}`];
    }
    catch (error) {
        throw error;
    }
}

async function deleteFolder(folderPrefix) {
    try {
        // List all objects with the folder prefix
        const listParams = {
            Bucket: "yt-clone.output.video",
            Prefix: folderPrefix
        };

        console.log('Listing objects with params:', listParams);

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        // Debugging output
        console.log('Listed Objects:', listedObjects);

        if (listedObjects.Contents.length === 0) {
            console.log('No objects found with prefix:', folderPrefix);
            return;
        }

        // Delete all objects in the folder
        const deleteParams = {
            Bucket: "yt-clone.output.video",
            Delete: {
                Objects: listedObjects.Contents.map(object => ({ Key: object.Key }))
            }
        };

        console.log('Deleting objects with params:', deleteParams);

        await s3.deleteObjects(deleteParams).promise();
        console.log('Folder deleted successfully');
    }
    catch (error) {
        throw new ApiError(401, "Error in deleting the VIDEO in AWS")
    }
}

async function deleteFile(fileKey) {
    try {
        const deleteParams = {
            Bucket: "thumbnail.bucket",
            Key: fileKey
        };
        await s3.deleteObject(deleteParams).promise();
        console.log(`File ${fileKey} deleted successfully`);
    }
    catch (error) {
        throw new ApiError(401, "Error in deleting the THUMBNAIL in AWS")
    }
}

export { deleteFromCloud, deleteFolder, deleteFile }