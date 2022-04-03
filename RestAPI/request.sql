-- @BLOCK Get trajet de départ vers destination à une date précise
SELECT * from TRAJET
WHERE lieu_depart LIKE '%tata%'
and lieu_arrivee LIKE '%toto%'
and date_depart = DATE '2022-01-01'


-- @BLOCK
INSERT INTO utilisateur(nom, prenom, mot_de_passe, email)
    VALUES('Valjean', 'Jean', '1234', '1234@4321.com');

-- @BLOCK test
INSERT INTO trajet(id_conducteur, lieu_depart, lieu_arrivee, date_depart, date_arrivee, prix_passager, nombre_place) 
    VALUES(13, 'tata', 'toto', DATE '2022-01-02', DATE '2022-01-03', 500, 3);

-- @BLOCK DROP
DELETE FROm trajet WHERE id = 2;

-- @BLOCK
delete from trajet where lieu_depart = 'val';

-- @BLOCK
select * from trajet;

-- @BLOCK
select * from utilisateur

--@BLOCK
SELECT * FROM trajet, liste_passager
WHERE liste_passager.id_trajet = trajet.id
and liste_passager.id_utilisateur = $1

--@BLOCK
SELECT u.nom, u.prenom, u.note, t.id_conducteur, 
t.date_depart, t.date_arrivee, t.lieu_depart, t.lieu_arrivee, t.prix 
FROM utilisateur u, trajet t, liste_passager l
WHERE t.id_conducteur = $1 and l.id_trajet = t.id
and l.status_demande = 'en attente';

--@BLOCK
--Retourne tous les trajets avec l'utilisateur
SELECT t.* FROM trajet t, liste_passager lp
WHERE t.id_conducteur = 13
OR (lp.id_trajet = t.id AND lp.id_utilisateur = 13)