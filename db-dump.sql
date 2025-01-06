/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.6.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: weather
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Cities`
--

DROP TABLE IF EXISTS `Cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cities` (
  `id` varchar(16) NOT NULL,
  `name` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cities`
--

LOCK TABLES `Cities` WRITE;
/*!40000 ALTER TABLE `Cities` DISABLE KEYS */;
INSERT INTO `Cities` VALUES
('egy','Budapest'),
('három','Sopron'),
('hat','Bélapátfalva'),
('hét','Ózd'),
('kettő','Debrecen'),
('kilenc','Székesfehérvár'),
('négy','Miskolc'),
('nyolc','Szilvásvárad'),
('öt','Eger'),
('tíz','Tihany'),
('tizenegy','Balaton'),
('tizenhárom','Gyula'),
('tizenkettő','Pécs'),
('tizennégy','Győr'),
('tizenöt','Tatabánya');
/*!40000 ALTER TABLE `Cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Winds`
--

DROP TABLE IF EXISTS `Winds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Winds` (
  `city_id` varchar(16) NOT NULL,
  `date` varchar(12) NOT NULL,
  `hour` tinyint(2) unsigned NOT NULL,
  `wind_magnitude` decimal(4,1) unsigned NOT NULL,
  `wind_direction` varchar(3) NOT NULL,
  PRIMARY KEY (`city_id`,`date`,`hour`),
  CONSTRAINT `fk_city_id` FOREIGN KEY (`city_id`) REFERENCES `Cities` (`id`),
  CONSTRAINT `ck_hour` CHECK (`hour` between 0 and 23),
  CONSTRAINT `ck_wind_direction` CHECK (`wind_direction` in ('E','K','D','NY','EK','DK','DNY','ENY')),
  CONSTRAINT `ck_date` CHECK (`date` regexp '^[0-9]+\\.[0-9]{2}\\.[0-9]{2}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Winds`
--

LOCK TABLES `Winds` WRITE;
/*!40000 ALTER TABLE `Winds` DISABLE KEYS */;
INSERT INTO `Winds` VALUES
('egy','2025.01.06',1,14.9,'ENY'),
('egy','2025.01.06',2,14.8,'E'),
('egy','2025.01.06',3,900.0,'D');
/*!40000 ALTER TABLE `Winds` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-01-06 18:40:12
