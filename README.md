# 서울 8반 A804 공통 프로젝트
# 👨‍👩‍👧‍👦🍚 우리끼니

## 목차
1. [서비스 소개](#-서비스-소개)
2. [주요 기능](#-주요-기능)
3. [개발 환경](#-개발-환경)
4. [서비스 아키텍쳐](#%EF%B8%8F-서비스-아키텍쳐)
5. [배포 설정](#-배포-설정)
6. [Git 전략 및 컨벤션](#-git-전략-및-컨벤션)


## 🍚 서비스 소개

<!-- ![첫화면](https://user-images.githubusercontent.com/110287222/218735989-058ce8fc-7779-46d5-825f-20c90cc02f04.png) -->
![첫화면움짤](https://user-images.githubusercontent.com/110287222/218941519-c982a6b1-29cb-4206-9c6f-df9c4b69916d.gif)


### 개요
- **서비스명: 우리끼니**
- **소개: 혼밥 하는 사람들끼리 모여 함께 밥을 먹는 웹 화상 서비스**
![image](https://user-images.githubusercontent.com/110287222/218946535-5d74435c-1034-45b3-af47-b456cff186a5.png)

## 🤗 주요 기능
### 유저
- 회원가입
- 로그인 
- 비밀번호 찾기
- 마이페이지 (추억저장)

**회원가입 (이메일 인증)**

![이메일 인증](https://user-images.githubusercontent.com/110287222/219529252-26a62540-0ed0-4f2f-9b13-3f94363400d2.gif)

**비밀번호 찾기**

![비밀번호 찾기](https://user-images.githubusercontent.com/110287222/219529267-1398af57-a6f9-4f71-bb6a-cb8e5a20f2cb.gif)

**마이페이지 (추억 저장)**
![추억등록](https://user-images.githubusercontent.com/110287222/219523698-a3e45608-907c-4c1d-9051-c58175ce8aae.gif)


### 화상 채팅방 
- 오픈방, 비밀방 개설
- 방 키워드, 프리셋 설정
- 화상 채팅
- 강퇴 투표
- 신고

**방 개설**

![방만들기_gif_버전](https://user-images.githubusercontent.com/110287222/219524414-3cb32421-1cec-4cf3-817d-00e617857b0d.gif)

**강퇴 투표**

![강퇴](https://user-images.githubusercontent.com/110287222/219523928-e7192cc0-4b72-4541-8d25-0b6077d0b775.gif)

**신고**

![신고](https://user-images.githubusercontent.com/110287222/219531685-d53130c3-e198-4d27-a6e2-a5294eec405d.gif)

### 관리자
- 공지사항
- 회원 및 신고 관리
- 통계 (연령, 성별, 키워드)

**회원 조회**
![관리자회원조회정지](https://user-images.githubusercontent.com/110287222/219524613-3cccdcde-edec-449f-9403-da72267b914b.gif)

**통계**
![통계리얼](https://user-images.githubusercontent.com/110287222/219524068-cf1d9a0d-8719-4bf5-bc29-47d342afbf85.gif)


## 💻 개발 환경
### 공통
- Gitlab
- Jira
- Notion
### BackEnd
- IntelliJ
- Spring Boot 2.7.5
- Spring Security
- JPA
- openjdk version 1.8.0_332
- MySQL 8.0.31
- Gradle 7.6
- Swagger2
- Google SMTP
- OAuth 소셜로그인
  - 구글
  - 네이버
  - 카카오

### FrontEnd
- VSCode
- React 18.2.0
- React-redux 8.0.5
- Redux-toolkit 1.9.1
- React-cookie 4.1.1
- Openvidu-browser 2.25.0
- Mui-material 5.11.0
- Styled-components 5.3.6
- axios 1.2.6
- React-countdown-circle-timer 3.1.0

## ⚙️ 서비스 아키텍쳐
![image](https://user-images.githubusercontent.com/110287222/218950221-cdbe90b0-ae64-43d2-a969-76d35d493fdf.png)

## 🌐 배포 설정
### 프론트엔드 빌드 및 배포
1. git clone
```bash
git clone https://lab.ssafy.com/s08-webmobile1-sub2/S08P12A804.git
```

2. frontend 폴더로 이동
```bash
cd ./S08P12A804/frontend
```

3. Dockerfile 작성
```bash
FROM node:alpine as builder

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY ./ ./

RUN npm run build

FROM nginx:stable-alpine

RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

COPY --from=builder /usr/src/app/build/ ./build

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

4. 도커 이미지 생성
```bash
sudo docker build -t {도커 이미지 이름} .
```

5. 도커 컨테이너 생성
```bash
sudo docker run -p {외부에서 연결할 포트번호}:3000 --name {도커 컨테이너 이름} -d -v {EC2 서버 폴더 경로}:{생성할 도커 컨테이너의 폴더 경로} {도커 이미지 이름}
```
<br/>
     
### 백엔드 빌드 및 배포
1. git clone
```bash
git clone https://lab.ssafy.com/s08-webmobile1-sub2/S08P12A804.git
```

2. backend 폴더로 이동
```bash
cd ./S08P12A804/backend
```

3. Dockerfile 작성
```bash
FROM openjdk:8-jdk-alpine

EXPOSE 8040

ARG JAR_FILE=build/libs/kkini-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]

ENV TZ=Asia/Seoul
```

4. 빌드
```bash
./gradlew -x test clean build
```

5. 도커 이미지 생성
```bash
sudo docker build -t {도커 이미지 이름} .
```

6. 도커 컨테이너 생성
```bash
sudo docker run -p {외부에서 연결할 포트번호}:8040 --name {도커 컨테이너 이름} -d -v {EC2 서버 폴더 경로}:{생성할 도커 컨테이너의 폴더 경로} {도커 이미지 이름}
```

### nginx.conf 파일

```
server {
    listen 80;
    location / {
        root    /app/build;
        index   index.html;
        try_files $uri $uri/ /index.html;
    }
}

```

### nginx 설정

1. **nginx 설치**

```
sudo apt-get install nginx

```

2. **/etc/nginx/sites-available로 이동후 default 파일 수정 또는 새로운 이름의 파일 생성**

```
server {
        # 프론트 연결
        location /{
                proxy_pass <http://localhost>:{프론트 포트 번호};
        }

        # 백엔드 연결
        location /api {
                proxy_pass <http://localhost>:{백엔드 포트 번호}/api;
        }
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/[도메인 주소]/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/[도메인 주소]/privkey.pem; # managed by Certbot
    # include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    # 도메인 이름을 입력
    if ($host = [도메인 주소]) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        server_name [도메인 주소];
    return 404; # managed by Certbot
}

```

3. nginx 실행

```
sudo service nginx start

```

---

### OpenVidu 배포

1. root 권한 얻기

```
sudo su

```

2. openvidu 설치 위치인 /opt로 이동

```
cd /opt

```

3. openvidu 설치

```
curl <https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh> | bash

```

4. openvidu 폴더로 이동

```
cd /opt/openvidu

```

5. openvidu 설정 변경

```
$ nano .env

# OpenVidu configuration
DOMAIN_OR_PUBLIC_IP={도메인 주소}

OPENVIDU_SECRET={비밀키}

# Certificate type
CERTIFICATE_TYPE=letsencrypt

# 인증서 타입이 letsencrypt일 경우 이메일 설정
LETSENCRYPT_EMAIL={이메일 주소 ex) ssafy@ssafy.com}

# HTTP port
HTTP_PORT={연결할 포트 번호}

# HTTPS port
HTTPS_PORT={연결할 포트 번호}

```

### OpenVidu 실행

```
./openvidu start

```
<br/>

### 외부 서비스 문서
### 소셜 로그인
- GOOGLE
Oauth 기반 로그인 API 제공  
https://developers.google.com/identity/sign-in/web/sign-in?hl=ko

- NAVER
Oauth 기반 로그인 API 제공  
https://developers.naver.com/docs/login/devguide/devguide.md

- KAKAO
Oauth 기반 로그인 API 제공  
https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api

<br/>

## 🌟 Git 전략 및 컨벤션
### Git 전략
```
master -> develop -> backend  -> be/feature/기능명
master -> develop -> frontend -> fe/feature/기능명

Merge
기능 branch 개발 완료 => backend or frontend 각 파트 branch에 Pull request => 팀 확인 및 각 파트 리더 merge 승인
- ex) be/feature/login 개발 완료 ⇒ backend에 Pull Request ⇒ 팀 확인 및 backend 리더 merge 승인

이후 정상작동 확인 후 Git 담당자가 develop에 merge 작업 수행,  develop => master에 merge 작업 수행 
```
### Git 컨벤션
```
[이슈번호] BEorFE/태그종류: (작업한 내용 동사형) 작업내용
- ex) [이슈번호] BE/Fix: Resolve getUser function NullPointerException error
- ex) [이슈번호] FE/Feat : Add find password function

본문(바디) 내용 작성 시 이번 커밋과 관련하여 수행한 내용 한글로 상세하게 작성
```
**태그종류**
| 태그 이름 | 설명 |
| --- | --- |
| Feat | 새로운 기능 추가 |
| Design | CSS, UI 등 디자인 관련 작업 |
| Style | 코드 포맷팅, 세미 콜론 누락 등 |
| Test | 테스트 코드 추가 및 리팩토링 (테스트 이외 코드 변경 X) |
| Fix | 버그 수정 |
| Rename | 파일 혹은 폴더명 수정한 경우 |
| Remove | 파일 삭제하는 작업 수행한 경우 |
| Comment | 주석 추가 및 변경 |
| Refactor | 코드 리팩토링 |
| Docs | 문서 수정한 경우 |
