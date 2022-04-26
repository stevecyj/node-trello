const headers = require("../service/headers");
const handleSuccess = require("../service/handleSuccess");
const handleError = require("../service/handleError");
const Posts = require("../model/posts");

const routes = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (req.url === "/posts" && req.method === "GET") {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
    res.end();
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        if (data.content) {
          const newPost = await Posts.create({
            name: data.name,
            content: data.content,
            tags: data.tags,
            type: data.type,
          });
          handleSuccess(res, newPost);
        } else {
          handleError(res);
        }
      } catch (err) {
        handleError(res, err);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

module.exports = routes;
