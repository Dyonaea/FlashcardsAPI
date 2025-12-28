### Route d'origine

#### url = localhost:3000/

## Authentification

### /auth : Routes de manipulation de connection

### - POST /auth/logging :

#### Description

Renvoie un token de connection à partir de votre mot de passe et de votre adresse mail.

#### Paramètres en entrée

```json
{
  "email": "mon.email@moi.com",
  "password": "mot de passe"
}
```

#### Réponse

Status : 200 OK

```json
{
  "message": "User logged in successfully",
  "userData": {
    "email": "mon.email@moi.com",
    "first_name": "prénom",
    "last_name": "nom"
  },
  "token": "TOKEN"
}
```

Ne retourne pas le mot de passe pour des questions de sécurité.

### - POST auth/register :

#### Description

Créé un utilisateur avec les informations données et renvoie un token de connection.

#### Paramètres en entrée

```json
{
  "first_name": "prénom",
  "last_name": "nom",
  "email": "mon.email@moi.com",
  "password": "mot de passe"
}
```

#### Réponse

status 201 Created

```json
{
  "message": "User Created",
  "user": {
    "email": "mon.email@moi.com",
    "first_name": "prénom",
    "last_name": "nom"
  },
  "token": "TOKEN"
}
```

Ne retourne pas le mot de passe pour des questions de sécurité.

### - GET auth/ : (avec token)

#### Description

Récupère les informations de votre utilisateur à partir de votre token.

#### Paramètres en entrée

Token d'authentification via **_token bearer_**.

#### Réponse

retour attendu :

```json
{
  "first_name": "prénom",
  "last_name": "nom",
  "email": "mon.email@moi.com"
}
```

Ne retourne pas le mot de passe pour des raisons de sécurité.

## Manipulation des collections

### /collections : Routes de manipulation des collections (Connection requise)

Pour toutes les routes suivantes un **_token d'autentification_** devra être renseigné dans la partie **_token bearer_**.

### - POST /collections :

#### Description

Créé une collection à partir des informations dans le body.

#### Paramètres en entrée

```json
{
  "title": "titre",
  "visibility": "PUBLIC", # ou PRIVATE
  "description": "collection de flashcards" #optionel
}
```

#### Response

status: 201 Created

```json
{
  "response": "Collection created with id <uuid>",
  "id": "<uuid>"
}
```

### - GET collections/:id

#### Description

Renvoie une collection à partir de l'id donné dans le path

#### Paramètres en entrée

- l'id de la collection dans la route

#### Réponse

Status : 200 OK

```json
{
  "collection": {
    "id": "8d3ea64d-fba6-4e26-aa28-f7d3aadf3c90",
    "title": "haha titre",
    "description": null,
    "owner_id": "40d2a416-8ab3-43e1-a8e1-686d530ba1a1",
    "visibility": "PUBLIC"
  }
}
```

### - Get collection/

#### Description

Renvoie une liste avec toutes les collections de l'utilisateur authentifié.

#### Paramètres en entrée

Pas de paramètres

#### Réponse

Status : 200 OK

```json
{
  "collections": [
    {
      "id": "<uuid de la collection>",
      "title": "titre de la collection",
      "description": "c'est la collection de veigar",
      "owner_id": "<uuid du propriétaire>",
      "visibility": "PRIVATE"
    },
    {
      "id": "<uuid de la collection>",
      "title": "titre d'une autre collection",
      "description": null,
      "owner_id": "<uuid du propriétaire>",
      "visibility": "PUBLIC"
    }, ...
  ]
}
```

### - GET collections/search/:texte

#### Description

Renvoie une liste avec toutes les collections dont le titre contient le texte passé en paramètre

#### Paramètres en entrée

un paramètre dans l'url de type texte (ce qu'on mettrait dans une barre de recherche)

#### Réponse

Status : 200 OK

```json
{
  "collections": [
    {
      "id": "<uuid de la collection>",
      "title": "titre de la collection dont le texte correspond à la recherche",
      "description": "c'est la collection de veigar",
      "owner_id": "<uuid du propriétaire>",
      "visibility": "PRIVATE"
    },
    {
      "id": "<uuid de la collection>",
      "title": "titre d'une autre collection dont le texte correspond à la recherche",
      "description": null,
      "owner_id": "<uuid du propriétaire>",
      "visibility": "PUBLIC"
    }, ...
  ]
}
```

