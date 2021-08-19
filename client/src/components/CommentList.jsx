import React from 'react';

const CommentList = ({comments}) => {

    const renderedComments = comments.map(comment => {
        console.log(comment);
        if (comment.status === "rejected") {
            return (<li key={comment.id}>Comment Rejected</li>);
        } else if (comment.status === "approved") {
            return (<li key={comment.id}>{comment.content}</li>);
        } else if (comment.status === "pending") {
            return (<li key={comment.id}>Pending approval</li>);
        } else {
            return (<li key={comment.id}>Unkown status</li>);
        }
    });

    return (<ul>{renderedComments}</ul>)
}
export default CommentList
