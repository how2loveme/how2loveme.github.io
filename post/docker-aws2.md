---
title: 'AWS EC2에서 docker로 git으로 받은 node서버 올리기'
date: '2023-06-27'
---

이전에 했던 nginx에 이어서 이번엔 외부에서 노드서버에 접속할 것이다.
그러기 위해 먼저 노드 서버를 띄워야 하는데, 우분투이미지를 이용해 컨테이너를 만들고
그 컨테이너 안에서 git과 nodejs를 이용하여 소스를 띄워보도록 하겠다.

## 1. Ubuntu:20.04 이미지를 실행해서 컨테이너 만들기
먼저 Ubuntu 도커 이미지를 pull받아야한다. 버전은 20.04을 채택했다.
따로 이유는 없고... 이고잉님의 강의를 따라했다.  
```
docker pull ubuntu:20.04
```
pull받은 이미지를 이제 run하여 컨테이너로 만들겠다.
```
docker run --name fe -it -p 3000:3000 ubuntu:20.04
```
frontend서버로 사용할 것이기에 컨테이너 이름은 fe로 설정했다. 
그리고 node서버를 이용해 nextjs를 사용한 react 앱을 3000번포트에 띄울 것이다.
외부에서 node서버로 접근하기 위해 포트포워딩으로 host의 3000번과 컨테이너의 3000번 포트를 매칭시켰다.
그리고 바로 해당 컨테이너 터미널에 접속하기 위해 -it옵션을 주었다.

## 2. node 설치하기
node를 설치하는 방법은 다양하지만 노드 버전을 쉽게 관리 할 수 있는 nvm을 사용하여 설치한다. 
딱히 컨테이너에서 node버전을 관리할 필요는 없기에 굳이? 라는 생각이 들지만 그냥 이용해보자.

### 2-1. nvm설치 
nvm을 설치하려고 [nvm 공식 깃헙](https://github.com/nvm-sh/nvm)에 접속하였다. 
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
위 명령어로 설치할 수 있다고 하지만~ 우린 현재 curl을 사용할 수 가 없다. 
우분투 이미지로 만든 컨테이너는 정말 딱 우분투만 있기 때문에 다른 패키지들이 설치되어있지 않다. 
그래서 curl을 먼저 설치하겠다.

지금까지 우린 amazon linux에 도커를 설치하여 ubuntu linux컨테이너에 진입하였다.
host단에서는 amazon에 의해 yum을 이용해야하지만, container단에서는 우분투에 의해 apt를 이용하여야 한다.
```
apt update
apt install -y curl
```
apt update로 apt 패키지툴을 최신화 시켜줘야 한다. 
그리고 curl을 설치한다. -y옵션은 역시 설치중 모든 질문에 yes로 답하겠단 뜻이다.

이제 다시 명령어를 실행시켜 nvm을 설치하도록 한다.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

nvm -v
//bash: nvm: command not found

source ~/.bashrc
nvm -v
0.39.3
```
설치 후에 nvm이 잘 설치됐는지 버전을 찍어봤지만 찍히지 않는다.
[nvm 공식 깃헙](https://github.com/nvm-sh/nvm)에 나온 걸 보니 
.bashrc가 변경됨을 반영하기위해 우분투에선 터미널을 재실행해야하나
source명령어를 이용하면 터미널 재실행 없이 바로 반영시킬 수 있다고 한다.

### 2-2. nvm을 이용한 node설치
node설치는 굉장히 간단하다. 
```
nvm install node

node -v
//v20.3.1
npm -v
//9.6.7
```
명령어 하나면 최신버전이 다운로드 된다. 

## 3. git 설치하기
git또한 apt로 다운로드 할 수 있다.
```
apt install -y git

git --version
//git version 2.25.1
```
굉장히 뭐 없이 다운로드 된다. 

## 4. git으로 소스를 받아 node서버에 올리기
이제 다운로드 받은 git을 이용해 개인프로젝트를 clone하고 build및 publish해보겠다.
```
pwd
///root

git clone exam.git
cd exam
npm i
npm run build
npm run start
```
여러분의 서버에 따라 위 코드부분은 달라질 것이다. 각자의 서버를 올려보도록 하자.
서버를 잘 올려서 ```curl localhost:3000```처럼 각자의 서비스를 접속해보자

## 5. 외부에서 접속이 가능하도록 EC2 보안그룹 설정
이제 모든 준비는 끝났고, AWS의 방화벽인 보안그룹의 인바운드만 열어주면 된다. 
지난 보안그룹에서 `3000번 포트`를 `0.0.0.0/0` 으로 모두에게 풀어준다면, 여러분의 퍼블릭 도메인:3000으로 접속시에 node서버가 보일 것이다.

다음번엔 docker commit을 이용해 이미지를 만들어보고 
docker build를 이용해 커밋없이 구현해보자.
