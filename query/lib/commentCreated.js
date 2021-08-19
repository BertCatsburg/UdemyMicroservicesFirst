function CommentCreated(db, data) {


// * just add the comment to the existing array of comments in this post
    console.log('Event CommentCreated Received (processing) : ', data);

    const {id, content, postId, status} = data;
    const post = db.get(postId);
    const {comments} = post || [];
    comments.push({id, content, status});
    const newPost = {
        ...post,
        comments
    }
    db.set(postId, newPost);
}

module.exports = {CommentCreated}
