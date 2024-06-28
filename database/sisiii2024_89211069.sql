-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:5306
-- Generation Time: Jun 28, 2024 at 11:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sisiii2024_89211069`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `buyer_id`, `seller_id`) VALUES
(20, 1, 2),
(21, 3, 2),
(22, 3, 1),
(24, 4, 1);

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
(1, 'Vanja', 'vanjaantonovic@gmail.com', 'Vanja12345', 'uploads\\1719497065815.jpg'),
(2, 'Andriana', 'andriannajjj@gmail.com', 'Andriana12345', 'uploads/default_image.png'),
(3, 'Stefan', 'stefanmzt@gmail.com', 'Stefan123', 'uploads\\1719527096282.jpg'),
(4, 'Filip', 'filipantonovic@gmail.com', 'Filip12345', 'uploads/default_image.png');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `user_email`, `message`, `timestamp`) VALUES
(9, 21, 'stefanmzt@gmail.com', 'Hello', '2024-06-28 18:40:05'),
(10, 22, 'stefanmzt@gmail.com', 'Good Book', '2024-06-28 18:40:22'),
(11, 20, 'vanjaantonovic@gmail.com', 'Nice book by my man steven', '2024-06-28 18:41:10'),
(12, 20, 'vanjaantonovic@gmail.com', 'Dreamcathcer', '2024-06-28 18:43:54'),
(13, 20, 'andriannajjj@gmail.com', 'Hahah yea', '2024-06-28 18:44:23'),
(14, 21, 'andriannajjj@gmail.com', 'Hello stefan from andriana', '2024-06-28 18:44:42'),
(15, 20, 'vanjaantonovic@gmail.com', 'Niceee', '2024-06-28 19:35:34'),
(16, 22, 'vanjaantonovic@gmail.com', 'Yea it is', '2024-06-28 19:42:12'),
(17, 20, 'andriannajjj@gmail.com', 'Do you want to buy it?', '2024-06-28 19:43:05'),
(18, 21, 'andriannajjj@gmail.com', 'Do you want to buy the book or what?', '2024-06-28 19:43:18'),
(19, 22, 'stefanmzt@gmail.com', 'I want to buy it', '2024-06-28 19:43:47'),
(20, 22, 'vanjaantonovic@gmail.com', 'Can you do like 100$ for it?', '2024-06-28 20:13:36'),
(21, 20, 'andriannajjj@gmail.com', 'Are you there??', '2024-06-28 21:20:38'),
(22, 20, 'andriannajjj@gmail.com', 'This is a good book also. I want to buy it', '2024-06-28 21:30:37'),
(23, 20, 'vanjaantonovic@gmail.com', 'Hm I might want to sell it to you', '2024-06-28 21:31:55'),
(24, 24, 'filipantonovic@gmail.com', 'Hey I might be interested in buying the Divine Comedy off of you :D', '2024-06-28 21:49:27'),
(25, 24, 'vanjaantonovic@gmail.com', 'Don\'t send me those cringe smilies', '2024-06-28 21:49:50');

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
  `author` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `email`, `price`, `picture`, `time`, `author`) VALUES
(1, 'Shoe At The End of The World', 'I am selling the book \"Shoe At The End of The World\" it\'s in a very good condition.', 'vanjaantonovic@gmail.com', 15.00, 'uploads\\1719487720875.jpg', '2024-06-27 11:28:40', 'Dejan Aleksić'),
(3, 'Percy Jackson & the Olympians: The Lightning Thief', 'Percy Jackson & the Olympians: The Lightning Thief book', 'vanjaantonovic@gmail.com', 15.00, 'uploads\\1719494445380.jpg', '2024-06-27 13:20:45', 'Rick Riordan'),
(4, 'THE DIVINE COMEDY', 'I am selling the book \"Divine Comedy\" by Dante. Good condition', 'vanjaantonovic@gmail.com', 30.00, 'uploads\\1719526922131.jpg', '2024-06-27 13:47:40', 'Dante Alighieri'),
(5, 'Dreamcatcher', 'I am selling the book \"Dreamcatcher\" a novel by Stephen King. It\'s in excellent condition', 'andriannajjj@gmail.com', 20.00, 'uploads\\1719496906972.jpg', '2024-06-27 14:01:46', 'Stephen King');

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
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `login` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
