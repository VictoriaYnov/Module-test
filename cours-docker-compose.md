# Cours Docker Compose

## C'est quoi docker-compose ?

Docker Compose permet de lancer plusieurs conteneurs en même temps avec une seule commande, au lieu de taper plein de commandes `docker` à la main.

```bash
docker-compose up -d --build
```

C'est tout. Un seul fichier `docker-compose.yml` décrit toute l'infrastructure.

---

## Structure du fichier

```yaml
services:
  db:     # service 1 : la base de données
  api:    # service 2 : le serveur Python
  adminer: # service 3 : interface web pour voir la BDD
```

Chaque `service` = un conteneur Docker.

---

## Service `db` — La base de données MySQL

```yaml
db:
  build:
    context: ../my-app
    dockerfile: Dockerfile
  restart: always
  environment:
    - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
  ports:
    - 3306:3306
  volumes:
    - ../my-app/sqlfiles:/docker-entrypoint-initdb.d/
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
    interval: 5s
    retries: 10
```

### `build`
Au lieu d'utiliser une image toute faite, on construit l'image depuis un `Dockerfile`.
- `context` : le dossier où Docker va chercher les fichiers (ici `../my-app`)
- `dockerfile` : le nom du Dockerfile à utiliser

### `restart: always`
Si le conteneur plante, Docker le redémarre automatiquement.

### `environment`
Des variables d'environnement passées au conteneur. MySQL les utilise pour se configurer au démarrage.
`${MYSQL_ROOT_PASSWORD}` est lu depuis le fichier `.env` dans le même dossier que le `docker-compose.yml`.

### `ports`
Format : `port_machine:port_conteneur`
→ `3306:3306` : le port 3306 du conteneur est accessible sur le port 3306 de ta machine.
Utile pour se connecter à MySQL depuis l'extérieur (depuis ton ordi ou Adminer).
**Entre conteneurs, ils communiquent directement sans passer par les ports exposés.**

### `volumes`
Format : `chemin_local:chemin_dans_le_conteneur`
→ `../my-app/sqlfiles:/docker-entrypoint-initdb.d/`

On **monte** le dossier `sqlfiles/` dans le conteneur. MySQL exécute automatiquement tous les fichiers `.sql` présents dans `/docker-entrypoint-initdb.d/` au démarrage.
C'est comme ça que les tables et les données initiales sont créées.

> **Volume de montage** (notre cas) = partager des fichiers entre la machine et le conteneur
> **Volume de persistance** = sauvegarder les données du conteneur pour qu'elles survivent à un redémarrage

### `healthcheck`
Vérifie que le service est vraiment prêt (pas juste démarré).
Docker exécute la commande `test` toutes les `interval` secondes, jusqu'à `retries` tentatives.
Tant que le healthcheck n'est pas passé, le statut du conteneur reste `starting`.
Les autres conteneurs qui dépendent de `db` attendent ce statut `healthy` avant de démarrer.

---

## Service `api` — Le serveur Python FastAPI

```yaml
api:
  image: api-ynov
  build:
    context: .
    dockerfile: Dockerfile
  depends_on:
    db:
      condition: service_healthy
  environment:
    - MYSQL_DATABASE=ynov_ci
    - MYSQL_USER=root
    - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    - DB_HOST=db
  ports:
    - 8000:8000
```

### `image: api-ynov`
Donne un nom à l'image construite. Utile pour la pousser sur Docker Hub ensuite (`docker push`).

### `build`
Construit l'image depuis le `Dockerfile` dans le dossier courant (`.` = dossier `api/`).

### `depends_on`
Définit l'ordre de démarrage.
`condition: service_healthy` = attend que `db` ait passé son healthcheck avant de démarrer `api`.
Sans ça, l'API démarrerait avant que MySQL soit prêt et planterait.

### `environment`
Le code Python (`main.py`) lit ces variables pour savoir comment se connecter à MySQL :
- `MYSQL_DATABASE` : nom de la base (`ynov_ci`)
- `MYSQL_USER` : utilisateur (`root`)
- `MYSQL_ROOT_PASSWORD` : mot de passe
- `DB_HOST` : adresse du serveur MySQL → `db` (le nom du service Docker = nom de domaine dans le réseau interne)

> MySQL écoute toujours sur le port **3306** par défaut, pas besoin de le préciser.

### `ports`
→ `8000:8000` : l'API est accessible sur `http://localhost:8000`

---

## Service `adminer` — Interface web pour la BDD

```yaml
adminer:
  depends_on:
    db:
      condition: service_healthy
  image: adminer
  restart: always
  ports:
    - 8080:8080
```

Adminer est une interface web pour voir et gérer la base de données visuellement (comme phpMyAdmin).
Accessible sur `http://localhost:8080`.

Pas de `build` ici : on utilise directement l'image officielle `adminer` depuis Docker Hub sans rien personnaliser.

### `depends_on`
Même principe que pour `api` : on attend que `db` soit healthy avant de démarrer Adminer.

---

## Réseau interne Docker

Tous les services d'un même `docker-compose.yml` sont automatiquement dans le même réseau Docker.
Ils peuvent se parler en utilisant **le nom du service** comme adresse.

Exemple : l'API se connecte à MySQL avec `host=db` (et non `localhost` ou une IP).

---

## Le fichier `.env`

```
MYSQL_ROOT_PASSWORD=ynovpwd
```

Les variables écrites `${VARIABLE}` dans le `docker-compose.yml` sont lues depuis ce fichier.
Il doit être dans le même dossier que le `docker-compose.yml`.
Ne jamais le committer sur Git (il est dans `.gitignore`).

---

## Commandes utiles

```bash
# Lancer tous les conteneurs en arrière-plan (et rebuilder les images)
docker-compose up -d --build

# Voir l'état des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter et supprimer les conteneurs
docker-compose down
```
