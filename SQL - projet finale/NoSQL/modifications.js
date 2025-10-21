//phase 4 ;
// Étape 1a: Ajouter dans following de l'utilisateur qui suit
db.users.updateOne(
  { username: "Benzerouala Ossama" },
  {
    $addToSet: {
      following: ObjectId("507f1f77bcf86cd799439011"),
    },
  }
);

// Étape 1b: Ajouter dans followers de l'utilisateur suivi
db.users.updateOne(
  { _id: ObjectId("86eee3593f1eba416ceee") },
  {
    $addToSet: {
      followers: ObjectId("507f1f77bcf86cd799439015"),
    },
  }
);

// Étape 1c: Créer une notification pour le suivi
db.notifications.insertOne({
  recipient_id: ObjectId("507f1f77bcf86cd799439011"),
  sender_id: ObjectId("507f1f77bcf86cd799439015"),
  type: "follow",
  post_id: null,
  is_read: false,
  timestamp: ISODate("2024-10-15T14:30:00Z"),
});

// ============================================
// Modification 2: Un utilisateur répond à un commentaire
// - Créer un nouveau commentaire avec parent_comment_id
// - Créer une notification pour l'auteur du commentaire parent
// ============================================

// Étape 2a: Créer la réponse au commentaire
db.comments.insertOne({
  post_id: ObjectId("507f1f77bcf86cd799439021"),
  author_id: ObjectId("507f1f77bcf86cd799439016"),
  parent_comment_id: ObjectId("507f1f77bcf86cd799439031"),
  text: "Je suis totalement d'accord avec toi! Casablanca est magnifique",
  timestamp: ISODate("2024-10-15T15:00:00Z"),
});

// Étape 2b: Créer une notification pour l'auteur du commentaire parent
db.notifications.insertOne({
  recipient_id: ObjectId("507f1f77bcf86cd799439012"),
  sender_id: ObjectId("507f1f77bcf86cd799439016"),
  type: "comment",
  post_id: ObjectId("507f1f77bcf86cd799439021"),
  is_read: false,
  timestamp: ISODate("2024-10-15T15:00:00Z"),
});

// ============================================
// Modification 3: Un utilisateur rejoint un groupe
// - Ajouter l'utilisateur dans members du groupe
// - Ajouter le groupe dans groups de l'utilisateur
// ============================================

// Étape 3a: Ajouter l'utilisateur aux membres du groupe
db.groups.updateOne(
  { group_name: "Cuisine Marocaine" },
  {
    $addToSet: {
      members: ObjectId("507f1f77bcf86cd799439019"),
    },
  }
);

// Étape 3b: Ajouter le groupe à la liste des groupes de l'utilisateur
db.users.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439019") },
  {
    $addToSet: {
      groups: ObjectId("507f1f77bcf86cd799439012"),
    },
  }
);
