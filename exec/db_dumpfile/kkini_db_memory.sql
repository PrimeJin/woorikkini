-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: i8A804.p.ssafy.io    Database: kkini_db
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `memory`
--

DROP TABLE IF EXISTS `memory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memory` (
  `memory_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_time` datetime(6) DEFAULT NULL,
  `updated_time` datetime(6) DEFAULT NULL,
  `memory_content` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memory_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`memory_id`),
  KEY `FK2cg9qyuh0x0vrbsdvusrncefc` (`user_id`),
  CONSTRAINT `FK2cg9qyuh0x0vrbsdvusrncefc` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memory`
--

LOCK TABLES `memory` WRITE;
/*!40000 ALTER TABLE `memory` DISABLE KEYS */;
INSERT INTO `memory` VALUES (1,'2023-02-17 03:56:03.341000','2023-02-17 03:56:03.341000','오랜만에 풀빵 사장님이 오셔서 풀빵을 사먹었다. 맛있다!!','오늘은 풀빵 먹은 날',2),(2,'2023-02-16 20:35:30.000000','2023-02-16 20:35:30.000000','오늘은 맛있는 김밥','오늘의 일기',1),(3,'2023-02-16 20:35:31.000000','2023-02-16 20:35:31.000000','너무 즐거웠던 날','오늘의 일기',1),(4,'2023-02-16 20:35:32.000000','2023-02-16 20:35:32.000000','배불러서 다 못먹은 날','오늘의 일기',1),(5,'2023-02-16 20:35:33.000000','2023-02-16 20:35:33.000000','조금 양이 아쉬운거 같기도한데..','오늘의 일기',2),(6,'2023-02-16 20:35:34.000000','2023-02-16 20:35:34.000000','오늘은 내가 좋아하는 떡볶이','오늘의 일기',2),(7,'2023-02-16 20:35:34.000000','2023-02-16 20:35:34.000000','다어어트 쉽지 않구나','다이어트 1일차',3),(8,'2023-02-16 20:35:35.000000','2023-02-16 20:35:35.000000','그래도 아직 할만한거 같다','다이어트 2일차',3),(9,'2023-02-16 20:35:36.000000','2023-02-16 20:35:36.000000','역시 3일이 고비네..','다이어트 3일차',3),(10,'2023-02-16 20:35:36.000000','2023-02-16 20:35:36.000000','오늘은 가족 모임한 날~~','오늘의 가족 모임',2),(11,'2023-02-16 20:35:37.000000','2023-02-16 20:35:37.000000','처음으로 모르는 사람들과 먹었다. 그래서 외롭지 않아','외롭지 않아',6),(12,'2023-02-16 20:35:38.000000','2023-02-16 20:35:38.000000','방어가 제철이야 역시','오늘 기록',4),(13,'2023-02-16 20:35:39.000000','2023-02-16 20:35:39.000000','오늘부터 이 식당 단골이다','오늘 만족',4),(14,'2023-02-16 20:35:39.000000','2023-02-16 20:35:39.000000','다이어트를 못참고 먹어버렸다.그래도 맛있다','망했다',3),(15,'2023-02-16 20:35:40.000000','2023-02-16 20:35:40.000000','닭이 싫어지기 시작','다시 시작',3),(16,'2023-02-17 09:25:11.786000','2023-02-17 09:25:34.898000','새로 생긴 싸피중국집에서 배달 시켜먹었다. 꽤 맛있었다. ','오늘은 탕수육과 짜장면 먹을날~!',19),(17,'2023-02-17 09:33:02.940000','2023-02-17 09:33:02.940000','치킨은 항상 옳다. 맛있다. 매일 치킨만 먹었으면 좋겠다.','치팅데이 치킨 먹은날!',19),(18,'2023-02-17 09:36:28.165000','2023-02-17 09:36:28.165000','싸피 밥 너무 맛있다!','어제 오늘 먹은 싸피 밥',19);
/*!40000 ALTER TABLE `memory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-17 10:04:09
