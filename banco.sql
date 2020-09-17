-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09-Set-2020 às 05:09
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
  `description` varchar(255) NOT NULL,
  `protocol` varchar(5) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip` varchar(14) DEFAULT NULL,
  `port` varchar(6) DEFAULT NULL,
  `last_status` varchar(255) DEFAULT 'success',
  `last_check` datetime DEFAULT NULL,
  `attempts_error` int(1) DEFAULT 0,
  `attempts_success` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `applications`
--

INSERT INTO `applications` (`id`, `users_id`, `description`, `protocol`, `url`, `ip`, `port`, `last_status`, `last_check`, `attempts_error`, `attempts_success`) VALUES
(1, 4, 'Monitoramento site do google', 'https', 'google.com.br', NULL, NULL, 'success', '2020-07-14 00:45:46', 0, 0),
(4, 6, 'Monitoring uol', 'https', 'uol.com.br', NULL, NULL, 'success', '2020-07-14 00:45:46', 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `plans_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `document` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `customers`
--

INSERT INTO `customers` (`id`, `plans_id`, `name`, `email`, `address`, `city`, `phone_number`, `document`) VALUES
(1, 2, 'Hudson Libério Leão', 'hudsonleaoti@gmail.com', 'Rua A, 562 - São Tomé', '37999855488', '37999855488', '13015116681'),
(2, 1, 'Test customer 2', 'test@gmail.com', 'Rua B', 'Bom Despacho', '3799999999', '111111111111');

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
(2, 'Pro', 'Pro plan, 10 users, 50 applications and 10 servers.', 10, 50, 10);

-- --------------------------------------------------------

--
-- Estrutura da tabela `servers`
--

CREATE TABLE `servers` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `key_ssh` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `servers`
--

INSERT INTO `servers` (`id`, `users_id`, `description`, `ip`, `key_ssh`) VALUES
(1, 6, 'Server google', '8.8.8.8', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `customers_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` int(1) NOT NULL DEFAULT 1 COMMENT '1 - Normal\r\n2- Admin\r\n3-Super Admin'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `customers_id`, `name`, `user`, `password`, `level`) VALUES
(4, 1, 'Administrador', 'admin@monitoramos.com.br', 'f73119e41141c8af5b0c047c11e6df28', 3),
(6, 1, 'Hudson Libério Leão', 'hudsonleaoti@gmail.com', '329dd6b5891e07fd5a2ca76f797ec758', 3);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_id` (`users_id`);

--
-- Índices para tabela `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_plan` (`plans_id`);

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
  ADD KEY `users_id` (`users_id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_customer` (`customers_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `usuarios_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customer_plan` FOREIGN KEY (`plans_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `servers`
--
ALTER TABLE `servers`
  ADD CONSTRAINT `users_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_customer` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
