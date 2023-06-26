---
title: 'AWS EC2에서 docker설치 및 nginx 띄우기'
date: '2023-06-26'
---

아마존 웹 서비스(AWS)의 EC2 인스턴트환경에서 웹서버를 띄워보고자 한다.
먼저 AWS에 접속하여 EC2 인스턴스 콘솔에 접속한다.
아무 것도 없는 빈 깡통인 EC2에 docker를 설치하고, nginx를 띄워서 시작페이지를 누구나 볼수있도록 하려고한다.

별다른 작업 없이 바로 EC2 콘솔로 진입하여 작업을 진행하기 때문에 GUI 환경이 아닌 CLI환경. 즉 커맨드라인으로만 환경을 구축한다.
EC2 콘솔에 접속 후 아래 명령어로 운영체제를 확인한다.
```linux
uname -a
//Linux ip-172-31-37-206.ap-northeast-2.compute.internal 6.1.19-30.43.amzn2023.x86_64
//#1 SMP PREEMPT_DYNAMIC Wed Mar 15 14:44:28 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux

cat /etc/*release*
```
위와 같이 리눅스이지만, 우분투나 데비안이 아니고 아마존 버전의 리눅스가 OS로 설치되어 있다.
그래서 실제 리눅스나 VMWARE로 만든 다른 가상화 리눅스들과는 조금씩 다를 수 있다.

1. 먼저 도커를 설치하려고 한다.
```
sudo yum install docker -y //도커 설치
```
아마존 리눅스는 apt-get이 아닌 yum을 사용한다.
-y옵션은 설치시 물어보는 항복에 대해 전부 Yes라고 답하는 옵션이다.

2. 설치한 도커를 실행시킨다.
```
//도커 실행
sudo service docker start

//도커 실행확인
systemctl status docker.service 

//콘솔로 접속한 계정인 ec2-user를 docker그룹에 추가합니다.
usermod -a -G docker ec2-user 

//도커 소켓파일에 권한을 666으로 변경합니다.
sudo chmod 666 /var/run/docker.sock
```
위의 그룹추가와 666권한변경을 해주어야만 ```docker ps``` 와 같이 도커 명령어 실행 시 sudo를 입력하지 않아도 된다.
- [hmyanghm님의 블로그 - AWS EC2에 Docker 설치](https://velog.io/@hmyanghm/AWS-EC2%EC%97%90-Docker-%EC%84%A4%EC%B9%98)

3. nginx 설치
도커에서 nginx를 설치한다는 것은 nginx image를 pull하는 행위를 말한다.
우리가 윈도우에서 프로그램을 설치 후 프로세스로 하여금 프로그램을 돌리는 것처럼
도커에서 이미지를 pull받은 후 컨테이너로 하여금 이미지를 run해주어야 한다.
```
//도커 이미지 pull
docker pull nginx

//도커 이미지 확인
docker images

//도커 실행
docker run --name ws2 -p 80:80 nginx

//그 외 도커 명령어도커 중지, 시작, 로그보기 제거
docker stop ws2 //ws2 컨테이너 중지
docker start ws2 //ws2 컨테이너 (재)시작
docker logs -f ws2 //ws2 컨테이너 로그보기
docker rm (-f) ws2 //ws2 컨테이너 (실행중 강제)삭제

```
도커로 이미지를 실행하여 컨테이너를 만드는 명령어가 docker run이고, 
--name ws2 옵션으로 컨테이너 이름을 ws2로 명명하였다.
또한 -p 80:80 옵션으로 도커 host의 80번 포트와 컨테이너의 80번 포트를 포트포워딩 해주었다.

이때 EC2 콘솔에 ```curl localhost``` 를 친다면 nginx의 첫 시작페이지를 볼 수 있다.
허나 우리의 최종목표는 외부에서도 우리의 EC2 nginx를 보게 만드는 것.

- [docker docs](https://docs.docker.com/engine/reference/commandline/run/)
- [docker hub](https://hub.docker.com/_/nginx)
- [생활코딩 Docker 입구 수업](https://opentutorials.org/course/4781/30609)

4. 외부에서 AWS EC2 80번 포트로 접속하기
AWS의 실행중인 인스턴스 대시보드에 들어가보면 퍼블릭 IPv4 DNS가 있다. 이 주소로 들어가 nginx 첫페이지를 보려고 한다.
대시보드 DNS주소를 복사하여 브라우저 주소창에 쳐서 복사해보면 로딩이 얼마의 시간동안 이뤄지다가 연결되지 않음을 확인 할 수있다.
EC2 콘솔로 로컬에서는 보이지만 외부에서 보이지 않는 이뉴는 AWS EC2의 80번포트로의 외부 진입이 허용되지 않았기 때문이다.
인스턴스의 보안그룹 설정에 들어가 인바운드 규칙을 추가해준다.
http유형의 80번 포트를 전체(0.0.0.0/0) 로 추가해준다면 접속이 가능하다.

(그 외)
EC2는 기본적으로 ufw가 아닌 iptables를 방화벽 툴로 사용한다.
허나 인바운드 외의 따로 EC2의 방화벽을 만지지 않아도 접속이 가능하다.



