var express = require('express');
var router = express.Router();

var authUserMW = require('../middlewares/general/authUser');
var authEditorMW = require('../middlewares/general/authEditor');
var authAdminMW = require('../middlewares/general/authAdmin');
var authSuperAdminMW = require('../middlewares/general/authSuperAdmin');

var findAllTenderMW = require('../middlewares/tender/findAllTender');
var findTenderByIdMW = require('../middlewares/tender/findTenderbyId');
var updateTenderMW = require('../middlewares/tender/updateTender');
var deleteTenderMW = require('../middlewares/tender/deleteTender');

var addTenderPartMW = require('../middlewares/tender/addTenderPart');
var updateTenderPartMW = require('../middlewares/tender/updateTendetPart');
var findTenderPartsMW = require('../middlewares/tender/findAllTenderPartsbyTenderId');
var findTenderPartbyIDMW = require('../middlewares/tender/findTenderPartbyId');
var deleteTenderPartMW = require('../middlewares/tender/deleteTenderPart');

var redirectPrevMW = require('../middlewares/general/redirectPrev');
var renderMW = require('../middlewares/general/render');
var redirectMW = require('../middlewares/general/redirect');

var downloadTenderImageMW = require('../middlewares/filehandler/downloadTenderImage');
var updateTenderImageMW = require('../middlewares/filehandler/updateTenderImage');
var updateTenderAttachmentsMW = require('../middlewares/filehandler/updateTenderAttachments');

var UserModel = require('../models/users');
var TenderModel = require('../models/tenders');
var TenderPartModel = require('../models/tender_parts');
var TenderAttachmentModel = require('../models/tender_attachments');

var objectRepository = {
    userModel: UserModel,
    tenderModel: TenderModel,
    tenderPartModel: TenderPartModel,
    tenderAttachmentModel: TenderAttachmentModel
};

/* GET active tenders list */
router.get('/active',
    findAllTenderMW(objectRepository, 'active'),
    renderMW(objectRepository, 'tenderList')
);

/* GET all tenders list */
router.get('/all',
    authAdminMW(objectRepository),
    findAllTenderMW(objectRepository, 'all'),
    renderMW(objectRepository, 'tenderList')
);

/* GET new tender form */
router.get('/add',
    authEditorMW(objectRepository),
    renderMW(objectRepository, 'tenderAdd')
);

/* POST delete tender */
// TODO: Delete tender_parts, apps, app_parts too
router.post('/:id/del',
    authSuperAdminMW(objectRepository),
    findTenderByIdMW(objectRepository),
    deleteTenderMW(objectRepository),
    redirectMW(objectRepository, "tender/all")
);

/* POST modify tender */
router.post('/:id/mod',
    authEditorMW(objectRepository),
    findTenderByIdMW(objectRepository),
    updateTenderMW(objectRepository),
    updateTenderImageMW(objectRepository),
    updateTenderAttachmentsMW(objectRepository),
    redirectPrevMW(objectRepository)
);

/* GET tender's application list */
router.get('/:id/app',
    authAdminMW(objectRepository),
    renderMW(objectRepository, 'appList')
);

/* GET tender's parts list */
router.get('/:id/part',
    authAdminMW(objectRepository),
    findTenderByIdMW(objectRepository),
    findTenderPartsMW(objectRepository),
    renderMW(objectRepository, 'tenderParts')
);

/* POST add tender's new part */
router.post('/:id/part/add',
    authAdminMW(objectRepository),
    findTenderByIdMW(objectRepository),
    addTenderPartMW(objectRepository),
    updateTenderPartMW(objectRepository)            // also refresh page
);

/* POST mod tender's part */
router.post('/:id/part/:partId/mod',
    authAdminMW(objectRepository),
    findTenderByIdMW(objectRepository),
    findTenderPartbyIDMW(objectRepository),
    updateTenderPartMW(objectRepository)            // also refresh page
);

/* POST del tender's part */
router.post('/:id/part/:partId/del',
    authSuperAdminMW(objectRepository),
    findTenderByIdMW(objectRepository),
    findTenderPartbyIDMW(objectRepository),
    deleteTenderPartMW(objectRepository)            // also refresh page
);

/* GET tender's page */
router.get('/:id',
    findTenderByIdMW(objectRepository),
    renderMW(objectRepository, 'tender')
);

router.get('/:id/img',
    downloadTenderImageMW(objectRepository)
);

module.exports = router;