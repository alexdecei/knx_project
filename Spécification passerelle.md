# Spécification de la passerelle KNX

## Rappel

Se connecter au routeur ```Esir-maquette114``` puis lancer le serveur.


## Requêtes 

| Nom                                          |     Fonction    |
| :-----------:                                | :------------- |
| ```/chenillard```                            | Enclenche le chenillard.  |
| ```/stop```                                  | Arrête le chenillard. |
| ```/vitesse/<insérer_vitesse>```             | Spécifie la vitesse du chenillard.|
| ```/lampe/<insérer_numéro_lampe>/<on/off>``` | Retourne l'historique de l'ensemble des valeurs des capteurs sous forme de ```json```. |