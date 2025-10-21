// ============================================
// Phase 1: setup.js
// Initialisation de la base de données ConnectSphere
// Commandes MongoDB Shell NoSQL
// ============================================

// Nettoyer les collections existantes
db.users.drop();
db.groups.drop();
db.posts.drop();
db.comments.drop();
db.notifications.drop();

// ============================================
// Insertion des utilisateurs initiaux
// ============================================

db.users.insertMany([
  {
    username: "Benzerouala Ossama",
    email: "benzeroualaossama@gmail.com",
    join_date: ISODate("2024-01-15T10:30:00Z"),
    profile: {
      bio: "Développeur passionné de Casablanca 🇲🇦",
      location: "Casablanca, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "Mohammed ait med",
    email: "Mohammedaitmed@gmail.com",
    join_date: ISODate("2024-02-10T14:20:00Z"),
    profile: {
      bio: "Designer UI/UX | Amoureuse de l'art marocain",
      location: "Rabat, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "Maryem Ayad",
    email: "maryemayad@gmail.com",
    join_date: ISODate("2024-01-20T09:15:00Z"),
    profile: {
      bio: "Entrepreneur | Startups & Innovation",
      location: "Marrakech, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "sara_tanger",
    email: "sara.zahiri@gmail.com",
    join_date: ISODate("2024-03-05T16:45:00Z"),
    profile: {
      bio: "Photographe professionnelle | Capturer la beauté du Maroc",
      location: "Tanger, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "omar_fes",
    email: "omar.idrissi@gmail.com",
    join_date: ISODate("2024-02-25T11:30:00Z"),
    profile: {
      bio: "Étudiant en informatique | Passionné de technologie",
      location: "Fès, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "khadija_agadir",
    email: "khadija.amrani@gmail.com",
    join_date: ISODate("2024-03-15T08:20:00Z"),
    profile: {
      bio: "Chef cuisinière | Cuisine marocaine authentique",
      location: "Agadir, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "karim_sale",
    email: "karim.bennani@gmail.com",
    join_date: ISODate("2024-01-28T13:10:00Z"),
    profile: {
      bio: "Développeur Full Stack | MongoDB lover",
      location: "Salé, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "nadia_oujda",
    email: "nadia.fassi@gmail.com",
    join_date: ISODate("2024-02-18T15:40:00Z"),
    profile: {
      bio: "Marketing Digital | Social Media Expert",
      location: "Oujda, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "rachid_meknes",
    email: "rachid.lahlou@gmail.com",
    join_date: ISODate("2024-03-08T10:25:00Z"),
    profile: {
      bio: "Journaliste | Reporter culturel",
      location: "Meknès, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
  {
    username: "amina_tetouan",
    email: "amina.sekkat@gmail.com",
    join_date: ISODate("2024-01-30T12:50:00Z"),
    profile: {
      bio: "Artiste peintre | Art contemporain marocain",
      location: "Tétouan, Maroc",
    },
    followers: [],
    following: [],
    groups: [],
  },
]);

// ============================================
// Insertion des groupes initiaux
// ============================================

db.groups.insertMany([
  {
    group_name: "Développeurs Maroc",
    description:
      "Communauté des développeurs marocains - Partage d'expériences et opportunités",
    created_by: ObjectId("507f1f77bcf86cd799439011"),
    members: [],
  },
  {
    group_name: "Cuisine Marocaine",
    description:
      "Recettes traditionnelles et modernes de la gastronomie marocaine",
    created_by: ObjectId("507f1f77bcf86cd799439012"),
    members: [],
  },
  {
    group_name: "Tourisme au Maroc",
    description:
      "Découvrez les merveilles du Royaume - Conseils voyage et photographie",
    created_by: ObjectId("507f1f77bcf86cd799439013"),
    members: [],
  },
  {
    group_name: "Startups Maroc",
    description: "Réseau des entrepreneurs et innovateurs marocains",
    created_by: ObjectId("507f1f77bcf86cd799439014"),
    members: [],
  },
  {
    group_name: "Art & Culture Marocaine",
    description: "Promotion de l'art et la culture du Maroc",
    created_by: ObjectId("507f1f77bcf86cd799439015"),
    members: [],
  },
]);

// ============================================
// Insertion des posts initiaux
// ============================================

db.posts.insertMany([
  {
    author_id: ObjectId("507f1f77bcf86cd799439011"),
    content:
      "Magnifique coucher de soleil sur la corniche de Casablanca 🌅 #Casablanca #Maroc",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-14T18:30:00Z"),
    likes: [],
    tags: ["Casablanca", "Maroc"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439012"),
    content:
      "Nouveau projet MongoDB en cours! Les bases NoSQL sont vraiment puissantes 💪 #mongodb #nosql",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-15T09:15:00Z"),
    likes: [],
    tags: ["mongodb", "nosql"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439013"),
    content:
      "Visite de la médina de Fès aujourd'hui. L'architecture est époustouflante! #Fes #Patrimoine",
    post_type: "image",
    image_url: "https://example.com/fes_medina.jpg",
    group_id: null,
    timestamp: ISODate("2024-10-13T14:20:00Z"),
    likes: [],
    tags: ["Fes", "Patrimoine"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439014"),
    content:
      "Recette du jour: Tajine d'agneau aux pruneaux 🍲 Qui veut la recette complète?",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-14T12:00:00Z"),
    likes: [],
    tags: ["cuisine", "tajine"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439015"),
    content:
      "Lancement de notre nouvelle startup tech à Rabat! 🚀 #StartupMaroc #Innovation",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-15T08:00:00Z"),
    likes: [],
    tags: ["StartupMaroc", "Innovation"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439016"),
    content: "Session de surf incroyable à Taghazout ce matin 🏄‍♂️ #Surf #Agadir",
    post_type: "image",
    image_url: "https://example.com/surf_agadir.jpg",
    group_id: null,
    timestamp: ISODate("2024-10-14T10:30:00Z"),
    likes: [],
    tags: ["Surf", "Agadir"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439017"),
    content:
      "Les jardins Majorelle sous un autre angle 📸 #Marrakech #Photography",
    post_type: "image",
    image_url: "https://example.com/majorelle.jpg",
    group_id: null,
    timestamp: ISODate("2024-10-13T16:45:00Z"),
    likes: [],
    tags: ["Marrakech", "Photography"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439018"),
    content:
      "Conférence sur l'IA demain à Casablanca Tech Park. Qui sera là? #AI #TechMaroc",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-14T15:20:00Z"),
    likes: [],
    tags: ["AI", "TechMaroc"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439019"),
    content:
      "Préparation du msemen traditionnel 🥞 Rien de mieux pour le petit-déjeuner!",
    post_type: "text",
    image_url: null,
    group_id: null,
    timestamp: ISODate("2024-10-15T07:00:00Z"),
    likes: [],
    tags: ["cuisine", "msemen"],
  },
  {
    author_id: ObjectId("507f1f77bcf86cd799439020"),
    content: "Exploration des grottes d'Hercule à Tanger 🏛️ #Tanger #Histoire",
    post_type: "image",
    image_url: "https://example.com/grottes_hercule.jpg",
    group_id: null,
    timestamp: ISODate("2024-10-13T11:15:00Z"),
    likes: [],
    tags: ["Tanger", "Histoire"],
  },
]);

// ============================================
// Insertion des commentaires initiaux
// ============================================

db.comments.insertMany([
  {
    post_id: ObjectId("507f1f77bcf86cd799439021"),
    author_id: ObjectId("507f1f77bcf86cd799439012"),
    parent_comment_id: null,
    text: "Magnifique photo! J'adore Casablanca 😍",
    timestamp: ISODate("2024-10-14T19:00:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439022"),
    author_id: ObjectId("507f1f77bcf86cd799439013"),
    parent_comment_id: null,
    text: "MongoDB est vraiment génial pour les projets scalables!",
    timestamp: ISODate("2024-10-15T09:30:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439023"),
    author_id: ObjectId("507f1f77bcf86cd799439014"),
    parent_comment_id: null,
    text: "La médina de Fès est un trésor national 🇲🇦",
    timestamp: ISODate("2024-10-13T15:00:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439024"),
    author_id: ObjectId("507f1f77bcf86cd799439015"),
    parent_comment_id: null,
    text: "Oui s'il te plaît! Partage la recette complète 🙏",
    timestamp: ISODate("2024-10-14T12:30:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439025"),
    author_id: ObjectId("507f1f77bcf86cd799439016"),
    parent_comment_id: null,
    text: "Félicitations pour le lancement! 🎉",
    timestamp: ISODate("2024-10-15T08:15:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439026"),
    author_id: ObjectId("507f1f77bcf86cd799439017"),
    parent_comment_id: null,
    text: "Les vagues à Taghazout sont parfaites en cette saison!",
    timestamp: ISODate("2024-10-14T11:00:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439027"),
    author_id: ObjectId("507f1f77bcf86cd799439018"),
    parent_comment_id: null,
    text: "Superbe composition! Quels réglages tu as utilisés?",
    timestamp: ISODate("2024-10-13T17:00:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439028"),
    author_id: ObjectId("507f1f77bcf86cd799439019"),
    parent_comment_id: null,
    text: "Je serai là! Ça a l'air très intéressant 👍",
    timestamp: ISODate("2024-10-14T15:45:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439029"),
    author_id: ObjectId("507f1f77bcf86cd799439020"),
    parent_comment_id: null,
    text: "Le msemen maison n'a pas de prix! 😋",
    timestamp: ISODate("2024-10-15T07:20:00Z"),
  },
  {
    post_id: ObjectId("507f1f77bcf86cd799439030"),
    author_id: ObjectId("507f1f77bcf86cd799439011"),
    parent_comment_id: null,
    text: "Un lieu mythique! Parfait pour les photos",
    timestamp: ISODate("2024-10-13T12:00:00Z"),
  },
]);
