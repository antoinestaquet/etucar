var express = require('express');
var router = express.Router();

const db = require('../db');

/* GET tous les trajets */
router.get('/', async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM trajet');
  if( rows.length > 0){
    res.status = 200;
    res.send(rows);
  } else {
      res.status = 204;
      res.send({error: "No content"});
  }
});

/* GET un trajet */
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM trajet WHERE id = $1', [id]);
    if(rows.length > 0){

        res.status = 2000
        res.json(rows[0]);
    } else {
        res.status = 204;
        res.send({error: "No content"});
    }
});



module.exports = router;