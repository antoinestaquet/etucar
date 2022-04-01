var express = require('express');
var router = express.Router();

const db = require('../db');

/* GET tous les trajets */
router.get('/', async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM trajet');
  if (rows.length > 0) {
    res.status = 200;
    res.send(rows);
  } else {
    res.status = 204;
    res.send({ error: "No content" });
  }
});

/**/
/** 
 *  GET recherche les trajets contenant le lieu de départ et d'arrivée passé en paramètre
 * et se passant le même jour que spécifié
 */
router.get('/recherche', async (req, res, next) => {
  const { lieu_depart, lieu_arrivee, date_depart } = req.query;
  if (lieu_depart == undefined || lieu_arrivee == undefined || date_depart == undefined) {
    res.status = 400;
    res.send({ error: "Bad parameters" })
  } else {
    let query = "SELECT * FROM TRAJET " +
      "WHERE lieu_depart LIKE $1 " +
      "and lieu_arrivee LIKE $2 "+
      "and date_depart = $3";
    const { rows } = await db.query(query, ['%' + lieu_depart + '%', '%' + lieu_arrivee + '%', date_depart]);
    if (rows.length > 0) {
      res.status = 200
      res.json(rows);
    } else {
      res.status = 204;
      res.send({ error: "No content" });
    }
  }
})


/* GET un trajet */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM trajet WHERE id = $1', [id]);
  if (rows.length > 0) {
    res.status = 200
    res.json(rows[0]);
  } else {
    res.status = 204;
    res.send({ error: "No content" });
  }
});





module.exports = router;