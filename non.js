console.log("Starting Node server!");

//Lets require/import the HTTP module
var http = require('http');
var url  = require('url');
var fs = require('fs');
eval(fs.readFileSync('config/system_vars.js')+'');
var app = require('controllers/app_controller');
var routes = require('routes');
var server = http.createServer(handleRequest);


//We need a function which handles requests and send response
function handleRequest(request, response){
    console.log("Path hit server %s", request.url);
    var route = match_routes(request.url);
    if(route) {
        app.setResponse(response);
        app.getAction(route, request);
    } else {
        console.log("No route matches %s", request.url);
        app.get404(response);
    }
}

function match_routes(url) {
    var i;
    var route;
    var route_reg;
    var matches;
    for (i = 0; i < routes.length; i++) {
        route = routes[i];
        route_reg = route[0];
        matches = url.match('^' + route_reg + '$','i');
        if(matches) {
            route.push(matches);
            return route;
        }
    }
    return false;
}


server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

