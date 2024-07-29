-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: ahs_wos
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baselines`
--

DROP TABLE IF EXISTS `baselines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baselines` (
  `baselineid` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  PRIMARY KEY (`baselineid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baselines`
--

LOCK TABLES `baselines` WRITE;
/*!40000 ALTER TABLE `baselines` DISABLE KEYS */;
INSERT INTO `baselines` VALUES (1,'5policiesbyMrIruan.csv');
/*!40000 ALTER TABLE `baselines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `benchmarks`
--

DROP TABLE IF EXISTS `benchmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benchmarks` (
  `benchmarkid` int NOT NULL AUTO_INCREMENT,
  `original_filename` varchar(255) NOT NULL,
  `csv_filename` varchar(255) NOT NULL,
  PRIMARY KEY (`benchmarkid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benchmarks`
--

LOCK TABLES `benchmarks` WRITE;
/*!40000 ALTER TABLE `benchmarks` DISABLE KEYS */;
INSERT INTO `benchmarks` VALUES (1,'CIS_Microsoft_Windows_11_Enterprise_Benchmark_v3.0.0.pdf','first page found!\nMicrosoft Windows 11 Enterprise.csv'),(2,'CIS_Microsoft_Windows_11_Enterprise_Benchmark_v3.0.0.pdf','Microsoft_Windows_11_Enterprise.csv'),(3,'CIS_Microsoft_Windows_Server_2019_Stand-alone_v1.0.0.pdf','Microsoft_Windows_Server_2019_Stand_-alone.csv'),(4,'CIS_Microsoft_Windows_Server_2019_Stand-alone_v1.0.0.pdf','Microsoft_Windows_Server_2019_Stand_-alone.csv'),(5,'CIS_Microsoft_Windows_11_Enterprise_Benchmark_v3.0.0.pdf','Microsoft_Windows_11_Enterprise.csv'),(6,'CIS_Microsoft_Windows_Server_2019_Stand-alone_v1.0.0.pdf','Microsoft_Windows_Server_2019_Stand_-alone.csv'),(7,'CIS_Microsoft_Windows_Server_2019_Stand-alone_v1.0.0.pdf','Microsoft_Windows_Server_2019_Stand_-alone.csv');
/*!40000 ALTER TABLE `benchmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `computers`
--

DROP TABLE IF EXISTS `computers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `computers` (
  `computerid` int NOT NULL AUTO_INCREMENT,
  `computer_name` varchar(255) NOT NULL,
  `ipaddress` varchar(15) NOT NULL,
  PRIMARY KEY (`computerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `computers`
--

LOCK TABLES `computers` WRITE;
/*!40000 ALTER TABLE `computers` DISABLE KEYS */;
/*!40000 ALTER TABLE `computers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scans`
--

DROP TABLE IF EXISTS `scans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scans` (
  `scanid` int NOT NULL AUTO_INCREMENT,
  `scanned_filename` varchar(255) NOT NULL,
  `ipaddress` varchar(15) NOT NULL,
  `created_at` varchar(100) NOT NULL,
  `lastscan_at` varchar(100) NOT NULL,
  PRIMARY KEY (`scanid`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scans`
--

LOCK TABLES `scans` WRITE;
/*!40000 ALTER TABLE `scans` DISABLE KEYS */;
INSERT INTO `scans` VALUES (1,'WinServer2019_192.168.126.145_2024-07-10_11-32-09.inf','192.168.126.145','2024:07:10T11:32:09Z','2024:07:10T11:32:09Z'),(2,'SysAdmin_192.168.126.144_2024-07-10_11-32-08.inf','192.168.126.144','2024:07:10T11:32:08Z','2024:07:10T11:32:08Z'),(3,'WinServer2019_192.168.126.145_2024-07-11_09-38-06.inf','192.168.126.145','2024:07:11T09:38:06Z','2024:07:11T09:38:06Z'),(4,'WinServer2019_192.168.126.145_2024-07-11_09-41-48.inf','192.168.126.145','2024:07:11T09:41:48Z','2024:07:11T09:41:48Z'),(5,'WinServer2019_192.168.126.145_2024-07-11_09-53-06.inf','192.168.126.145','2024:07:11T09:53:06Z','2024:07:11T09:53:06Z'),(6,'Client1_192.168.126.146_2024-07-11_09-53-07.inf','192.168.126.146','2024:07:11T09:53:07Z','2024:07:11T09:53:07Z'),(7,'WinServer2019_192.168.126.145_2024-07-11_13-54-12.inf','192.168.126.145','2024:07:11T13:54:12Z','2024:07:11T13:54:12Z'),(8,'WinServer2019_192.168.126.145_2024-07-11_13-54-29.inf','192.168.126.145','2024:07:11T13:54:29Z','2024:07:11T13:54:29Z'),(9,'WinServer2019_192.168.126.145_2024-07-12_11-16-03.inf','192.168.126.145','2024:07:12T11:16:03Z','2024:07:12T11:16:03Z'),(10,'WinServer2019_192.168.126.145_2024-07-15_06-20-58.inf','192.168.126.145','2024:07:15T06:20:58Z','2024:07:15T06:20:58Z'),(11,'WinServer2019_192.168.126.145_2024-07-15_06-27-48.inf','192.168.126.145','2024:07:15T06:27:48Z','2024:07:15T06:27:48Z'),(12,'WinServer2019_192.168.126.145_2024-07-15_06-28-45.inf','192.168.126.145','2024:07:15T06:28:45Z','2024:07:15T06:28:45Z'),(13,'WinServer2019_192.168.126.145_2024-07-15_06-30-06.inf','192.168.126.145','2024:07:15T06:30:06Z','2024:07:15T06:30:06Z'),(14,'WinServer2019_192.168.126.145_2024-07-15_06-36-46.inf','192.168.126.145','2024:07:15T06:36:46Z','2024:07:15T06:36:46Z'),(15,'WinServer2019_192.168.126.145_2024-07-15_12-31-19.inf','192.168.126.145','2024:07:15T12:31:19Z','2024:07:15T12:31:19Z'),(16,'WinServer2019_192.168.126.145_2024-07-15_12-33-34.inf','192.168.126.145','2024:07:15T12:33:34Z','2024:07:15T12:33:34Z'),(17,'SysAdmin_192.168.126.144_2024-07-15_13-28-35.inf','192.168.126.144','2024:07:15T13:28:35Z','2024:07:15T13:28:35Z'),(18,'SysAdmin_192.168.126.144_2024-07-15_13-29-14.inf','192.168.126.144','2024:07:15T13:29:14Z','2024:07:15T13:29:14Z'),(19,'WinServer2019_192.168.126.145_2024-07-16_16-21-55.inf','192.168.126.145','2024:07:16T16:21:55Z','2024:07:16T16:21:55Z'),(20,'Client1_192.168.126.146_2024-07-16_17-06-11.inf','192.168.126.146','2024:07:16T17:06:11Z','2024:07:16T17:06:11Z'),(21,'WinServer2019_192.168.126.145_2024-07-16_17-06-36.inf','192.168.126.145','2024:07:16T17:06:36Z','2024:07:16T17:06:36Z'),(22,'Client1_192.168.126.146_2024-07-16_17-06-37.inf','192.168.126.146','2024:07:16T17:06:37Z','2024:07:16T17:06:37Z'),(23,'WinServer2019_192.168.126.145_2024-07-16_17-07-28.inf','192.168.126.145','2024:07:16T17:07:28Z','2024:07:16T17:07:28Z'),(24,'Client1_192.168.126.146_2024-07-16_17-07-29.inf','192.168.126.146','2024:07:16T17:07:29Z','2024:07:16T17:07:29Z'),(25,'WinServer2019_192.168.126.145_2024-07-24_01-59-15.inf','192.168.126.145','2024:07:24T01:59:15Z','2024:07:24T01:59:15Z'),(26,'WinServer2019_192.168.126.145_2024-07-24_05-34-29.inf','192.168.126.145','2024:07:24T05:34:29Z','2024:07:24T05:34:29Z'),(27,'WinServer2019_192.168.126.145_2024-07-24_05-35-53.inf','192.168.126.145','2024:07:24T05:35:53Z','2024:07:24T05:35:53Z');
/*!40000 ALTER TABLE `scans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(10) DEFAULT 'user',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'root','root@gmail.com','$2b$10$bqkzOKOMGwZ43CiYpeElxOqc8cbbYaQUl5pnLyZZGp.UL5T8trguK','2024-07-21 16:15:17','admin'),(2,'admin1','admin1@gmail.com','$2b$10$6lD0y8LzcUHZ76sokY7jMe.5jhSJu9nP/lzcinx7Y.Wpkk80YplFq','2024-07-21 16:42:21','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-25  5:47:29
