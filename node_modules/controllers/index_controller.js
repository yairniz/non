/**
 * Created by User on 24/06/2016.
 */

module.exports = {
    index: function(params) {
        return {a:1,b:2}
    },
    react: function(params) { },
    bonanza: function(params) {
        return {view:'views/index/not_action_name.html'};
    },
    404 : function(params) {
        return {};
    }
}