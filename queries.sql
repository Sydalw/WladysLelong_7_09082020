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

SELECT Posts.id, Posts.userId, Posts.title, Posts.content, Posts.createdAt, Users.username, SUM(Likings.liking), SUM(Likings.disliking) 
FROM Posts 
INNER JOIN Users 
	ON Users.id=Posts.userId 
LEFT JOIN Likings 
	ON Posts.id=Likings.postId 
WHERE Posts.userId=16 
GROUP BY Posts.id;

SELECT Users.id, Users.username, Users.pictureURL, Posts.id, Posts.title, Posts.content, Posts.createdAt, Posts.updatedAt, SUM(Likings.liking), SUM(Likings.disliking) 
FROM Users 
INNER JOIN Posts 
	ON Users.id=Posts.userId 
LEFT JOIN Likings 
	ON Posts.id=Likings.postId 
WHERE Users.id=16 
GROUP BY Posts.id;

SELECT Comments.id AS commentId, Users.username, Comments.postId, Comments.relatedComment, Comments.content, Comments.createdAt, Comments.updatedAt, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.id = Comments.relatedComment) AS CommentsNb 
FROM Posts 
INNER JOIN Comments 
	ON Comments.postId=Posts.id 
INNER JOIN Users 
	ON Posts.userId=Users.id 
LEFT JOIN Likings 
	ON Comments.id=Likings.commentId 
WHERE Comments.postId=4 AND Comments.relatedComment IS NULL
GROUP BY Comments.id
ORDER BY Comments.createdAt DESC;

