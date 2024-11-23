CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
	is_log TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 0,
    user_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_path VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email, user_token, is_active)
VALUES 
('IronMan', 'hashed_password1', 'ironman@avengers.com', 'token1', 1),
('CaptainAmerica', 'hashed_password2', 'cap@avengers.com', 'token2', 1),
('BlackWidow', 'hashed_password3', 'widow@avengers.com', 'token3', 1),
('Thor', 'hashed_password4', 'thor@avengers.com', 'token4', 1),
('Hulk', 'hashed_password5', 'hulk@avengers.com', 'token5', 1),
('Groot', 'hashed_password6', 'groot@avengers.com', 'token6', 1),
('SpiderMan', 'hashed_password7', 'spidey@avengers.com', 'token7', 1),
('BlackPanther', 'hashed_password8', 'panther@avengers.com', 'token8', 1),
('DoctorStrange', 'hashed_password9', 'strange@avengers.com', 'token9', 1),
('ScarletWitch', 'hashed_password10', 'scarlet@avengers.com', 'token10', 1);

INSERT INTO posts (user_id, post_path, description)
VALUES 
(1, 'http://localhost:8000/assets/iron_1.JPEG', 'Iron Man in action'),
(1, 'http://localhost:8000/assets/iron_2.JPEG', 'Tony Stark being genius'),
(1, 'http://localhost:8000/assets/iron_3.JPEG', 'Flying high'),
(2, 'http://localhost:8000/assets/captain_1.JPEG', 'Captain America’s shield'),
(2, 'http://localhost:8000/assets/captain_2.JPEG', 'Steve Rogers in battle'),
(2, 'http://localhost:8000/assets/captain_3.JPEG', 'Leader of the Avengers'),
(3, 'http://localhost:8000/assets/widow_1.JPEG', 'Black Widow on a mission'),
(3, 'http://localhost:8000/assets/widow_2.JPEG', 'Natasha being stealthy'),
(3, 'http://localhost:8000/assets/widow_3.JPEG', 'Spy mode activated'),
(4, 'http://localhost:8000/assets/thor_1.JPEG', 'Thor prime'),
(4, 'http://localhost:8000/assets/thor_2.JPEG', 'The God of Thunder'),
(4, 'http://localhost:8000/assets/thor_3.JPEG', 'Thor in Asgard'),
(5, 'http://localhost:8000/assets/hulk_1.JPEG', 'Hulk smash!'),
(5, 'http://localhost:8000/assets/hulk_2.JPEG', 'Bruce Banner experimenting'),
(5, 'http://localhost:8000/assets/hulk_3.JPEG', 'Hulk in action'),
(6, 'http://localhost:8000/assets/groot_1.JPEG', 'groot aiming'),
(6, 'http://localhost:8000/assets/groot_2.JPEG', 'groot prime'),
(6, 'http://localhost:8000/assets/groot_3.JPEG', 'christmas groot'),
(7, 'http://localhost:8000/assets/spidey_1.JPEG', 'Spider-Man swinging'),
(7, 'http://localhost:8000/assets/spidey_2.JPEG', 'Friendly neighborhood hero'),
(7, 'http://localhost:8000/assets/spidey_3.JPEG', 'Peter Parker at school'),
(8, 'http://localhost:8000/assets/panther_1.JPEG', 'Black Panther in Wakanda'),
(8, 'http://localhost:8000/assets/panther_2.JPEG', 'T’Challa in the suit'),
(8, 'http://localhost:8000/assets/panther_3.JPEG', 'King of Wakanda'),
(9, 'http://localhost:8000/assets/strange_1.JPEG', 'Doctor Strange casting spells'),
(9, 'http://localhost:8000/assets/strange_2.JPEG', 'Master of the Mystic Arts'),
(9, 'http://localhost:8000/assets/strange_3.JPEG', 'Time manipulation in action'),
(10, 'http://localhost:8000/assets/scarlet_1.JPEG', 'Scarlet Witch using her powers'),
(10, 'http://localhost:8000/assets/scarlet_2.JPEG', 'Wanda Maximoff in battle'),
(10, 'http://localhost:8000/assets/scarlet_3.JPEG', 'Chaos magic unleashed');

INSERT INTO likes (user_id, post_id)
SELECT FLOOR(1 + (RAND() * 10)), id 
FROM posts
LIMIT 80; -- Ajustez si nécessaire

INSERT INTO comments (user_id, post_id, comment)
VALUES 
-- Iron Man (Tony Stark) comments
(1, 2, 'Not bad, Cap. You sure you don’t want to upgrade that shield?'),
(1, 7, 'Hey, Spider-kid, nice swing! You’re getting there.'),
(1, 24, 'Looks like Wakanda is thriving. T’Challa, I might visit soon.'),

-- Captain America (Steve Rogers) comments
(2, 1, 'Classic Stark, always showing off.'),
(2, 4, 'Thor, Asgard never looked better.'),
(2, 18, 'Groot, you’re a hero in any language.'),

-- Black Widow (Natasha Romanoff) comments
(3, 6, 'Nice hammer, Thor. But stealth is still better.'),
(3, 9, 'Doctor Strange, that magic is impressive.'),
(3, 19, 'Groot, you’ve got charm!'),

-- Thor comments
(4, 2, 'Captain Rogers, your leadership is unmatched.'),
(4, 5, 'Hulk, you are truly mighty, friend.'),
(4, 22, 'Ah, Wakanda! A land worthy of its king.'),

-- Hulk (Bruce Banner) comments
(5, 1, 'Iron Man, you make good tech, but can it smash?'),
(5, 8, 'T’Challa, great suit. Let’s compare notes sometime.'),
(5, 14, 'Thor, try not to break everything next time.'),

-- Groot comments
(6, 3, 'I am Groot! (Translation: Natasha, you’re amazing.)'),
(6, 12, 'I am Groot! (Translation: Thor, I like the lightning.)'),
(6, 26, 'I am Groot! (Translation: Wanda, your magic is strong.)'),

-- Spider-Man (Peter Parker) comments
(7, 1, 'Mr. Stark, you’re still the best mentor ever!'),
(7, 3, 'Natasha, how do you stay so cool under pressure?'),
(7, 15, 'Hulk, remind me not to make you angry!'),

-- Black Panther (T’Challa) comments
(8, 1, 'Tony, perhaps Vibranium could improve your suit.'),
(8, 16, 'Groot, your strength is inspiring.'),
(8, 23, 'Doctor Strange, I appreciate your wisdom.'),

-- Doctor Strange comments
(9, 2, 'Captain Rogers, time is always on your side.'),
(9, 6, 'Thor, even the gods could use magic lessons.'),
(9, 25, 'Wanda, your control over chaos is remarkable.'),

-- Scarlet Witch (Wanda Maximoff) comments
(10, 1, 'Tony, you might be a genius, but magic beats tech.'),
(10, 4, 'Thor, you and I should combine powers sometime.'),
(10, 9, 'Stephen, don’t think I didn’t notice that spell trick!');

