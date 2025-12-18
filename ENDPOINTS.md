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

### route
