-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema sitefca
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sitefca
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sitefca` DEFAULT CHARACTER SET utf8 ;
USE `sitefca` ;

-- -----------------------------------------------------
-- Table `sitefca`.`accoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`accoes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NOT NULL,
  `tipo` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`area`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`area` (
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
-- Table `sitefca`.`area-oleos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`area-oleos` (
  `area` INT(11) NULL DEFAULT NULL,
  `oleo` INT(11) NULL DEFAULT NULL,
  `Utilização` VARCHAR(255) NULL DEFAULT NULL,
  `embalagem` INT(11) NULL DEFAULT NULL,
  `stock_minimo` INT(11) NULL DEFAULT NULL,
  `stock` INT(11) NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`area-utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`area-utilizador` (
  `area` INT(11) NULL DEFAULT NULL,
  `utilizador` INT(11) NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`autorizacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`autorizacoes` (
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
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`emabalagens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`emabalagens` (
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
-- Table `sitefca`.`encomendas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`encomendas` (
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
-- Table `sitefca`.`equipamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`equipamento` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `equipamento` VARCHAR(100) NULL DEFAULT NULL,
  `unidade` INT(11) NULL DEFAULT NULL,
  `estado` INT(11) NOT NULL,
  `tipo` INT(11) NOT NULL,
  `relatorio` INT(6) NOT NULL,
  `descricao` MEDIUMTEXT NULL DEFAULT NULL,
  `status` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`feed`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`feed` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NULL DEFAULT NULL,
  `titulo` VARCHAR(45) NULL DEFAULT NULL,
  `data` DATE NULL DEFAULT NULL,
  `texto` LONGTEXT NULL DEFAULT NULL,
  `publicar` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`firma`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`firma` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`horas-de-marcha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`horas-de-marcha` (
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
-- Table `sitefca`.`manobras-processo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`manobras-processo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(300) NULL DEFAULT NULL,
  `unidade` INT(11) NULL DEFAULT NULL,
  `criador` INT(11) NULL DEFAULT NULL,
  `relatorio` INT(11) NULL DEFAULT NULL,
  `manobra` MEDIUMTEXT NULL DEFAULT NULL,
  `comentarios` MEDIUMTEXT NULL DEFAULT NULL,
  `descricao` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 49
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`manobras-processo-passos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`manobras-processo-passos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(200) NULL DEFAULT NULL,
  `manobra` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`oleo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`oleo` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Designacao` VARCHAR(255) NULL DEFAULT NULL,
  `Referencia` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`))
ENGINE = MyISAM
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`pedidos-trabalho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`pedidos-trabalho` (
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
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`registos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`registos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data` VARCHAR(45) NOT NULL,
  `hora` VARCHAR(45) NOT NULL,
  `autorizacao` INT(11) NOT NULL,
  `relatorio` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 39
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`relatorios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`relatorios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `turno` INT(11) NOT NULL,
  `data` DATE NOT NULL,
  `utilizador` INT(11) NOT NULL,
  `area` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 156
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`relatorios-output`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`relatorios-output` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `dados` LONGTEXT NULL DEFAULT NULL,
  `relatorio` INT(11) NULL DEFAULT NULL,
  `area` INT(11) NULL DEFAULT NULL,
  `versao` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 56
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`relatorios-templates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`relatorios-templates` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `template` LONGTEXT NULL DEFAULT NULL,
  `area` INT(11) NULL DEFAULT NULL,
  `versao` INT(11) NULL DEFAULT NULL,
  `utilizador` INT(11) NULL DEFAULT NULL,
  `data` DATE NULL DEFAULT NULL,
  `separadores` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 62
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`status-equipamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`status-equipamento` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `relatorio` INT(11) NOT NULL,
  `equipamento` INT(11) NOT NULL,
  `accao` INT(11) NOT NULL,
  `data` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `comentario` MEDIUMTEXT NULL DEFAULT NULL,
  `descricao` MEDIUMTEXT NULL DEFAULT NULL,
  `status` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 79
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`status-etapas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`status-etapas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `status` INT(11) NULL DEFAULT NULL,
  `accao` TINYTEXT NULL DEFAULT NULL,
  `data` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `relatorio` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`stoks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`stoks` (
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
-- Table `sitefca`.`unidades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`unidades` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `designacao` VARCHAR(45) NULL DEFAULT NULL,
  `area` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = MyISAM
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sitefca`.`utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`utilizador` (
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

USE `sitefca` ;

-- -----------------------------------------------------
-- Placeholder table for view `sitefca`.`autorizacoes_pesquiza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sitefca`.`autorizacoes_pesquiza` (`ID` INT, `Numero` INT, `Descricao do trabalho` INT, `Nome` INT, `Data fim` INT);

-- -----------------------------------------------------
-- View `sitefca`.`autorizacoes_pesquiza`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sitefca`.`autorizacoes_pesquiza`;
USE `sitefca`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `sitefca`.`autorizacoes_pesquiza` AS select `sitefca`.`autorizacoes`.`ID` AS `ID`,`sitefca`.`autorizacoes`.`Numero` AS `Numero`,`sitefca`.`autorizacoes`.`Descricao do trabalho` AS `Descricao do trabalho`,`sitefca`.`firma`.`Nome` AS `Nome`,`sitefca`.`autorizacoes`.`Data fim` AS `Data fim` from (`sitefca`.`firma` join `sitefca`.`autorizacoes` on((`sitefca`.`firma`.`ID` = `sitefca`.`autorizacoes`.`Firma`)));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
