var express = require('express');
var router = express.Router();

const db = require('../db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM trajet');
  res.send(rows[0]);
});

module.exports = router;
