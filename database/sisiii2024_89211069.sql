-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 29, 2024 at 05:57 PM
-- Server version: 10.3.39-MariaDB-0ubuntu0.20.04.2
-- PHP Version: 7.4.3-4ubuntu2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `SISIII2024_89211069`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `postImage` varchar(255) DEFAULT NULL,
  `postTitle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `buyer_id`, `seller_id`, `post_id`, `postImage`, `postTitle`) VALUES
(29, 1, 5, 7, NULL, NULL),
(30, 1, 2, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(11, 'Adventure'),
(15, 'Children’s'),
(12, 'Drama'),
(4, 'Fantasy'),
(1, 'Fiction'),
(10, 'Historical Fiction'),
(8, 'Horror'),
(5, 'Mystery'),
(2, 'Non-fiction'),
(7, 'Poetry'),
(6, 'Romance'),
(3, 'Science Fiction'),
(13, 'Self-help'),
(9, 'Thriller'),
(16, 'Tragedy'),
(14, 'Travel');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`, `profile_pic`) VALUES
(1, 'Vanja', 'vanjaantonovic@gmail.com', 'VanjaDoca123', 'uploads\\1721840466734.jpg'),
(2, 'Andriana', 'andriannajjj@gmail.com', 'Andriana12345', 'uploads/default_image.png'),
(3, 'Stefan', 'stefanmzt@gmail.com', 'Stefan123', 'uploads\\1719527096282.jpg'),
(4, 'Filip', 'filipantonovic@gmail.com', 'Filip12345', 'uploads/default_image.png'),
(5, 'Andrija', 'andrijapirot16@gmail.com', 'Andrija12345', 'uploads/default_image.png');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `postImage` varchar(255) DEFAULT NULL,
  `postTitle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `user_email`, `message`, `timestamp`, `postImage`, `postTitle`) VALUES
(42, 30, 'vanjaantonovic@gmail.com', 'Dreaming', '2024-07-24 11:36:45', NULL, NULL),
(43, 30, 'vanjaantonovic@gmail.com', 'Picuture?', '2024-07-24 11:40:53', NULL, NULL),
(46, 29, 'vanjaantonovic@gmail.com', 'OKAY', '2024-07-24 12:03:41', NULL, NULL),
(48, 29, NULL, 'PLASE SHOW THE PIC', '2024-07-24 12:11:16', 'uploads\\1719935463177.jpg', 'To Kill a Mockingbird'),
(49, 29, 'vanjaantonovic@gmail.com', 'IS this right?', '2024-07-24 12:13:55', 'uploads\\1719935463177.jpg', 'To Kill a Mockingbird');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `author` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `email`, `price`, `picture`, `time`, `author`, `genre`) VALUES
(1, 'Shoe At The End of The World', 'I am selling the book \"Shoe At The End of The World\" it\'s in a very good condition.', 'vanjaantonovic@gmail.com', '15.00', 'uploads\\1719487720875.jpg', '2024-06-27 11:28:40', 'Dejan Aleksić', 'Children’s'),
(3, 'Percy Jackson & the Olympians: The Lightning Thief', 'Percy Jackson & the Olympians: The Lightning Thief book', 'vanjaantonovic@gmail.com', '15.00', 'uploads\\1719494445380.jpg', '2024-06-27 13:20:45', 'Rick Riordan', 'Fiction'),
(4, 'THE DIVINE COMEDY', 'I am selling the book \"Divine Comedy\" by Dante. Good condition', 'vanjaantonovic@gmail.com', '30.00', 'uploads\\1719526922131.jpg', '2024-06-27 13:47:40', 'Dante Alighieri', 'Poetry'),
(5, 'Dreamcatcher', 'I am selling the book \"Dreamcatcher\" a novel by Stephen King. It\'s in excellent condition', 'andriannajjj@gmail.com', '20.00', 'uploads\\1719496906972.jpg', '2024-06-27 14:01:46', 'Stephen King', 'Horror'),
(7, 'To Kill a Mockingbird', 'Hello guys. I am selling the \"To Kill a Mockingbird\" book. I finished it and I want to get rid of it. ', 'andrijapirot16@gmail.com', '7.00', 'uploads\\1719935463177.jpg', '2024-07-02 15:51:03', 'Harper Lee', 'Thriller'),
(9, 'The Lord of the Rings', 'I am selling a Lord of the Rings book. PERFECT condition ', 'vanjaantonovic@gmail.com', '15.00', 'uploads\\1721849205754.jpg', '2024-07-24 19:26:45', 'J.R.R. Tolkien', 'Fiction'),
(10, 'The Great Gatsby', 'I am selling the book \"The Great Gatsby\" It\'s still unopened so that is why the price is so high, it\'s a collector\'s piece. For a serious buyer, the price can be negotiated down.', 'filipantonovic@gmail.com', '250.00', 'uploads\\1721948223159.jpg', '2024-07-25 22:57:03', 'F. Scott Fitzgerald', 'Tragedy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chats_ibfk_1` (`buyer_id`),
  ADD KEY `chats_ibfk_2` (`seller_id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name` (`name`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_chats_messages` (`chat_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_email_posts` (`email`),
  ADD KEY `fk_genre_posts` (`genre`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `fk_buyer_chats` FOREIGN KEY (`buyer_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `fk_login_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `fk_login_seller` FOREIGN KEY (`seller_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `fk_seller_chats` FOREIGN KEY (`seller_id`) REFERENCES `login` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_chats_messages` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_email_posts` FOREIGN KEY (`email`) REFERENCES `login` (`email`),
  ADD CONSTRAINT `fk_genre_posts` FOREIGN KEY (`genre`) REFERENCES `genres` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
