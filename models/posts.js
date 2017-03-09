/**
 * Created by ren on 2017/3/8.
 */
'use strict';
var marked = require('marked');
var Post = require('../lib/mongo').Post;

var CommentModel = require('./comments');

Post.plugin('addCommentsCount', {
  afterFind: (posts) => {
    return Promise.all(posts.map((post) => {
      return CommentModel.getCommentsCount(post._id).then((commentsCount) => {
        post.commentsCount = commentsCount;
        return post;
      })
    }))
  },
  afterFindOne: (post) => {
    return CommentModel.getCommentsCount(post._id).then((commentsCount) => {
      post.commentsCount = commentsCount;
      return post;
    })
  }
})

//将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  //创建一片文章
  create: (post) => {
    return Post.create(post).exec();
  },
  getPostById: (postId) => {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },
  getPosts: (author) => {
    var query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },
  incPv: (postId) => {
    return Post
      .update({_id: postId}, {$inc: {pv: 1}})
      .exec();
  },
  //通过文章 id 获取一篇原生文章（编辑文章）
  getRawPostById: function getRawPostById(postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
      .then((res) => {
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId)
        }
      });
  },
  //通过用户 id 和文章 id 更新一篇文章
  updatePostById: function updatePostById(postId, author, data) {
    return Post.update({author: author, _id: postId}, {$set: data}).exec();
  },

  //通过用户 id 和文章 id 删除一篇文章
  delPostById: function delPostById(postId, author) {
    return Post.remove({author: author, _id: postId}).exec();
  }
}