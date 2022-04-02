/*

Vehicule(PK: idVehicule, nom, nombreDePlace, FK: idUtilisateurs)
Utilisateurs(PK: idUtilisateur, nom, prenom, motDePasse, telephone, note, FK: idVehicule)
Trajet(PK: idTrajet, lieuDepart, lieuArrive, dateDepart, dateArrivee, prixPassager, nombreDePlace, information, note, FK: Conducteur)
ListePassager(PK: idUtilisateur,PK: idTrajet)
*/

-- Création des tables
/*
    Utilisation de l'exension SQLTools
    Necessité de retirer des contraintes pour les réinsérer par la suite via un alter table
*/

-- @BLOCK
CREATE TABLE IF NOT EXISTS utilisateur(
    id BIGINT GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone CHAR(15),
    note SMALLINT,
    code_oublie CHAR(4),
    code_expiration TIMESTAMP
);

-- @BLOCK
CREATE TABLE IF NOT EXISTS vehicule(
    id BIGINT GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
    id_utilisateur BIGINT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    nombre_place SMALLINT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id)
);

-- @BLOCK
CREATE TABLE IF NOT EXISTS trajet(
    id BIGINT GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
    id_conducteur BIGINT NOT NULL,
    lieu_depart VARCHAR(50) NOT NULL,
    lieu_arrivee VARCHAR(50) NOT NULL,
    date_depart TIMESTAMP NOT NULL,
    date_arrivee TIMESTAMP NOT NULL,
    prix_passager BIGINT NOT NULL, 
    -- Le prix sera stocké en centimes pour éviter les problèmes lié
    -- aux virgules flottantes
    nombre_place SMALLINT NOT NULL,
    information VARCHAR(255),
    note INT, 
    FOREIGN KEY (id_conducteur) REFERENCES utilisateur(id)
);

-- @BLOCK
CREATE TYPE status AS ENUM ('refus', 'en attente', 'accepté');

CREATE TABLE IF NOT EXISTS liste_passager(
    id_utilisateur BIGINT NOT NULL,
    id_trajet BIGINT NOT NULL,
    status_demande status NOT NULL,
    PRIMARY KEY (id_utilisateur, id_trajet),
    FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur (id),
    FOREIGN KEY (id_trajet)
        REFERENCES trajet (id)
);
