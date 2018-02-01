var express = require('express');
var router = express.Router();

var renderMW = require('../middlewares/general/render');
var authMW = require('../middlewares/general/authUser');
var updateUser = require('../middlewares/user/updateUser');

var UserModel = require('../models/users');
var NewsModel = require('../models/news');

var objectRepository = {
    userModel: UserModel,
    newsModel: NewsModel
};

router.get('/',
    function (req,res,next) {

        res.tpl.newses = [];

        var news = {
            _id: 0,
            title: 'Title',
            short_description: 'This is a news card with its short version of the full article, the full content.',
            publish_datetime: '2018-01-01'
        };
        res.tpl.newses.push(news);

        return next();
    },
    renderMW(objectRepository, 'index')
);

router.get('/about',
    renderMW(objectRepository, 'about')
);

module.exports = router;