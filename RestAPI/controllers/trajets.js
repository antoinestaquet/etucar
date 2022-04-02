const db = require('../db');

/** 
 * GET 
 * Tous les trajets
 */
exports.getAllTrajets = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM trajet');
        res.status(200).json(rows);
    } catch (err) {
        res.status(204).json({ error: "No content" });
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
        return res.status(400).json({ error: "Bad parameters" })
    }

    let query = "SELECT * FROM TRAJET " +
        "WHERE LOWER(lieu_depart) LIKE LOWER($1) " +
        "and LOWER(lieu_arrivee) LIKE LOWER($2) " +
        "and DATE(date_depart) = $3";
    try {
        const { rows } = await db.query(query, ['%'+lieu_depart+'%', '%'+lieu_arrivee+'%', date_depart]);
        const trajets = rows;

        if (trajets.length == 0) {
            return res.status(204).json({ error: "No content" });
        }

        for (let i = 0; i < trajets.length; i++) {
            try {
                const { rows } = await db.query("SELECT nom, prenom FROM utilisateur WHERE id = $1", [trajets[i].id_conducteur]);
                const user = rows;

                if (user.length == 0) {
                    return res.status(204).json({ error: "Pas d'utilisateur trouvé" });
                }

                trajets[i].conducteur = user[0];
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: err });
            }
        }
        res.status = 200;
        res.json(trajets);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

/** 
 * GET 
 * Retourne un trajet grace à son id
 */
exports.getTrajet = async (req, res, next) => {
    const { id } = req.params;
    try {
        let { rows } = await db.query('SELECT * FROM trajet WHERE id = $1', [id]);
        let reponse = rows[0];
        if (reponse.length == 0) {
            return res.status(204).json({ error: "Pas de trajet." });
        }

        // récupère le nom / prenom du conducteur
        rows = await db.query('SELECT nom, prenom FROM utilisateur WHERE id = $1', [reponse.id_conducteur]);
        let user = rows.rows;
        if (rows.length == 0) {
            return res.status(204).json({ error: "Pas d'utilisateur correspondant au trajet." });
        }
        reponse.user = {
            nom: user[0].nom,
            prenom: user[0].prenom
        }

        // récupère le véhicule du conducteur
        rows = await db.query('SELECT nom FROM vehicule WHERE id_utilisateur = $1', [reponse.id_conducteur]);
        let vehicule = rows.rows;

        reponse.vehicule = {
            nom: vehicule[0].nom
        };

        res.status(200).json(reponse);
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

    console.log(req.body);

    if (id_conducteur == undefined || lieu_depart == undefined || lieu_arrivee == undefined
        || date_depart == undefined || date_arrivee == undefined || prix_passager == undefined
        || nombre_place == undefined) {
        return res.status(400).json({ error: "Bad request" });
    }


    if (req.body.id_conducteur !== req.auth.userId) {
        return res.status(401).json({ error: "Utilisateur non authorisé." })
    }

    let query = "INSERT INTO trajet(id_conducteur, lieu_depart, lieu_arrivee, date_depart, date_arrivee, prix_passager, nombre_place, information) " +
        "VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
    try {
        db.query(query, [
            id_conducteur,
            lieu_depart,
            lieu_arrivee,
            date_depart,
            date_arrivee,
            prix_passager * 100,
            nombre_place,
            information]);

        res.status(201).json({ success: "Created" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }

};

/**
 * POST
 * Cree une demande pour rejoindre un trajet
 */
exports.rejoindreTrajet = async (req, res, next) => {

    try {
        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        const { idTrajet } = req.params;
        let { rows } = await db.query('SELECT * FROM trajet WHERE id = $1', [idTrajet]);

        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de trajet" });
        }

        // Si l'utilisateur est déjà dans la liste
        let query = "SELECT * FROM trajet, liste_passager " +
            "WHERE liste_passager.id_trajet = trajet.id " +
            "and liste_passager.id_utilisateur = $1";

        rows = await db.query(query, [req.body.id]);

        if (rows.length != 0) {
            return res.status(401).json({ error: "Requète déjà effectué" });
        }

        query = "INSERT INTO liste_passager(id_utilisateur, id_trajet, status_demande) " +
            "VALUES($1, $2, 'en attente')";
        await db.query(query, [idTrajet, req.body.id]);

        res.status(201).json({ success: "Created" });

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
};

/**
 * Retourne toutes les demandes en attente de l'utilisateur
 */
exports.getDemandesEnAttente = async (req, res, next) => {
    try {
        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        let query = "SELECT u.nom, u.prenom, u.note, t.id_conducteur, " +
        "t.date_depart, t.date_arrivee, t.lieu_depart, t.lieu_arrivee, t.prix "+
        "FROM utilisateur u, trajet t, liste_passager l "+
        "WHERE t.id_conducteur = $1 and l.id_trajet = t.id "+
        "and l.status_demande = 'en attente'";
        const { rows } = await db.query(query, [req.body.id]);

        res.status(200).json(rows);

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err });
    }
}

