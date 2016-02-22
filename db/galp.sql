-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema galp
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema galp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `galp-teste` DEFAULT CHARACTER SET utf8 ;
USE `galp` ;


CREATE TABLE `galp`.`relatorios-templates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `template` MEDIUMTEXT NULL,
  `area` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM;


CREATE TABLE IF NOT EXISTS `galp`.`feed` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NULL,
  `nome` VARCHAR(45) NULL,
  `data` VARCHAR(45) NULL,
  `texto` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM;

ALTER TABLE `galp`.`manobras-processo` 
ADD COLUMN `manobra` MEDIUMTEXT NULL AFTER `relatorio` ,
ADD COLUMN `comentarios` MEDIUMTEXT NULL  AFTER `manobra` ;

ALTER TABLE `galp`.`relatorios-output` 
CHANGE COLUMN `relatorio` `relatorio` INT(11) NULL ,
CHANGE COLUMN `unidade` `area` INT(11) NULL ,
ADD COLUMN `versao` INT NULL AFTER `area`;


ALTER TABLE `galp`.`relatorios-templates` 
ADD COLUMN `versao` INT NULL AFTER `area`,
ADD COLUMN `utilizador` INT NULL AFTER `versao`,
ADD COLUMN `data` date NULL AFTER `utilizador`;

ALTER TABLE `galp`.`feed` 
CHANGE COLUMN `nome` `titulo` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `data` `data` DATE NULL DEFAULT NULL ,
CHANGE COLUMN `texto` `texto` LONGTEXT NULL DEFAULT NULL ,
ADD COLUMN `publicar` INT NULL AFTER `texto`;

ALTER TABLE `galp`.`relatorios-templates` 
ADD COLUMN `separadores` MEDIUMTEXT NULL AFTER `data`;
-- -----------------------------------------------------
-- Table `galp`.`accoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`accoes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`area`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`area` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Area` VARCHAR(255) NULL DEFAULT NULL,
  `unidades` VARCHAR(255) NULL DEFAULT NULL,
  `Centro de custo` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  INDEX `Area` (`Area` ASC))
