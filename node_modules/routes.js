/**
 * Created by User on 24/06/2016.
 */

module.exports = [
    ['\/', 'index', 'index'],
    ['\/js\/([a-z_\/]*.js)', 'asset', 'js_asset'],
    ['\/css\/([a-z_\/]*.css)', 'asset', 'css_asset'],
    ['\/api\/([a-z_\/]*)(\\?_=\\d*)?', 'api', 'data'],
    ['\/bonanza', 'index', 'bonanza'],
    ['\/react', 'index', 'react'],
    ['\/aint', 'noconroller', ''],
    ['\/bint', 'index', 'noactionlikethis'],
];