### - PATCH collections/:id

#### Description

Modifie les valeurs d'une collection préexistante

#### Paramètres en entrée

- l'id de la collection que l'on souhaite modifier dans la route
- un body au format json suivant :

```json
{
  "title": "titre",
  "visibility": "PRIVATE",
  "description": "collection de flashcards"
}
# Tous les champs sont facultatifs cependant il faut en renseigner au moins un
```

#### Réponse

Status : 200 OK

```json
{
  "collection": {
    "id": "dc9e3967-4292-4512-aee8-dae23c068eb8",
    "title": "titre",
    "description": "collection de flashcards",
    "owner_id": "76af62cb-ac3d-4c89-bd04-c478eaaa8cdd",
    "visibility": "PRIVATE"
  }
}
```

### - DELETE collections/:id

#### Description

Retire une collection et toutes les flashcards qu'elle contient

#### Paramètres en entrée

- l'id de la collection que l'on souhaite détruire dans la route

#### Réponse

Status : 200 OK

```json
{
  "response": "Collection dc9e3967-4292-4512-aee8-dae23c068eb8 deleted"
}
```

## Manipulation Flash Cards

### - POST flashcard/

#### Description

Créé une flashcard à partir des informations du body. Cette flashcard aura la même visibilité que celle de sa collection. La collection doit exister et vous appartenir.

#### Paramètres en entrée

```json
{
    "front": "question ?",
    "back": "réponse.",
    "collection_id": "la collection dans laquelle se trouvera la flashcard",
    "frontURL": "/image.png", #optionel
    "backURL" : "/image.png", #optionel
}
```

#### Réponse

Status: 201 Created

```json
{
  "message": "FlashCard d5611624-054f-4def-9734-43e91d31b903 created successfully and added to collection e880c0bb-2fd5-427d-bff7-06ee8630e51a",
  "flashCardId": "d5611624-054f-4def-9734-43e91d31b903",
  "collectionId": "e880c0bb-2fd5-427d-bff7-06ee8630e51a"
}
```

### - GET flashcard/:id

#### Description

Récupère une flashcard à partir de son id. La flashcard doit soit vous appartenir soit être dans une collection publique soit que vous soyez connecté avec un compte Administrateur.

#### Paramètres en entrée

- l'id de la flashcard recherchée

#### Réponse

Status: 200 Created

```json
{
  "flashCard": {
    "id": "28b496a6-167c-4571-9554-15f0efbf92f1",
    "front": "question ?",
    "back": "réponse.",
    "front_URL": "/image.png",
    "back_URL": "/image.png",
    "collection_id": "e880c0bb-2fd5-427d-bff7-06ee8630e51a"
  }
}
```

### - GET flashcard/byCollection/:id

#### Description

Récupère toutes les falshcards d'une collection à partir de l'id de la collection. La collection doit vous appartenir, être publique ou alors il faut que vous soyez connecté avec un compte Administrateur.

#### Paramètres en entrée

- l'id de la collection recherchée

#### Réponse

```json
{
  "flashCards": [
    {
      "id": "0132c107-0e4b-4c1a-8cae-9bd552b7be83",
      "front": "question ?",
      "back": "réponse.",
      "front_URL": null,
      "back_URL": null,
      "collection_id": "2447636e-2e01-4624-adc8-371518de2014"
    },
    {
      "id": "5e949bab-94d2-4618-b2a5-6d0b570e80d5",
      "front": "question ?",
      "back": "réponse.",
      "front_URL": "/image.png",
      "back_URL": "/image.png",
      "collection_id": "2447636e-2e01-4624-adc8-371518de2014"
    }, ...
  ]
}
```

### - GET flashcard/

#### Description

Récupère la liste des flashcards que l'utilisateur connecté peut réviser. Les informations retournées ne comprenneront ni le recto ni le verso de la carte mais seulement les ids des cartes pour qu'elles soient révisées une par une avec le chemin de révision (le dernier de cette catégorie)

#### Paramètres en entrée

Rien

#### Réponse

```json
{
  "reviewableCardIds": ["7978c5fe-6d40-456a-a9cd-baa59a889c46"]
}
```

### - PATCH flashcard/:id

#### Description

