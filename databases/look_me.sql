-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2025 at 04:27 PM
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
-- Database: `look_me`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `institution_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `check_in` datetime(3) DEFAULT NULL,
  `check_out` datetime(3) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `images` varchar(191) DEFAULT NULL,
  `lat` varchar(191) NOT NULL,
  `long` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `institution_id`, `user_id`, `check_in`, `check_out`, `type`, `images`, `lat`, `long`, `created_at`, `updated_at`) VALUES
(17, 1, 3, '2025-02-14 00:00:00.000', '2025-02-14 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(18, 1, 3, '2025-02-15 00:00:00.000', '2025-02-15 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(19, 1, 3, '2025-02-16 00:00:00.000', '2025-02-16 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(20, 1, 3, '2025-02-17 00:00:00.000', '2025-02-17 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(21, 1, 3, '2025-02-18 00:00:00.000', '2025-02-18 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(22, 1, 3, '2025-02-19 00:00:00.000', '2025-02-19 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(23, 1, 3, '2025-02-20 00:00:00.000', '2025-02-20 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887'),
(24, 1, 3, '2025-02-21 00:00:00.000', '2025-02-21 09:00:00.000', 'Sickness', '', '', '', '2025-02-14 14:51:07.887', '2025-02-14 14:51:07.887');

-- --------------------------------------------------------

--
-- Table structure for table `black_lists`
--

CREATE TABLE `black_lists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `institution_id` int(11) NOT NULL,
  `event` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institutions`
--

CREATE TABLE `institutions` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `lat` varchar(191) NOT NULL,
  `long` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `address` text NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `lat`, `long`, `phone`, `email`, `address`, `logo`, `created_at`, `updated_at`) VALUES
(1, 'Madrasah Al-Ghazali', '-6.2089', '106.8456', '6285230648617', 'admin@lookme.com', 'Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465', 'https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png', '2025-02-14 03:47:38.283', '2025-02-14 03:47:38.283');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `routes` varchar(191) NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `routes`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, 'Long Live', 'Lagunya bagus banget gaissss', '', 1, '2025-02-14 10:48:42.000', '2025-02-14 03:56:02.512');

-- --------------------------------------------------------

--
-- Table structure for table `operating_hours`
--

CREATE TABLE `operating_hours` (
  `id` int(11) NOT NULL,
  `start_time` datetime(3) NOT NULL,
  `end_time` datetime(3) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `late_tolerance` int(11) NOT NULL,
  `institution_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `operating_hours`
--

INSERT INTO `operating_hours` (`id`, `start_time`, `end_time`, `status`, `late_tolerance`, `institution_id`, `created_at`, `updated_at`) VALUES
(1, '2025-02-12 01:00:00.000', '2025-02-12 10:00:00.000', 1, 15, 1, '2025-02-14 03:47:38.292', '2025-02-14 03:47:38.292');

-- --------------------------------------------------------

--
-- Table structure for table `permission_requests`
--

CREATE TABLE `permission_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `desc` text NOT NULL,
  `type` enum('Sickness','Leave','Permission') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `file` varchar(191) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Accepted','Approved','Revised','Rejected') NOT NULL DEFAULT 'Pending',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_requests`
--

INSERT INTO `permission_requests` (`id`, `user_id`, `title`, `desc`, `type`, `start_date`, `end_date`, `file`, `reason`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'Permohonan Izin (Sakit)', 'Saya izin tidak bisa masuk', 'Sickness', '2025-02-14', '2025-02-21', NULL, '', 'Approved', '2025-02-14 21:01:21.000', '2025-02-14 14:51:07.883');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', '2025-02-14 03:47:38.271', '2025-02-14 03:47:38.271'),
(2, 'Kepala Pegawai', '2025-02-14 03:47:38.271', '2025-02-14 03:47:38.271'),
(3, 'Pegawai', '2025-02-14 03:47:38.271', '2025-02-14 03:47:38.271');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female') DEFAULT 'Male',
  `expired_otp` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `thumbnail` varchar(191) DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`description`)),
  `is_edit` tinyint(1) DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `phone`, `date_of_birth`, `gender`, `expired_otp`, `address`, `thumbnail`, `description`, `is_edit`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', '$2b$10$hLP4Y3KibLFWzxTty51iZem.t4zI4DanCXeFCHQzMB6BDLrgoSnrG', 'umar.ovie@gmail.com', '6285230648617', '2000-01-01', 'Male', NULL, 'Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465', 'https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png', 'null', 0, '2025-02-14 03:47:38.265', '2025-02-14 13:32:23.536'),
