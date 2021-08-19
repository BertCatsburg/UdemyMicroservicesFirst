function CommentUpdated(db, data) {

    console.log('Event CommentUpdated Received (processing) : ',data);

    const { id, content, postId, status} = data;
    const post = db.get(postId);
    console.log(post);
    const {comments} = post || [];

    let newComments = [];
    if (comments && comments.length > 0) {
        newComments = comments.map((comment) => {
            if (comment.id !== id) {
                return comment;
            } else {
                return {
                    id,
                    content,
                    status
                }
            }
        })
    }
    const newPost = {
        ...post,
        comments: newComments
    }
    db.set(postId, newPost);
}

module.exports = {CommentUpdated}
