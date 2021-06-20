CREATE DATABASE groupomania CHARACTER SET 'utf8';

CREATE TABLE Users (
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(40) NOT NULL,
surname VARCHAR(40) NOT NULL,
username VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
bio TEXT,
pictureURL VARCHAR(255),
roleId TINYINT UNSIGNED NOT NULL,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
PRIMARY KEY (id)
)

ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE Posts (
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
userId SMALLINT UNSIGNED,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
pictureURL VARCHAR(255),
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
PRIMARY KEY (id)
)

ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE Comments (
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
postId SMALLINT UNSIGNED NOT NULL,
userId SMALLINT UNSIGNED,
relatedComment SMALLINT UNSIGNED,
content TEXT NOT NULL,
deletionFlag TINYINT(1) NOT NULL,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
PRIMARY KEY (id)
)

ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE Likings (
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
postId SMALLINT UNSIGNED,
commentId SMALLINT UNSIGNED,
userId SMALLINT UNSIGNED NOT NULL,
liking TINYINT(1),
disliking TINYINT(1),
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
PRIMARY KEY (id)
)

ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE Roles (
id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
roleName VARCHAR(40) NOT NULL ,
updateUser TINYINT(1) NOT NULL,
deleteUser TINYINT(1) NOT NULL,
updatePost TINYINT(1) NOT NULL,
deletePost TINYINT(1) NOT NULL,
updateComment TINYINT(1) NOT NULL,
deleteComment TINYINT(1) NOT NULL,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
PRIMARY KEY (id)
)

ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

INSERT INTO Roles VALUES (1,'user',0,0,0,0,0,0,'2021-04-24 13:43:00','2021-04-24 13:43:00'), (2,'moderator',0,0,1,1,1,1,'2021-04-24 13:43:00','2021-04-24 13:43:00'), (3,'admin',1,1,1,1,1,1,'2021-04-24 13:43:00','2021-04-24 13:43:00');


ALTER TABLE Users
ADD CONSTRAINT fk_role_id FOREIGN KEY (roleId) REFERENCES Roles(id);

ALTER TABLE Posts
ADD CONSTRAINT fk_posts_users FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE Comments
ADD CONSTRAINT fk_comments_users FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE Comments
ADD CONSTRAINT fk_comments_posts FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE;

ALTER TABLE Likings
ADD CONSTRAINT fk_likings_users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE Likings
ADD CONSTRAINT fk_likings_posts FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE;

ALTER TABLE Likings
ADD CONSTRAINT fk_likings_comments FOREIGN KEY (commentId) REFERENCES Comments(id) ON DELETE CASCADE;




INSERT INTO Posts VALUES (1, 1, 'le titre du 1er post', 'le texte du 1er post', NULL,'2021-04-24 13:43:00','2021-04-24 13:43:00');
INSERT INTO Posts VALUES (2, 1, 'le titre du 2eme post', 'le texte du 2nd post', NULL,'2021-04-24 13:43:00','2021-04-24 13:43:00');
INSERT INTO Posts VALUES (3, 1, 'le titre du 3eme post', 'le texte du 3eme post', NULL,'2021-04-24 13:43:00','2021-04-24 13:43:00');

INSERT INTO Comments VALUES (1, 1, 1, NULL, 'le texte du 1er commentaire', 0,'2021-04-24 13:43:00','2021-04-24 13:43:00');
INSERT INTO Comments VALUES (2, 1, 1, NULL, 'le texte du 2nd commentaire', 0,'2021-04-24 13:43:00','2021-04-24 13:43:00');
INSERT INTO Comments VALUES (3, 1, 1,  1, 'le texte du 1er commentaire en réponse au 1er commentaire', 0,'2021-04-24 13:43:00','2021-04-24 13:43:00');

SELECT Posts.id, Posts.userId, Posts.title, Posts.content, Posts.createdAt, Users.username, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.id = Comments.relatedComment) AS CommentsNb  
FROM Posts
LEFT JOIN Likings 
	ON Posts.id=Likings.postId  
INNER JOIN Users 
	ON Users.id=Posts.userId 
WHERE Posts.id=4 
GROUP BY Posts.id;


-- Lire un POST
SELECT Posts.id, Posts.userId, Posts.title, Posts.content, Posts.createdAt, Users.username, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId=1 AND Likings.postId=4) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId=1 AND Likings.postId=4) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.id = Comments.relatedComment) AS CommentsNb  
FROM Posts
LEFT JOIN Likings 
	ON Posts.id=Likings.postId  
INNER JOIN Users 
	ON Users.id=Posts.userId 
WHERE Posts.id=4 
GROUP BY Posts.id;

-- Tous les posts d'un user
SELECT Users.id, Users.username, Users.pictureURL AS profilePictureURL, Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId=1 AND Likings.postId=Posts.id) AS myLike, COUNT(Comments.id) AS CommentsNb 
FROM Users 
INNER JOIN Posts 
	ON Users.id=Posts.userId 
LEFT JOIN Likings 
	ON Posts.id=Likings.postId 
LEFT JOIN Comments 
	ON Posts.id=Comments.postId 
WHERE Users.id=1
GROUP BY Posts.id;


-- Les derniers posts
SELECT Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, Users.id, Users.username, Users.pictureURL, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId=1 AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId=1 AND Likings.postId=Posts.id) AS myDislike, COUNT(Comments.id) AS CommentsNb 
FROM Posts 
INNER JOIN Users 
	ON Users.id=Posts.userId 
LEFT JOIN Likings 
	ON Posts.id=Likings.postId 
LEFT JOIN Comments 
	ON Posts.id=Comments.postId 
GROUP BY Posts.id 
ORDER BY Posts.createdAt DESC;



SELECT Comments.id AS commentId, Users.username, Comments.postId, Comments.relatedComment, Comments.content, Comments.createdAt, Comments.updatedAt, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.id = Comments.relatedComment) AS CommentsNb 
FROM Posts 
LEFT JOIN Likings 
	ON Comments.id=Likings.commentId  
INNER JOIN Users 
	ON Posts.userId=Users.id 
WHERE Comments.postId=4 AND Comments.relatedComment IS NULL
GROUP BY Comments.id
ORDER BY Comments.createdAt DESC;

