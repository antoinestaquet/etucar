const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { token_secret, mail } = require('../config.json');

const tranport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: mail.user,
        pass: mail.password
    }
})

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
        const hash = await bcrypt.hash(req.body.password, 10);

        let query = "INSERT INTO utilisateur(nom, prenom, email, mot_de_passe, telephone, note) " +
            "VALUES($1, $2, $3, $4, $5, $6)";

        const user = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            mot_de_passe: hash,
            telephone: req.body.telephone,
            note: req.body.note != undefined ? req.body.note : 0
        }
        await db.query(query, [user.nom, user.prenom, user.email, user.mot_de_passe, user.telephone, user.note]);
        if (req.body.nomVehicule) {
            const { rows } = await db.query("SELECT id FROM utilisateur WHERE email = $1", [user.email]);
            const id = rows[0].id;
            let query = "INSERT INTO vehicule(id_utilisateur, nom, nombre_place) VALUES($1, $2, $3)";
            await db.query(query, [id, req.body.nomVehicule, req.body.nombrePlace]);
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
        const { rows } = await db.query("SELECT * FROM utilisateur WHERE email = $1", [req.body.email]);
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
    try {
        console.log(req.body.id);
        const { rows } = await db.query('SELECT id FROM utilisateur WHERE id = $1', [req.body.id]);
        if (rows == undefined || rows.length == 0) {
            return res.status(401).json({ error: "Utilisateur incorrect." })
        }

        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        if (req.body.nouveauMail !== undefined) {
            await db.query('UPDATE utilisateur SET email = $1 WHERE id = $2 ', [req.body.nouveauMail, req.body.id]);
            return res.status(200).json({ success: "Email modifié." })
        } else {
            return res.status(401).json({ error: "Pas d'email spécifié." })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.modifyPhone = async (req, res, next) => {
    try {
        const { rows } = db.query('SELECT id FROM utilisateur WHERE id = $1', req.body.id);
        if (rows.length == 0) {
            return res.status(401).json({ error: "Utilisateur incorrect." })
        }

        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        if (req.body.nouveauTelephone !== undefined) {
            await db.query('UPDATE utilisateur SET telephone = $1 WHERE id = $2 ', [req.body.nouveauTelephone, req.body.id]);
            return res.status(200).json({ success: "Telephone modifié." })
        } else {
            return res.status(401).json({ error: "Pas de telephone spécifié." })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.modifyPassword = async (req, res, next) => {
    try {
        const { rows } = await db.query("SELECT id, mot_de_passe FROM utilisateur WHERE id = $1", [req.body.id]);
        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de compte existant avec cet email." })
        }
        const user = rows[0];

        try {
            const valid = await bcrypt.compare(req.body.password, user.mot_de_passe);

            if (req.body.id !== req.auth.userId) {
                return res.status(401).json({ error: "Utilisateur non authorisé." })
            }

            if (!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect." })
            }

            const hash = await bcrypt.hash(req.body.user.newPassword, 10);

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.forgottenPassword = async (req, res, next) => {
    try {
        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        const { rows } = await db.query("SELECT id FROM utilisateur WHERE email = $1", [req.body.mail]);
        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de compte existant avec cet email." })
        }

        let codeOubli = getRandomInt(1000, 9999);

        console.log(codeOubli);
        await db.query("UPDATE utilisateur SET code_oublie = $1, code_expiration = CURRENT_TIMESTAMP WHERE email = $2", [codeOubli, req.body.mail]);

        tranport.sendMail({
            from: mail.user,
            to: req.body.mail,
            subject: "Etucar - Oublie de mot de passe",
            html: `<h1>Code de vérification<h1>
            <div>${codeOubli}<div>
            `
        })

        res.status(200).json({ succes: `Email envoyé à ${req.body.mail}` });


    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
};

exports.forgottenPasswordChange = async (req, res, next) => {
    try {

        if (req.body.id !== req.auth.userId) {
            return res.status(401).json({ error: "Utilisateur non authorisé." })
        }

        console.log(req.body.mail);
        const { rows } = await db.query("SELECT code_oublie, code_expiration FROM utilisateur WHERE email = $1", [req.body.mail]);

        if (rows.length == 0) {
            return res.status(401).json({ error: "Pas de compte existant avec cet email." })
        }


        if (rows[0].code_expiration === null) {
            return res.status(401).json({ error: "Code expiré." })
        }

        let dateExpiration = new Date(rows[0].code_expiration).valueOf();
        let dateActuel = new Date().valueOf;

        if (dateExpiration >= dateActuel) {
            await db.query("UPDATE utilisateur SET code_oublie = NULL, code_expiration = NULL WHERE email = $1");
            return res.status(401).json({ error: "Code expiré." });
        }

        if (req.body.code === rows[0].code_oublie) {
            return res.status(401).json({ error: "Code incorrect." })
        }

        const hash = await bcrypt.hash(req.body.newPassword, 10);

        await db.query("UPDATE utilisateur SET mot_de_passe = $1 WHERE email = $2", [hash, req.body.mail]);
        await db.query("UPDATE utilisateur SET code_oublie = NULL, code_expiration = NULL WHERE email = $1", [req.body.mail]);

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
};