Modifie une flashcard préexistante.

#### Paramètres en entrée

Tous les champs sont optionels mais il en faut au moins un.

```json
{
  "front": "question ?",
  "back": "réponse.",
  "frontURL": "/image.png",
  "backURL": "/image.png"
}
```

#### Réponse

Status 200

```json
{
  "message": "card updated successfully",
  "newCard": {
    "id": "5e949bab-94d2-4618-b2a5-6d0b570e80d5",
    "front": "nouvelle question ?",
    "back": "nouvelle réponse !",
    "front_URL": "/image.png",
    "back_URL": "/image.png",
    "collection_id": "2447636e-2e01-4624-adc8-371518de2014"
  }
}
```

### - DELETE flashcard/:id

#### Description

Détruit une flashcard à partir de son id. L'utilisateur doit être propriétaire de la collection de la flashCard.

#### Paramètres en entrée

- l'id de la flashCard qui va être détruite

#### Réponse

```json
{
  "message": "flashCard 28b496a6-167c-4571-9554-15f0efbf92f1 deleted successfully"
}
```

### - POST flashcard/reviewCard/:id

#### Description

Récupère les information d'une flashcard dont son recto et son verso. La flash card ne pourra pas être revue pendant une durée de temps dépendant de sa difficulté (voir tableau ci dessous). Si le délai n'est pas respecté alors le contenu de la falshcard ne sera pas retourné et à la place la date de prochaine révision sera donnée.

| Niveau | Délai de révision |
| ------ | ----------------- |
| 1      | 1 jour            |
| 2      | 2 jours           |
| 3      | 4 jours           |
| 4      | 8 jours           |
| 5      | 16 jours          |

#### Paramètres en entrée

- l'id de la collection que l'on souhaite détruire dans la route

#### Réponse

Status : 200 OK

```json
{
  "response": "Collection dc9e3967-4292-4512-aee8-dae23c068eb8 deleted"
}
```

S'il est trop tôt pour réviser la carte :

```json
{
  "error": "You cannot review this flashcard yet you must wait until 29/12/2025 16:06:30",
  "nextReviewDate": "29/12/2025 16:06:30"
}
```

## Manipulation des Utilisateurs

### /user : Routes de manipulation des utilisateurs (Compte Administrateur requis)

Pour toutes les routes suivantes un **_token d'autentification d'un compte administrateur_** devra être renseigné dans la partie **_token bearer_**.

### - GET /user/

#### Description

Récupère la liste de tous les utilisateurs. Les utilisateurs sont triés par date de création (du plus récent au plus ancien).

#### Paramètres en entrée

Aucun paramètre requis.

#### Réponse

Status : 200 OK

```json
{
  "users": [
    {
      "id": "<uuid de l'utilisateur>",
      "first_name": "prénom",
      "last_name": "nom",
      "email": "mon.email@moi.com",
      "role": "USER",
      "creation_date": "2025-12-28T15:30:00.000Z"
    },
    {
      "id": "<uuid de l'utilisateur>",
      "first_name": "admin",
      "last_name": "admin",
      "email": "admin@admin.com",
      "role": "ADMIN",
      "creation_date": "2025-12-27T10:00:00.000Z"
    }, ...
  ]
}
```

Ne retourne pas les mots de passe pour des raisons de sécurité.

### - GET /user/:id

#### Description

Récupère les informations d'un utilisateur à partir de son id.

#### Paramètres en entrée

- l'id de l'utilisateur recherché dans la route

#### Réponse

Status : 200 OK

```json
{
  "user": {
    "id": "<uuid de l'utilisateur>",
    "first_name": "prénom",
    "last_name": "nom",
    "email": "mon.email@moi.com",
    "role": "USER",
    "creation_date": "2025-12-28T15:30:00.000Z"
  }
}
```

Ne retourne pas le mot de passe pour des raisons de sécurité.

### - DELETE /user/:id

#### Description

Supprime un utilisateur et TOUTES les informations qui y sont liés.

#### Paramètres en entrée

- l'id de l'utilisateur recherché dans la route

#### Réponse

Status : 200 OK

```json
{
    "message": "User with id e72fad71-8d34-47fd-a3ef-96e84bdb348b deleted successfully"
}
```

Ne retourne pas le mot de passe pour des raisons de sécurité.
