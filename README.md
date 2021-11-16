# ProjetIOTMeteo


# DESCRIPTION

Notre projet consiste en la creation d'une plateforme de partage de donnees meteorologiques tel que la temperature, l'humidité , la force du vent ....( ce qu'on aura de dispo).<br>
Nous pourrons ajouter quelques fonctionnalités suplémentaires comme l'ajout de certains esp a nos favoris ce qui les fera apparaitre dans un composant spécifique.<br>
L'ajout d'une application bureau est aussi débattu en interne.

# Ou trouver le projet ?

Le projet se trouve actuellement sur https://valentinbordy.fr/iotMeteo/ et est pleinement fonctionnel.

Si vous souhaitez le déployer sur heroku voici la doc : https://github.com/BordyV/ProjetIOTMeteoDeplHeroku ( sans la partie script broker comme parlé par avec vous par message ).

Si vous souhaitez le lancer en local, n'oubliez pas de vérifier les connections aux bases de données dans ./ApiMeteo/config/dbConfig.js

Il faut vérifier que  app.listen est bien décommentez et que https.createServer soit commenté comme ceci: 

```js 
//const options = {
//    key: fs.readFileSync('./key.pem'),
//  cert: fs.readFileSync('./cert.pem'),
//  passphrase: 'xxxxh'
//};
//https.createServer(options, app).listen(port);
app.listen(port, () => console.log(`http://localhost:${port}/`));
```

et aussi le lien de l'api dans ./VraiFront/src/component/confApi.js 

Après vérification il faut installer les packages npm et lancer l'api et le VraiFront dans 2 terminaux différents:

dans ./ApiMeteo/* faire :

```sh
npm i
```

puis: 
```sh
npm run dev
```
dans ./VraiFront/* faire : 

```sh
npm i
```

puis: 
```sh
npm run serve
```

Vous aurez donc accès au projet.

Pour la partie broker c'est pareil il faut executer via pm2 ( gestionnaire de processus node ) le script node_iot_prod. A noter qu'il faut vérifier la configuration du broker.

# PLAN

## Etape 1:
Realisation de l'esp qui recoltera les donnees meteo. L'esp contiendra un capteur de température, un capteur de lumière, un capteur d'humidité et un capteur de pression.

## Etape 2:
Realisation d'une api qui recupere les donnees et les stock en base.
Realisation d'une interface permettant de visualiser les donnees meteo.

## Etape 3:
Interface ou l'on peut voir les donnees issus dautres reseaux.
Creation d'alerte en fonction de la zone geographique et de la meteo.

## Etape 4:
Mise en place d'un systeme de qualité afin de verifier et lisser les donnees.

# Planning

Le planning ne suivra pas forcement les étapes étant donné que nous sommes dépendant des livraisons de matériels.

12/04 Réalisation de/des l'esp en fonction des pieces deja en notre possession <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Commande des autres pièces: anémomètre, capteurs de pression/altitude etc <br>
13/04 Debut du front/du back, création de l'API. <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Connexion des esp a l'API et reception des données <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Affichage des données sur le front <br>
XX/04 Reception du nouveau matériel, ajout des nouveaux capteurs <br>
+1/04 Ajout des nouvelles valeurs a l'API <br>
+3/04 Recherche d'une API pour les données hors de nos régions d'acquisition <br>
+4/04 Connexion de l'API a notre site <br>
+6/04 Rework du front en fonction de l'API choisit <br>
+8/04 Réflexion sur la qualité de nos valeurs et comment les améliorer <br>
+9/04 Amélioration des valeurs et de leur affichage

# TECHNOLOGIE

Pour ce projet nous utiliserons pour le front, vue.js, une technologie facile d'accés et maitrisé par les membres du groupe.<br> 
Pour l'API nous utiliserons Node.js couplé a Express.<br>
Les données seront récupéré sous format json et stocké dans une base de donnée MongoDB.


# ATTRIBUTION

Voir CSV
