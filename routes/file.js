import fileCtrl from '../ctrls/fileCtrl'
var express = require('express');
var router = express.Router();

router.post('/icon2css', new fileCtrl().icon2Css);

module.exports = router;