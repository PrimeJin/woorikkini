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
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_id` int NOT NULL AUTO_INCREMENT,
  `created_time` datetime(6) DEFAULT NULL,
  `updated_time` datetime(6) DEFAULT NULL,
  `notice_content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notice_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (1,'2023-02-17 00:56:12.074000','2023-02-17 00:56:36.250000','안녕하세요, 우리끼니 관리자입니다.\n\n우리끼니 서비스에 관심을 가져주신 유저분들께 감사드립니다.\n우리끼니 서비스 오픈을 기념하여 작은 이벤트를 진행하려 합니다.\n선착순으로 저희 서비스에 가입해주신 유저 100분 중 3분을 랜덤으로 선정하여\n가입하신 이메일로 기프티콘을 보내드리겠습니다.\n\n감사합니다.','우리끼니 서비스 오픈 이벤트 안내'),(2,'2023-02-17 00:57:08.764000','2023-02-17 00:57:08.764000','안녕하세요, 우리끼니 관리자입니다.\n\n비정상적인 언행을 행한 유저들을 신고내역을 바탕으로 이뤄진 활동정지 안내드립니다.\n- 아이디: yeomj051@gmail.com\n- 아이디: sjj1995@naver.com\n원활하고 화목한 우리끼니 운영을 위해 바른 언행을 해주시기 바랍니다.\n\n감사합니다.','1차 악성유저 활동정지 공지'),(3,'2023-02-17 00:57:34.898000','2023-02-17 00:57:34.898000','안녕하세요, 우리끼니 관리자입니다.\n\n항상 우리끼니를 이용해주시는 유저분들께 감사드립니다.\n성원에 힘입어 더 다양하게 방을 생성할 수 있도록 프리셋을 추가하였습니다.\n새로운 프리셋과 함께 앞으로도 많은 관심 부탁드립니다.\n\n감사합니다.','방 프리셋 추가 공지'),(4,'2023-02-17 00:57:52.983000','2023-02-17 00:57:52.983000','안녕하세요, 우리끼니 관리자입니다.\n\n항상 우리끼니를 이용해주시는 유저분들께 감사드립니다.\n강퇴 투표를 진행할 때 과반수가 넘어도 강퇴가 되지 않던 문제를 해결했습니다.\n이용에 불편을 드려 죄송합니다. 앞으로도 우리끼니에 많은 관심 부탁드립니다.\n\n감사합니다.','강퇴 투표 문제 해결 공지'),(5,'2023-02-17 00:58:14.013000','2023-02-17 00:58:49.215000','안녕하세요, 우리끼니 관리자입니다.\n\n우리끼니 서비스에 관심을 가져주신 유저분들께 감사드립니다.\n유저분들께 보다 나은 서비스를 제공하기 위하여 시스템 개선을 하고자 서비스를 일시중단합니다.\n\n- 일시: 2023.02.18 AM 02:00 ~ 2023.02.18 AM 06:00\n\n이용에 불편을 드려 죄송합니다. 앞으로도 우리끼니에 많은 관심 부탁드립니다.\n\n감사합니다.','시스템 개선으로 인한 서비스 일시중단 공지'),(6,'2023-02-17 00:59:08.046000','2023-02-17 00:59:08.046000','안녕하세요, 우리끼니 관리자입니다.\n\n비정상적인 언행을 행한 유저들을 신고내역을 바탕으로 이뤄진 활동정지 안내드립니다.\n\n- 아이디: sjj1995@naver.com\n- 아이디: wkas1921@naver.com\n\n원활하고 화목한 우리끼니 운영을 위해 바른 언행을 해주시기 바랍니다.\n\n감사합니다.','2차 악성유저 활동정지 공지'),(7,'2023-02-17 00:59:21.138000','2023-02-17 00:59:21.138000','안녕하세요, 우리끼니 관리자입니다.\n\n비정상적인 언행을 행한 유저들을 신고내역을 바탕으로 이뤄진 활동정지 안내드립니다.\n\n- 아이디: sky585456@naver.com\n- 아이디: yeomj051@gmail.com\n\n원활하고 화목한 우리끼니 운영을 위해 바른 언행을 해주시기 바랍니다.\n\n감사합니다.','3차 악성유저 활동정지 공지'),(8,'2023-02-17 00:59:38.560000','2023-02-17 00:59:38.560000','안녕하세요, 우리끼니 관리자입니다.\n\n우리끼니 서비스에 관심을 가져주신 유저분들께 감사드립니다.\n우리끼니 서비스 오픈을 기념하여 진행한 이벤트 결과 안내드립니다.\n\n당첨자 명단입니다.\n\n- sky585456@naver.com\n- yeomj051@gmail.com\n- wkas1921@naver.com\n\n당첨을 축하드리며 가입하신 이메일로 기프티콘을 보내드리겠습니다.\n\n감사합니다','서비스 오픈 이벤트 결과 안내'),(9,'2023-02-17 00:59:52.924000','2023-02-17 00:59:52.924000','안녕하세요, 우리끼니 관리자입니다.\n\n비정상적인 언행을 행한 유저들을 신고내역을 바탕으로 이뤄진 활동정지 안내드립니다.\n\n- 아이디: sky585456@naver.com\n- 아이디: yeomj051@gmail.com\n\n원활하고 화목한 우리끼니 운영을 위해 바른 언행을 해주시기 바랍니다.\n\n감사합니다.','4차 악성유저 활동정지 공지'),(10,'2023-02-17 01:00:03.673000','2023-02-17 01:00:03.673000','안녕하세요, 우리끼니 관리자입니다.\n\n비정상적인 언행을 행한 유저들을 신고내역을 바탕으로 이뤄진 활동정지 안내드립니다.\n\n- 아이디: ykm9397@naver.com\n- 아이디: yeomj051@gmail.com\n\n원활하고 화목한 우리끼니 운영을 위해 바른 언행을 해주시기 바랍니다.\n\n감사합니다.','5차 악성유저 활동정지 공지'),(11,'2023-02-17 01:00:20.961000','2023-02-17 01:27:00.019000','안녕하세요, 우리끼니 관리자입니다.\n\n우리끼니 서비스에 관심을 가져주신 유저분들께 감사드립니다.\n\n유저분들께 보다 나은 서비스를 제공하기 위하여 시스템 개선을 하고자 서비스를 일시중단합니다.\n\n- 일시: 2023.02.25 AM 02:00 ~ 2023.02.25 AM 06:00\n\n이용에 불편을 드려 죄송합니다. 앞으로도 우리끼니에 많은 관심 부탁드립니다.\n\n감사합니다.','시스템 개선으로 인한 서비스 일시중단 공지'),(12,'2023-02-17 01:00:44.850000','2023-02-17 01:00:44.850000','안녕하세요, 우리끼니 관리자입니다.\n\n항상 우리끼니를 이용해주시는 유저분들께 감사드립니다.\n성원에 힘입어 더 다양하게 방을 생성할 수 있도록 프리셋을 추가하였습니다.\n새로운 프리셋과 함께 앞으로도 많은 관심 부탁드립니다.\n\n감사합니다.','방 프리셋 2차 추가 공지');
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-17 10:04:06
