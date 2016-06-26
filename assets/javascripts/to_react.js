/**
 * Created by User on 24/06/2016.
 */
const API_URL = "/api/comments";

var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList from_comment_id="0" />
            </div>
        );
    }
});

var ReplyBox = React.createClass({
    getInitialState: function () {
        var is_reply = this.props.is_reply;
        return is_reply ? this.getClosedState() : this.getOpenState();
    },
    getClosedState: function () {
        return {text: 'Reply', reply_form: ''};
    },
    getOpenState: function () {
        return {text: 'Close', reply_form:(<CommentForm comment_id={this.props.comment_id} onCommentSubmit={this.handleCommentSubmit} />)};
    },
    handleCommentSubmit: function(comment) {
        this.handleClick();
        return this.props.callback(comment);
    },
    handleClick: function () {
        var open = (this.state.text == 'Reply');
        if (open) {
            this.setState(this.getOpenState());
        } else {
            this.setState(this.getClosedState());
        }
    },
    render: function () {
        return (
            <div className="replyBox">
                <div className="replyText link" onClick={this.handleClick}>{this.state.text}</div>
                {this.state.reply_form}
            </div>
        )
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', text: ''};
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text, comment_id:this.props.comment_id});
        this.setState({author: '', text: ''});
    },
    render: function() {
        var title = "Enter your " + (this.props.comment_id > 0 ? 'Reply' : 'Comment');
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <h2>{title}</h2>
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                    className="long"
                />
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        var is_reply = this.props.is_reply;
        var commentList = is_reply ? '' : (<CommentList is_replies="true" data={this.props.replies} from_comment_id={this.props.comment_id} />);
        return (
            <div className="comment">
                {this.props.children}&nbsp;
                    <em className="commentAuthor">
                      {this.props.author}
                </em>
                {commentList}
            </div>
        );
    }
});

var CommentList = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: API_URL,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        if (!this.props.is_replies) {
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        } else {
            this.setState({data: this.props.data});
        }
    },
    handleCommentSubmit: function(comment) {
        var callback = this.commentSent;
        sendComment(comment, callback);
    },
    commentSent: function(data) {
        this.setState({data: this.state.data.concat([data])});
    },
    render: function() {
        var is_reply = this.props.is_replies;
        var commentNodes = this.state.data.map(function(comment) {
            return (
                <Comment is_reply={is_reply} author={comment.author} comment_id={comment.id} replies={comment.replies || []} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
                <ReplyBox comment_id={this.props.from_comment_id} is_reply={is_reply} callback={this.handleCommentSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox pollInterval="100000" />,
    document.getElementById('content')
);

var sendComment = function(comment, callback) {
    $.ajax({
        url: API_URL,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
            callback(data);
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });
};
