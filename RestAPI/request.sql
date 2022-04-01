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
    VALUES(3, 'tata', 'toto', DATE '2022-01-02', DATE '2022-01-03', 500, 3);

-- @BLOCK DROP
DELETE FROm trajet WHERE id = 2;

-- @BLOCK
delete from trajet where lieu_depart = 'val';

-- @BLOCK
select * from trajet;

-- @BLOCK
select * from utilisateur