ENGINE = MyISAM
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`area-oleos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`area-oleos` (
  `area` INT(11) NULL DEFAULT NULL,
  `oleo` INT(11) NULL DEFAULT NULL,
  `Utilização` VARCHAR(255) NULL DEFAULT NULL,
  `embalagem` INT(11) NULL DEFAULT NULL,
  `stock_minimo` INT(11) NULL DEFAULT NULL,
  `stock` INT(11) NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`area-utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`area-utilizador` (
  `area` INT(11) NULL DEFAULT NULL,
  `utilizador` INT(11) NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`autorizacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`autorizacoes` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Firma` INT(11) NULL DEFAULT NULL,
  `Descricao do trabalho` VARCHAR(255) NULL DEFAULT NULL,
  `Data inicio` DATETIME NULL DEFAULT NULL,
  `Data fim` DATETIME NULL DEFAULT NULL,
  `Numero` INT(11) NULL DEFAULT NULL,
  `Area` INT(11) NULL DEFAULT NULL,
  `Tipo` INT(11) NULL DEFAULT NULL,
  `unidade` INT(11) NULL DEFAULT NULL,
  `equipamento` INT(6) NULL DEFAULT NULL,
  `relatorio` INT(10) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 256
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`emabalagens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`emabalagens` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `oleo` INT(11) NULL DEFAULT NULL,
  `Codigo_oleo` VARCHAR(255) NULL DEFAULT NULL,
  `Capacidade` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  INDEX `Código_óleo` (`Codigo_oleo` ASC))
ENGINE = MyISAM
AUTO_INCREMENT = 110
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`encomendas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`encomendas` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Data_de_encomenda` DATETIME NULL DEFAULT NULL,
  `Data_de_rececao` DATETIME NULL DEFAULT NULL,
  `Utilizador` INT(11) NULL DEFAULT NULL,
  `Oleo` INT(11) NULL DEFAULT NULL,
  `Qantidade` INT(11) NULL DEFAULT NULL,
  `Embalagem` INT(11) NULL DEFAULT NULL,
  `area` INT(11) NULL DEFAULT NULL,
  `Tipo` INT(11) NULL DEFAULT NULL,
  `Descricao` LONGTEXT NULL DEFAULT NULL,
  `Marcador` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 360
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`equipamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`equipamento` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `equipamento` VARCHAR(100) NULL DEFAULT NULL,
  `unidade` INT(11) NULL DEFAULT NULL,
  `estado` INT(11) NOT NULL,
  `tipo` INT(11) NOT NULL,
  `relatorio` INT(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 48
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`firma`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`firma` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`horas-de-marcha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`horas-de-marcha` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `equipamento` INT(11) NOT NULL,
  `horas` INT(11) NOT NULL,
  `last-status` INT(11) NOT NULL,
  `data` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`manobras-processo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`manobras-processo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(300) NULL DEFAULT NULL,
  `unidade` INT(11) NULL DEFAULT NULL,
  `criador` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`manobras-processo-passos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`manobras-processo-passos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NULL DEFAULT NULL,
  `manobra` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`oleo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`oleo` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Designacao` VARCHAR(255) NULL DEFAULT NULL,
  `Referencia` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`pedidos-trabalho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`pedidos-trabalho` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(300) NOT NULL,
  `equipamento` INT(6) NOT NULL,
  `data` DATETIME NOT NULL,
  `unidade` INT(6) NOT NULL,
  `prioridade` INT(6) NOT NULL,
  `autorizacao` INT(11) NULL DEFAULT NULL,
  `estado` INT(6) NOT NULL,
  `utilizador` INT(10) NOT NULL,
  `relatorio` INT(10) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`registos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`registos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data` VARCHAR(45) NOT NULL,
  `hora` VARCHAR(45) NOT NULL,
  `autorizacao` INT(11) NOT NULL,
  `relatorio` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`relatorios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`relatorios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `turno` INT(11) NOT NULL,
  `data` DATE NOT NULL,
  `utilizador` INT(11) NOT NULL,
  `area` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`status-equipamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`status-equipamento` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `relatorio` INT(11) NOT NULL,
  `equipamento` INT(11) NOT NULL,
  `accao` INT(11) NOT NULL,
  `data` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`stoks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`stoks` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Stock` INT(11) NULL DEFAULT NULL,
  `StocK_minimo` INT(11) NULL DEFAULT NULL,
  `Embalagem` INT(11) NULL DEFAULT NULL,
  `Area` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`unidades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`unidades` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `designacao` VARCHAR(45) NULL DEFAULT NULL,
  `area` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `galp`.`utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`utilizador` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(255) NULL DEFAULT NULL,
  `E_Mail` VARCHAR(255) NULL DEFAULT NULL,
  `Tipo` INT(11) NULL DEFAULT NULL,
  `Pass` VARCHAR(255) NULL DEFAULT NULL,
  `utilizadorcol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 12345679
DEFAULT CHARACTER SET = utf8;

USE `galp` ;

-- -----------------------------------------------------
-- Placeholder table for view `galp`.`autorizacoes_pesquiza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galp`.`autorizacoes_pesquiza` (`ID` INT, `Numero` INT, `Descricao do trabalho` INT, `Nome` INT, `Data fim` INT);

-- -----------------------------------------------------
-- View `galp`.`autorizacoes_pesquiza`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `galp`.`autorizacoes_pesquiza`;
USE `galp`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `galp`.`autorizacoes_pesquiza` AS select `galp`.`autorizacoes`.`ID` AS `ID`,`galp`.`autorizacoes`.`Numero` AS `Numero`,`galp`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`galp`.`firma`.`Nome` AS `Nome`,`galp`.`autorizacoes`.`Data fim` AS `Data fim` from (`galp`.`firma` join `galp`.`autorizacoes` on((`galp`.`firma`.`ID` = `galp`.`autorizacoes`.`Firma`)));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
