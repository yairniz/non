/**
 * Created by User on 24/06/2016.
 */

var fs = require('fs');
eval(fs.readFileSync('config/system_vars.js')+'');

module.exports = {
    response : {},
    setResponse : function(response) {
        this.response = response;
    },
    getResponse : function() { return(this.response) },
    getAction : function(route, request) {
        
        var controller_name = route[1];
        var action_name = route[2];
        var route_matches = route[3];
        
        try {
            var controller = require('controllers/' + controller_name + '_controller.js');
        } catch(e) {
            console.error('Controller doesnt exist', controller_name);
            return this.get404();
        }
        
        var action = controller[action_name];
        var action_response;
        var view_filename, view_type;
        
        if (typeof(action) == 'function') {
            
            action_response = action({request:request, matches:route_matches, app:this});
            
            if (request.method == 'POST') { return } // POST Returns the app by callback function
            
            view_type = (action_response && action_response.view_type) ? action_response.view_type : 'html';
            if (action_response && action_response.view) {
                view_filename = action_response.view;
            } else {
                view_filename = VIEWS_PATH + controller_name + '/' + action_name + '.' + view_type; // Default view
            }
            displayView(this.getResponse(), view_filename, view_type);
            
        } else {
            console.error('Action doesnt exist', controller_name);
            this.get404();
        }
    },
    get404 : function() {
        var view_filename = VIEWS_PATH + '404.html';
        getHTML(this.response, view_filename);
    },
    showData : function(data) {
        var res = this.getResponse();
        res.writeHeader(200, {"Content-Type": "text/json"});
        res.write(JSON.stringify(data));
        res.end();
    }
}

function displayView(response, filename, view_type) {
    switch(view_type) {
        case 'html':
            getHTML(response, filename);
            break;
        case 'js':
            getJS(response, filename);
            break;
        case 'css':
            getCSS(response, filename);
            break;
        case 'json':
            getJSON(response, filename);
            break;
    }
}

function getHTML(response, filename) {
    returnResponse(response, filename, "text/html")
}

function getJS(response, filename) {
    returnResponse(response, filename, "text/javascript")
}

function getCSS(response, filename) {
    returnResponse(response, filename, "text/css")
}

function getJSON(response, filename) {
    returnResponse(response, filename, "text/json")
}

function returnResponse(response, filename, content_type) {

    fs.readFile(filename, function (err, contents) {
        if (err) {
            throw err;
        }

        response.writeHeader(200, {"Content-Type": content_type});
        response.write(contents);
        response.end();

    });
}
