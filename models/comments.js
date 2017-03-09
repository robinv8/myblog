/**
 * Created by ren on 09/03/2017.
 */
'use strict';
var marked=require('marked');
var Comment=require('../lib/mongo').Comment;

// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

module.exports={
  create:(comment)=>{
    return Comment.create(comment).exec();
  },

  delCommentById:(commentId,author)=>{
    return Comment.remove({author:author,_id:commentId}).exec();
  },
  delCommentsByPostId:(postId)=>{
    return Comment.remove({postId:postId}).exec();
  },
  getComments:(postId)=>{
    return Comment.find({postId:postId})
      .populate({path:'author',model:'User'})
      .sort({_id:1})
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  getCommentsCount:(postId)=>{
    return Comment.count({postId:postId}).exec();
  }
}