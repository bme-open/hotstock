module.exports = function (objectrepository) {

    return function (req, res, next) {

        res.tpl.app.save(function (err) {
            if (err !== null){
                res.tpl.error.add(err);
                console.log("app update error");
            } else {
                console.log("app update success");
            }
            return next();
        });
    }

};