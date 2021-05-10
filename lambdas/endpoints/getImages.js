const AWS = require("aws-sdk");

const BUCKET_NAME = process.env.imageUploadBucket;
const s3 = new AWS.S3();

const getFiles = async () => {
  const files = [];
  const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
  if (data && data.Contents) {
    for (const item of data.Contents) files.push({ name: item.Key });
  }
  return { files };
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
    const method = event.httpMethod;
    const path = event.path;
    // console.log(path);
    const req = JSON.parse(event.body);
    if (path === "/") {
      if (method === "GET") {
        body = await getFiles();
      }
    }
    res.body = JSON.stringify(body);
  } catch (error) {
    res.statusCode = 500;
    res.body = JSON.stringify({ error: error.message });
    console.log(error);
  }

  return res;
};