(2, 'Kepala Pegawai', '$2b$10$Ts/Bp5cY5Z5Q9hBR9fFUc.Z1erjpB5g9dwmYK8DyU0IYmV2iLgcfy', 'umar@unira.ac.id', '6285230648617', '2000-01-01', 'Male', NULL, 'Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465', 'https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png', 'null', 0, '2025-02-14 03:47:38.265', '2025-02-14 13:55:16.717'),
(3, 'Pegawai', '$2b$10$xTl.RWyupSmrVknFeWI4sOHmvD4R.ZVOqnJ1Z/voZcjyRoMG4xrS6', 'muhammadumarmansyur2001@gmail.com', '6285230648617', '2000-01-01', 'Male', NULL, 'Jl. Simpang Tiga Madrasah Al-Ghazali Rombasan Pragaan Sumenep 69465', 'https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png', 'null', 0, '2025-02-14 03:47:38.265', '2025-02-14 03:47:38.265');

-- --------------------------------------------------------

--
-- Table structure for table `user_institutions`
--

CREATE TABLE `user_institutions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `institution_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_institutions`
--

INSERT INTO `user_institutions` (`id`, `user_id`, `institution_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-02-14 03:47:38.287', '2025-02-14 13:32:23.542'),
(2, 2, 1, '2025-02-14 03:47:38.287', '2025-02-14 13:55:16.721'),
(3, 3, 1, '2025-02-14 03:47:38.287', '2025-02-14 03:47:38.287');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-02-14 03:47:38.276', '2025-02-14 03:47:38.276'),
(3, 3, 3, '2025-02-14 03:47:38.276', '2025-02-14 03:47:38.276'),
(9, 2, 2, '2025-02-14 13:31:45.980', '2025-02-14 13:31:45.980');

-- --------------------------------------------------------

--
-- Table structure for table `warning_letters`
--

CREATE TABLE `warning_letters` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('396c0f37-9fe3-4a9b-ba30-00ae351a21f6', 'ff14d30ed6b95805e08997d0b864d0b1bd5358c41275d7dea83717626a333456', '2025-02-14 03:47:37.560', '20250214034735_init', NULL, NULL, '2025-02-14 03:47:35.381', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_institution_id_fkey` (`institution_id`),
  ADD KEY `attendances_user_id_fkey` (`user_id`);

--
-- Indexes for table `black_lists`
--
ALTER TABLE `black_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `black_lists_user_id_fkey` (`user_id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD KEY `holidays_institution_id_fkey` (`institution_id`);

--
-- Indexes for table `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_fkey` (`user_id`);

--
-- Indexes for table `operating_hours`
--
ALTER TABLE `operating_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `operating_hours_institution_id_fkey` (`institution_id`);

--
-- Indexes for table `permission_requests`
--
ALTER TABLE `permission_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permission_requests_user_id_fkey` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_key` (`username`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `user_institutions`
--
ALTER TABLE `user_institutions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_institutions_user_id_fkey` (`user_id`),
  ADD KEY `user_institutions_institution_id_fkey` (`institution_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_roles_user_id_fkey` (`user_id`),
  ADD KEY `user_roles_role_id_fkey` (`role_id`);

--
-- Indexes for table `warning_letters`
--
ALTER TABLE `warning_letters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warning_letters_user_id_fkey` (`user_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `black_lists`
--
ALTER TABLE `black_lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `operating_hours`
--
ALTER TABLE `operating_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permission_requests`
--
ALTER TABLE `permission_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_institutions`
--
ALTER TABLE `user_institutions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `warning_letters`
--
ALTER TABLE `warning_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `black_lists`
--
ALTER TABLE `black_lists`
  ADD CONSTRAINT `black_lists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `holidays`
--
ALTER TABLE `holidays`
  ADD CONSTRAINT `holidays_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `operating_hours`
--
ALTER TABLE `operating_hours`
  ADD CONSTRAINT `operating_hours_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permission_requests`
--
ALTER TABLE `permission_requests`
  ADD CONSTRAINT `permission_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_institutions`
--
ALTER TABLE `user_institutions`
  ADD CONSTRAINT `user_institutions_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_institutions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `warning_letters`
--
ALTER TABLE `warning_letters`
  ADD CONSTRAINT `warning_letters_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
