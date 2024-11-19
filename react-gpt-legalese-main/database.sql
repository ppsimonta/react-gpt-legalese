--
-- Database: `chatbot_db`
--
CREATE DATABASE IF NOT EXISTS `chatbot_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `chatbot_db`;

-- --------------------------------------------------------

--
-- Table structure for table `questions_answers`
--

CREATE TABLE `questions_answers` (
  `id` int(11) NOT NULL,
  `original_text` longtext NOT NULL,
  `explanation_text` longtext NOT NULL,
  `action_text` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

