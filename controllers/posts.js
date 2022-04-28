const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const handleLocalDate = require('../service/handleLocalDate');
const Posts = require('../model/posts');

const _ = require('lodash');
const fs = require('fs');

const posts = {
  async getCards({ req, res }) {
    const item = fs.readFile('./assets/9wmu2tw6.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      let objData = JSON.parse(data);
      let trelloCARDS = objData.cards;
      let monthCARDS = _.groupBy(
        trelloCARDS,
        ({ dateLastActivity }) => new Date(Date.parse(dateLastActivity)).getMonth() + 1
      );
      // console.log(monthCARDS);
      // console.log(Object.values(monthCARDS));
      // console.log(Object.entries(monthCARDS));
      const result = Object.entries(monthCARDS).map(([month, cards]) => {
        // console.log(cards);
        return { month, nums: cards.length, cards };
      });
      console.log(result);
      handleSuccess(res, result);
    });
    console.log(item);
  },
  async getPosts({ req, res }) {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
    res.end();
  },
  async createPosts({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      const createAt = handleLocalDate();
      // console.log(createAt);
      if (data.content) {
        const newPost = await Posts.create({
          name: data.name,
          content: data.content,
          tags: data.tags,
          type: data.type,
          createAt: createAt,
          updateAt: createAt,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async deletePosts({ req, res }) {
    const deleteResult = await Posts.deleteMany({});
    handleSuccess(res, deleteResult);
  },
  async deleteSinglePost({ req, res }) {
    const id = req.url.split('/').pop();
    try {
      const deleteResult = await Posts.findByIdAndDelete(id);
      // console.log(deleteResult);
      if (deleteResult) {
        handleSuccess(res, deleteResult);
      } else {
        handleError(res, deleteResult);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async updateSinglePost({ req, res, body }) {
    const id = req.url.split('/').pop();
    const post = JSON.parse(body);
    try {
      if (post.hasOwnProperty('content') && post.content === '') {
        handleError(res);
      } else {
        const updateResult = await Posts.findByIdAndUpdate(id, {
          ...post,
          updateAt: handleLocalDate(),
        });
        if (updateResult) {
          handleSuccess(res, updateResult);
        } else {
          handleError(res, updateResult);
        }
      }
    } catch (err) {
      handleError(res, err);
    }
  },
};

module.exports = posts;
