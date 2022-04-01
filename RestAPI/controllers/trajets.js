const db = require('../db');

/** 
 * GET 
 * Tous les trajets
 */
exports.getAllTrajets = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM trajet');
        res.status = 200;
        res.send(rows);
    } catch (err) {
        res.status = 204;
        res.send({ error: "No content" });
    }
};

/** 
 *  GET 
 * Recherche les trajets contenant le lieu de départ et d'arrivée passé en paramètre
 * et se passant le même jour que spécifié
 */
exports.findTrajets = async (req, res, next) => {
    const { lieu_depart, lieu_arrivee, date_depart } = req.query;
    if (lieu_depart == undefined || lieu_arrivee == undefined || date_depart == undefined) {
        res.status = 400;
        res.send({ error: "Bad parameters" })
    } else {
        let query = "SELECT * FROM TRAJET " +
            "WHERE lieu_depart LIKE $1 " +
            "and lieu_arrivee LIKE $2 " +
            "and date_depart = $3";
        try {
            const { rows } = await db.query(query, ['%' + lieu_depart + '%', '%' + lieu_arrivee + '%', date_depart]);
            const trajets = rows;
            if (rows.length > 0) {
                for (let i = 0; i < trajets.length; i++) {
                    try {
                        const { rows } = await db.query("SELECT * FROM utilisateur WHERE id = $1", [trajets[i].id_conducteur]);
                        const user = rows;
                        trajets[i].conducteur = user[0];
                    } catch (err) {
                        console.log(err.stack);
                        res.status = 204;
                        res.send({ error: "No utilisateur found for trajet" });
                    }
                }
                res.status = 200;
                res.json(trajets);
            } else {
                res.status = 204;
                res.send({ error: "No content" });
            }
        } catch (err) {
            console.log("here");
            res.status = 204;
            res.send({ error: "No content" });
        }

    }
};

/** 
 * GET 
 * Retourne un trajet grace à son id
 */
exports.getTrajet = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM trajet WHERE id = $1', [id]);
        if (rows.length > 0) {
            res.status = 200
            res.json(rows[0]);
        } else {
            res.status = 204;
            res.send({ error: "No content" });
        }
    } catch (err) {
        console.log(err.stack);
        res.status = 500 // Internal Server Error
        res.send({ err });
    }
};

/**
 * Post
 * Ajoute le trajet spécifié
 */
exports.createTrajet = async (req, res, next) => {
    const {
        id_conducteur,
        lieu_depart,
        lieu_arrivee,
        date_depart,
        date_arrivee,
        prix_passager,
        nombre_place,
        information
    } = req.body;

    if (id_conducteur == undefined || lieu_depart == undefined || lieu_arrivee == undefined
        || date_depart == undefined || date_arrivee == undefined || prix_passager == undefined
        || nombre_place == undefined) {
        res.status = 400;
        res.send({ error: "Bad request" })
    } else {
        let query = "INSERT INTO trajet(id_conducteur, lieu_depart, lieu_arrivee, date_depart, date_arrivee, prix_passager, nombre_place, information) " +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
        try {
            db.query(query, [
                id_conducteur,
                lieu_depart,
                lieu_arrivee,
                date_depart,
                date_arrivee,
                prix_passager,
                nombre_place,
                information]);

            res.status = 201;
            res.send({ success: "Created" });
        } catch (err) {
            console.log(err);
            res.status = 409;
            res.send({ error: "Not created" })
        }
    }
};

/**
 * POST
 * Cree une demande pour rejoindre un trajet
 */
exports.postRequestJoinTrajet = async (req, res, next) => {
    const { id } = req.params;
    const { rows } = db.query('SELECT * FROM trajet WHERE id = $1', [id]);

    if (rows.length > 0) {
        // TODO
        /**
         * Envoie d'une demande au conducteur
         * 
         * Si le conducteur accepte, ajout de l'utilisateur qui a fait la demande
         * à la liste des passager.
         * Enfin, message à l'utilisateur pour l'informer de la décisison du conducteur.
         */
    } else {
        res.status = 204;
        res.send({ error: "No trajet" });
    }
};