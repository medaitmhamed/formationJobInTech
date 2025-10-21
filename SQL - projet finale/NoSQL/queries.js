
use connectsphere

// ============================================
// Query 1: Profil complet d'un utilisateur + utilisateurs suivis avec $lookup
// ============================================

db.users.aggregate([
  {
    $match: { username: "Benzerouala Ossama" }
  },
  {
    $lookup: {
      from: "users",
      localField: "following",
      foreignField: "_id",
      as: "following_details"
    }
  },
  {
    $project: {
      username: 1,
      email: 1,
      profile: 1,
      join_date: 1,
      followers: 1,
      following: 1,
      groups: 1,
      following_details: {
        username: 1,
        email: 1,
        "profile.bio": 1,
        "profile.location": 1
      }
    }
  }
])

// ============================================
// Query 2: Tous les posts d'un groupe spécifique
// ============================================

db.posts.find({
  group_id: ObjectId("68eee4653f1eb416cf1e")
}).sort({ timestamp: -1 })

// ============================================
// Query 3a: Tous les commentaires parents d'un post
// ============================================

db.comments.find({
  post_id: ObjectId("507f1f77bcf86cd799439021"),
  parent_comment_id: null
}).sort({ timestamp: -1 })

// ============================================
// Query 3b: Toutes les réponses d'un commentaire parent
// ============================================

db.comments.find({
  parent_comment_id: ObjectId("507f1f77bcf86cd799439031")
}).sort({ timestamp: 1 })

// ============================================
// Query 4: Posts avec tag #mongodb des dernières 24 heures
// ============================================

db.posts.find({
  tags: "mongodb",
  timestamp: {
    $gte: ISODate("2024-10-14T15:00:00Z")
  }
}).sort({ timestamp: -1 })

// ============================================
// Query 5: Feed avancé - Posts des utilisateurs suivis + posts des groupes
// ============================================

db.users.aggregate([
  {
    $match: { username: "Benzerouala Ossama" }
  },
  {
    $lookup: {
      from: "posts",
      let: { following: "$following", groups: "$groups" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $in: ["$author_id", "$$following"] },
                { $in: ["$group_id", "$$groups"] }
              ]
            }
          }
        },
        { $sort: { timestamp: -1 } },
        { $limit: 20 }
      ],
      as: "feed"
    }
  },
  {
    $project: {
      username: 1,
      feed: 1
    }
  }
])

// ============================================
// Query 6: Membres d'un groupe qui n'ont jamais posté dedans
// ============================================

db.groups.aggregate([
  {
    $match: { group_name: "Développeurs Personnel Maroc" }
  },
  {
    $lookup: {
      from: "posts",
      let: { group_id: "$_id", members: "$members" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$group_id", "$$group_id"] },
                { $in: ["$author_id", "$$members"] }
              ]
            }
          }
        }
      ],
      as: "group_posts"
    }
  },
  {
    $project: {
      members: 1,
      active_members: "$group_posts.author_id"
    }
  },
  {
    $project: {
      inactive_members: {
        $setDifference: ["$members", "$active_members"]
      }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "inactive_members",
      foreignField: "_id",
      as: "inactive_users"
    }
  },
  {
    $project: {
      "inactive_users.username": 1,
      "inactive_users.email": 1
    }
  }
])

// ============================================
// Query 7: Posts avec plus de 10 likes mais zéro commentaires
// ============================================

db.posts.aggregate([
  {
    $match: {
      $expr: { $gte: [{ $size: "$likes" }, 10] }
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "post_id",
      as: "comments"
    }
  },
  {
    $match: {
      comments: { $size: 0 }
    }
  },
  {
    $project: {
      content: 1,
      author_id: 1,
      likes_count: { $size: "$likes" },
      timestamp: 1
    }
  }
])

// ============================================
// Query 8: Nombre de membres par groupe
// ============================================

db.groups.aggregate([
  {
    $project: {
      group_name: 1,
      members_count: { $size: "$members" }
    }
  },
  {
    $sort: { members_count: -1 }
  }
])

// ============================================
// Query 9: Notifications non lues d'un utilisateur
// ============================================

db.notifications.find({
  recipient_id: ObjectId("68eeee3593f1eba69e416cef0"),
  is_read: false
}).sort({ timestamp: -1 })

// ============================================
// Query 10: Top 10 utilisateurs les plus influents (plus de followers)
// ============================================

