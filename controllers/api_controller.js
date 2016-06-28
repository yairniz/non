/**
 * Created by User on 24/06/2016.
 */

var fs = require('fs');
var qs = require('querystring');

module.exports = {
    data: function (params) {
        var which_api = params.matches[1];
        var req = params.request;
        var app = params.app;
        if(req.method == 'GET') {
            return {view: 'data/' + which_api + '.json', view_type: 'json'};
        } else if(req.method == 'POST') {
            return saveData(which_api, req, app);
        }
    }
}

var saveData = function(which_api, req, app) {

    var body = '';
    var POST;

    req.on('data', function (data) {
        body += data;
        if (body.length > 1e5) {
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        POST = qs.parse(body);

        switch(which_api) {
            case 'comments':
                var data = saveComments(POST);
                if (data) {
                    return app.showData(data);
                }
            default:
                return {view: 'empty', view_type: 'json'};
        }
    });

};

function saveComments(post_data) {

    var data_file = 'data/comments.json';
    var comments = eval(fs.readFileSync(data_file)+'');
    var comment_id = parseInt(post_data.comment_id);
    var is_reply = (comment_id > 0);
    var i, cur_comment, replies;

    if (!post_data.author || !post_data.text) {
        return(comments);
    }
    var new_comment = {
        id: Date.now(),
        author: post_data.author,
        text: post_data.text
    };

    if (!is_reply) {
        comments.push(new_comment);
    } else {
        for(i=0;i<comments.length;i++) {
            cur_comment = comments[i];
            if(cur_comment.id == comment_id) {
                replies = (cur_comment.replies || []);
                replies.push(new_comment);
                comments[i].replies = replies;
            }
        }
    }

    var comments_parsed = JSON.stringify(comments);
    fs.writeFile(data_file, comments_parsed, function(err) {
        if(err) {
            return console.error(err);
        }
    });

    return (new_comment);
}
