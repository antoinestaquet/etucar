const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { token_secret } = require('../config.json');

exports.getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("SELECT id, id_vehicule, nom, prenom, telephone, note, email FROM utilisateur WHERE id = $1", [id]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(401).json({ error: "No users" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

/**
 * Inscrit un nouvel utilisateur en pensant à hasher le mot de passe
 */
exports.inscription = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.user.password, 10);

        let query = "INSERT INTO utilisateur(nom, prenom, email, mot_de_passe, telephone, note) " +
            "VALUES($1, $2, $3, $4, $5, $6)";

        const user = {
            nom: req.body.user.nom,
            prenom: req.body.user.prenom,
            email: req.body.user.email,
            mot_de_passe: hash,
            telephone: req.body.user.telephone,
            note: req.body.user.note != undefined ? req.body.user.note : 3
        }
        await db.query(query, [user.nom, user.prenom, user.email, user.mot_de_passe, user.telephone, user.note]);
        if (req.body.vehicule != undefined) {
            const { id_utilisateur, nom, nombre_place } = req.body.vehicule;
            let query = "INSERT INTO vehicule(id_utilisateur, nom, nombre_place) VALUES($1, $2, $3)";
            await db.query(query, [id_utilisateur, nom, nombre_place]);
            res.status(201).json({ success: "Created" });
        } else {
            res.status(201).json({ success: "Created" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Not created" })
    }
}

exports.connexion = async (req, res, next) => {
    try {
        const { rows } = await db.query("SELECT id FROM utilisateur WHERE email = $1", [req.body.email]);
        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de compte existant avec cet email." })
        }
        const user = rows[0];

        try {
            const valid = await bcrypt.compare(req.body.password, user.mot_de_passe);
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect." })
            }
            res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id },
                    token_secret,
                    { expiresIn: 60 * 20 }
                )
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.modifyMail = async (req, res, next) => {
    try{
        const { rows } = db.query('SELECT id FROM utilisateur WHERE id = $1', req.body.id);
        if(rows.length == 0){
            return res.status(401).json({ error: "Utilisateur incorrect." })
        }

        if(req.body.id !== req.auth.userId){
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        if(req.body.nouveauMail !== undefined){
            await db.query('UPDATE utilisateur SET email = $1 WHERE id = $2 ', [req.body.nouveauMail, req.body.id]);
            return res.status(200).json({ success: "Email modifié."})
        } else {
            return res.status(401).json({ error: "Pas d'email spécifié." })
        }

    } catch (err){
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.modifyPhone = async (req, res, next) => {
    try{
        const { rows } = db.query('SELECT id FROM utilisateur WHERE id = $1', req.body.id);
        if(rows.length == 0){
            return res.status(401).json({ error: "Utilisateur incorrect." })
        }

        if(req.body.id !== req.auth.userId){
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        if(req.body.nouveauTelephone !== undefined){
            await db.query('UPDATE utilisateur SET telephone = $1 WHERE id = $2 ', [req.body.nouveauTelephone, req.body.id]);
            return res.status(200).json({ success: "Telephone modifié."})
        } else {
            return res.status(401).json({ error: "Pas de telephone spécifié." })
        }

    } catch (err){
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.modifyPassword = async (req, res, next) => {
    try {
        const { rows } = await db.query("SELECT id FROM utilisateur WHERE id = $1", [req.body.id]);
        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de compte existant avec cet email." })
        }
        const user = rows[0];

        try {
            const valid = await bcrypt.compare(req.body.newPassword, user.mot_de_passe);
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect." })
            }

            const hash = await bcrypt.hash(req.body.user.password, 10);

            await db.query("UPDATE utilisateur SET mot_de_passe = $1 WHERE id = $2", [hash, req.body.id]);

            res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id },
                    token_secret,
                    { expiresIn: 60 * 20 }
                ),
                message: "Mot de passe modifié."
            });
            
        } catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};