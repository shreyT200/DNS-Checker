const express = require('express')

const router = express.Router();
const {propagate} = require('../controller/propogate')

router.get('/', propagate); 



module.exports = router;