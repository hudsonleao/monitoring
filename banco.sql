-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09-Out-2020 às 01:33
-- Versão do servidor: 10.4.13-MariaDB
-- versão do PHP: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `monitoring`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `users_telegram_id` int(11) DEFAULT NULL,
  `triggers_id` int(11) DEFAULT NULL,
  `servers_id` int(11) DEFAULT NULL,
  `protocol` varchar(5) CHARACTER SET latin1 NOT NULL,
  `url_or_ip` varchar(255) CHARACTER SET latin1 NOT NULL,
  `port` varchar(6) CHARACTER SET latin1 DEFAULT NULL,
  `correct_request_status` int(3) NOT NULL,
  `last_status` varchar(255) NOT NULL DEFAULT 'unchecked',
  `check_interval` int(255) NOT NULL,
  `queue_status` varchar(1) CHARACTER SET latin1 DEFAULT 'A' COMMENT 'A - Await|P - Processing|F-Finished|E-Error',
  `last_check` datetime DEFAULT NULL,
  `next_check` datetime DEFAULT NULL,
  `attempts_limit` int(11) NOT NULL,
  `attempts_error` int(1) DEFAULT 0,
  `attempts_success` int(1) DEFAULT 0,
  `created_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `plans_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `customers`
--

INSERT INTO `customers` (`id`, `plans_id`, `name`, `email`, `address`, `city`, `phone_number`, `document`) VALUES
(1, 2, 'Admin', 'admin@monitoramos.com.br', 'Rua A, 562 - São Tomé', '37999999999', '37999999999', '222222222222');

-- --------------------------------------------------------

--
-- Estrutura da tabela `forgot_password`
--

CREATE TABLE `forgot_password` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `created_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `users_limit` int(11) NOT NULL,
  `applications_limit` int(11) NOT NULL,
  `servers_limit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `plans`
--

INSERT INTO `plans` (`id`, `name`, `description`, `users_limit`, `applications_limit`, `servers_limit`) VALUES
(1, 'Free', 'Free plan, 2 users, 10 applications and 2 servers.', 2, 10, 2),
(2, 'Pro', 'Professional plan, 10 users, 50 applications and 10 servers.', 10, 50, 10);

-- --------------------------------------------------------

--
-- Estrutura da tabela `servers`
--

CREATE TABLE `servers` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `server_user` varchar(255) NOT NULL,
  `server_ip` varchar(255) NOT NULL,
  `server_ssh_port` int(6) NOT NULL DEFAULT 22,
  `ssh_key_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `triggers`
--

CREATE TABLE `triggers` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `command` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `customers_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `user` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 NOT NULL,
  `level` int(1) NOT NULL DEFAULT 1,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `customers_id`, `name`, `user`, `password`, `level`, `created_date`) VALUES
(1, 1, 'Administrator', 'admin@monitoramos.com.br', 'f73119e41141c8af5b0c047c11e6df28', 3, '2020-10-02 22:42:34');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users_level`
--

CREATE TABLE `users_level` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `users_level`
--

INSERT INTO `users_level` (`id`, `name`) VALUES
(1, 'Normal'),
(2, 'Admin'),
(3, 'Super Admin');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users_ssh_key`
--

CREATE TABLE `users_ssh_key` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `users_id` int(11) NOT NULL,
  `ssh_key` varchar(500) NOT NULL,
  `key_name` varchar(255) NOT NULL,
  `expiration_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users_telegram`
--

CREATE TABLE `users_telegram` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bot_id` varchar(255) NOT NULL,
  `telegram_chat_id` varchar(255) NOT NULL,
  `message_success` varchar(255) NOT NULL,
  `message_error` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servers_id` (`servers_id`),
  ADD KEY `triggers_id` (`triggers_id`),
  ADD KEY `users_telegram_id` (`users_telegram_id`),
  ADD KEY `users_id` (`users_id`);

--
-- Índices para tabela `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_plan` (`plans_id`);

--
-- Índices para tabela `forgot_password`
--
ALTER TABLE `forgot_password`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_id` (`users_id`),
  ADD KEY `ssh_key_id` (`ssh_key_id`);

--
-- Índices para tabela `triggers`
--
ALTER TABLE `triggers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id2` (`users_id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_customer` (`customers_id`),
  ADD KEY `user_level` (`level`);

--
-- Índices para tabela `users_level`
--
ALTER TABLE `users_level`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `users_ssh_key`
--
ALTER TABLE `users_ssh_key`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id3` (`users_id`);

--
-- Índices para tabela `users_telegram`
--
ALTER TABLE `users_telegram`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id4` (`users_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `forgot_password`
--
ALTER TABLE `forgot_password`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `triggers`
--
ALTER TABLE `triggers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `users_level`
--
ALTER TABLE `users_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `users_ssh_key`
--
ALTER TABLE `users_ssh_key`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users_telegram`
--
ALTER TABLE `users_telegram`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `servers_id` FOREIGN KEY (`servers_id`) REFERENCES `servers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `triggers_id` FOREIGN KEY (`triggers_id`) REFERENCES `triggers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `users_telegram_id` FOREIGN KEY (`users_telegram_id`) REFERENCES `users_telegram` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customer_plan` FOREIGN KEY (`plans_id`) REFERENCES `plans` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `servers`
--
ALTER TABLE `servers`
  ADD CONSTRAINT `ssh_key_id` FOREIGN KEY (`ssh_key_id`) REFERENCES `users_ssh_key` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuarios_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `triggers`
--
ALTER TABLE `triggers`
  ADD CONSTRAINT `users_id2` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_customer` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_level` FOREIGN KEY (`level`) REFERENCES `users_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `users_ssh_key`
--
ALTER TABLE `users_ssh_key`
  ADD CONSTRAINT `users_id3` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `users_telegram`
--
ALTER TABLE `users_telegram`
  ADD CONSTRAINT `users_id4` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
