const AWS = require("aws-sdk");
const BUCKET_NAME = process.env.imageUploadBucket;
const s3 = new AWS.S3();

const deleteFiles = async (name) => {
  await s3
    .deleteObject({
      Key: name,
      Bucket: BUCKET_NAME,
    })
    .promise();
  return {};
};

exports.handler = async (event, context) => {
  let body = {};
  const res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: "",
  };

  try {
    const req = JSON.parse(event.body);

    body = await deleteFiles(event.pathParameters.name);

    res.body = JSON.stringify(body);
  } catch (error) {
    res.statusCode = 500;
    res.body = JSON.stringify({ error: error.message });
    console.log(error);
  }

  return res;
};
