function PostCreated(db, data) {
    console.log('Event PostCreated Received (processing) : ', data);

    const {id, title} = data;
    db.set(id, {id, title, comments: []});

}

module.exports = {PostCreated}
