
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_pic VARCHAR(255),
    total_points INT DEFAULT 0,
    current_points INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE game (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    price VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    is_new BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE favorite (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    game_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE
);

CREATE TABLE prize (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    exchange_price INT NOT NULL, 
     is_available BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE prize_acquired (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    prize_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (prize_id) REFERENCES prize(id) ON DELETE CASCADE
);


INSERT INTO user (name, firstname, email, username, password_hash, phone_number, profile_pic, total_points, current_points)
VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'jdupont', '$2y$10$abcdefghij1234567890', '0612345678', 'https://res.cloudinary.com/dpyuhkx1p/image/upload/v1737103513/user1_hpvocy.jpg', 300, 150),
('Martin', 'Claire', 'claire.martin@example.com', 'cmartin', '$2y$10$klmnopqrst0987654321', '0698765432', 'https://res.cloudinary.com/dpyuhkx1p/image/upload/v1737103518/user2_x5jhqv.jpg', 400, 200),
('Diop', 'Mamadou', 'mamadou.diop@example.com', 'mdiop', '$2y$10$uvwxyzabcdef1234567890', '0778543210', 'https://res.cloudinary.com/dpyuhkx1p/image/upload/v1737103730/user5_d3zljt.jpg', 500, 320),
('Nguyen', 'Linh', 'linh.nguyen@example.com', 'lnguyen', '$2y$10$mnopqrstuv9876543210', '0654789632', 'https://res.cloudinary.com/dpyuhkx1p/image/upload/v1737103731/user3_t18hte.jpg', 200, 90),
('Lopez', 'Carlos', 'carlos.lopez@example.com', 'clopez', '$2y$10$abcdef1234567890klmno', '0689456712', 'https://res.cloudinary.com/dpyuhkx1p/image/upload/v1737103731/user4_ohye2f.jpg', 150, 120);

INSERT INTO game (name, description, image, price) VALUES
('Pac-Man', 'Le célèbre jeu de labyrinthe où vous devez manger tous les points tout en évitant les fantômes', 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736340064/pngegg_4_d98jgg.png', '1'),
('Street-Fighter 2', 'Le jeu de combat légendaire avec des personnages emblématiques du monde entier', 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736331126/street-fighterII_xseiad.png', '2'),
('Donkey Kong', 'Aidez Mario à sauver Pauline en évitant les tonneaux lancés par Donkey Kong', 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736339485/Donkey_kong_s06sml.png', '1'),
('Galaga', "Affrontez des vagues d'ennemis dans l'espace dans ce shoot'em up classique", 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736331125/galaga_h8etpt.png', '1'),
('Asteroids', "Détruisez les astéroïdes et les soucoupes volantes dans l'espace", 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736339904/PikPng.com_asteroids-png_1599597_mjlrgl.png', '1'),
('Space Invaders', "Détruisez les vagues d'aliens avant qu'ils n'atteignent le bas de l'écran", 'https://res.cloudinary.com/dl1errlyl/image/upload/v1736331124/space-invaders_uz0pta.png', '1');

INSERT INTO Prize (name, description, image, exchange_price) VALUES
('T-shirt', 'Un t-shirt aux couleurs de votre jeu préféré', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351540/tshirt_rp3v7a.png',60 ),
('Mug', 'Un mug pour boire votre café ou thé en pensant à votre jeu préféré', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351534/mug_lxdcqc.png', 40),
('Stickers', 'Des stickers pour décorer votre ordinateur ou votre téléphone', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351542/sticker_sjntwm.png', 20),
('Peluche', 'Une peluche de votre personnage préféré', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351525/peluche_ozmgl0.png', 80),
('Figurine', 'Une figurine de votre personnage préféré', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351526/figurine_f96gqr.png', 100),
('Poster', 'Un poster pour décorer votre chambre ou votre bureau', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351529/poster_ewqcdb.png', 20),
('Porte-clés', 'Un porte-clés pour emmener votre personnage préféré partout avec vous', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351531/porte-cl%C3%A9s_ysjhpc.png', 25),
('Crédit de jeu', 'Un crédit de jeu pour continuer à jouer sans dépenser', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351528/partie-offerte_m8zwwy.png', 10),
('Snack', 'Un snack pour vous rebooster', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351537/snack_s2pfxr.png', 15),
('Boisson soft', 'Une boisson pour vous désaltérer', 'https://res.cloudinary.com/doh3k7alc/image/upload/v1736351532/soft_p9kfgy.png', 15);

INSERT INTO prize_acquired (user_id, prize_id) VALUES
(2, 1),
(2, 2),
(3, 3),
(3, 4),
(4, 5),
(5, 6),
(5, 7),
(5, 8);

INSERT INTO favorite (user_id, game_id) VALUES
(1, 1),
(1, 2), 
(2, 3), 
(3, 1), 
(4, 5), 
(5, 6);