db.users.aggregate([
  {
    $project: {
      username: 1,
      email: 1,
      "profile.location": 1,
      followers_count: { $size: "$followers" }
    }
  },
  {
    $sort: { followers_count: -1 }
  },
  {
    $limit: 10
  }
])

// ============================================
// Query 11: Nombre moyen de likes par post pour chaque utilisateur
// ============================================

db.posts.aggregate([
  {
    $group: {
      _id: "$author_id",
      total_posts: { $sum: 1 },
      total_likes: { $sum: { $size: "$likes" } }
    }
  },
  {
    $project: {
      total_posts: 1,
      total_likes: 1,
      average_likes: {
        $cond: {
          if: { $eq: ["$total_posts", 0] },
          then: 0,
          else: { $divide: ["$total_likes", "$total_posts"] }
        }
      }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      username: "$user.username",
      total_posts: 1,
      total_likes: 1,
      average_likes: { $round: ["$average_likes", 2] }
    }
  },
  {
    $sort: { average_likes: -1 }
  }
])

// ============================================
// Query 12: Tags tendance du jour (dernières 24h)
// ============================================

db.posts.aggregate([
  {
    $match: {
      timestamp: {
        $gte: ISODate("2024-10-14T15:00:00Z")
      }
    }
  },
  {
    $unwind: "$tags"
  },
  {
    $group: {
      _id: "$tags",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      tag: "$_id",
      occurrences: "$count",
      _id: 0
    }
  }
])

// ============================================
// Query 13: Utilisateur le plus actif dans un groupe (posts + comments)
// ============================================

db.groups.aggregate([
  {
    $match: { group_name: "Développement Personnel Maroc" }
  },
  {
    $lookup: {
      from: "posts",
      let: { group_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$group_id", "$$group_id"] }
          }
        },
        {
          $group: {
            _id: "$author_id",
            posts_count: { $sum: 1 }
          }
        }
      ],
      as: "posts_by_user"
    }
  },
  {
    $lookup: {
      from: "posts",
      let: { group_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$group_id", "$$group_id"] }
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post_id",
            as: "comments"
          }
        },
        {
          $unwind: "$comments"
        },
        {
          $group: {
            _id: "$comments.author_id",
            comments_count: { $sum: 1 }
          }
        }
      ],
      as: "comments_by_user"
    }
  },
  {
    $project: {
      activity: {
        $concatArrays: ["$posts_by_user", "$comments_by_user"]
      }
    }
  },
  {
    $unwind: "$activity"
  },
  {
    $group: {
      _id: "$activity._id",
      total_posts: { $sum: { $ifNull: ["$activity.posts_count", 0] } },
      total_comments: { $sum: { $ifNull: ["$activity.comments_count", 0] } }
    }
  },
  {
    $project: {
      total_posts: 1,
      total_comments: 1,
      total_activity: { $add: ["$total_posts", "$total_comments"] }
    }
  },
  {
    $sort: { total_activity: -1 }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      username: "$user.username",
      email: "$user.email",
      total_posts: 1,
      total_comments: 1,
      total_activity: 1
    }
  }
])

// ============================================
// Query 14: Nombre d'inscriptions par jour (30 derniers jours)
// ============================================

db.users.aggregate([
  {
    $match: {
      join_date: {
        $gte: ISODate("2024-09-15T00:00:00Z")
      }
    }
  },
  {
    $project: {
      date: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$join_date"
        }
      }
    }
  },
  {
    $group: {
      _id: "$date",
      registrations: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  },
  {
    $project: {
      date: "$_id",
      registrations: 1,
      _id: 0
    }
  }
])

// ============================================
// Query 15: Statistiques complètes d'un utilisateur
// (total posts, total likes reçus, nombre de followers)
// ============================================

db.users.aggregate([
  {
    $match: { username: "sara_tanger" }
  },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "author_id",
      as: "user_posts"
    }
  },
  {
    $project: {
      username: 1,
      email: 1,
      profile: 1,
      total_posts: { $size: "$user_posts" },
      total_likes_received: {
        $sum: {
          $map: {
            input: "$user_posts",
            as: "post",
            in: { $size: "$post.likes" }
          }
        }
      },
      followers_count: { $size: "$followers" },
      following_count: { $size: "$following" },
      groups_count: { $size: "$groups" }
    }
  }
])


