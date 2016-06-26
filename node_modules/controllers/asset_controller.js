/**
 * Created by User on 24/06/2016.
 */

module.exports = {
    js_asset: function(params) {
        return {view:'assets/javascripts/' + params.matches[1], view_type: 'js'};
    },
    css_asset: function(params) {
        return {view:'assets/css/' + params.matches[1], view_type: 'css'};
    }
}