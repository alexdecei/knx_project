# Spécification de la passerelle KNX

## Rappel

Se connecter au routeur ```Esir-maquette114``` puis lancer le serveur.


## Requêtes 

| Nom                                          |     Fonction    |
| :-----------                                 | :------------- |
| ```/chenillard```                            | Enclenche le chenillard.  |
| ```/stop```                                  | Arrête le chenillard. |
| ```/inverse```							   | Inverse le sens du chenillard. |
| ```/vitesse/<insérer_vitesse>```             | Spécifie la vitesse du chenillard.|
| ```/lampe/<insérer_numéro_lampe>/<on/off>``` | Allume ou éteint la lampe spécifiée. |
| ```/alllights/<on/off>```					   | Allume ou éteint toutes les lampes. |
| ```/pari/<numero_lampe>```				   | Démarre le jeu de pari avec une mise sur <numeroLampe>. |
| ```/disconnect```							   | Déconnecte de la maquette. |