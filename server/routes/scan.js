const express = require('express');
const {scanDomain} = require('../controller/scan')
const router = express.Router();
router.get('/', scanDomain)
module.exports = router