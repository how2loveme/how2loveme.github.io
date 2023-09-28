---
title: 'rs-deploy'
date: '2023-09-27'
---

## k8s 개념공부 - 레플리카셋, 디플로이먼트
쿠버네티스를 사용함에 있어 기본적인 개념과 명령어를 정리해보려고 한다. 22

> ### 1. 레플리카셋
레플리카셋(ReplicaSet, rs)은 이전에 했었던 레플리케이션컨트롤러(ReplicationController)와   
상당히 유사하지만, 좀더 레이블 관련 조건식에서 발전된 형태라고 한다.

```yaml
# rs-nginx.yml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: rs-nginx
spec:
  # 케이스에 따라 레플리카를 수정한다.
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: rs-nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80

```
이처럼 `.spec.selector`의 내용과 `.spec.template.metadata.labels`의 내용이 일치해야 한다.   
나머지는 설정이 똑같다. 생성, 변경, 삭제 또한 rc랑 똑같다.
```bash
# 생성
kubectl create -f rs-nginx.yml

# 변경
kubectl apply -f rs-nginx.yml

# 삭제
kubectl delete rs {rsName}
# ex) kubectl delete rs rs-nginx
```
레플리카셋의 레플리카수를 줄이거나 늘이는것을 스케일링한다고 한다.   
scale!
스케일링 하는 방법은 replicas 를 수정하는 것인데   
세가지 정도의 방법이 있다.
```bash
# 1. edit 명령어를 통해 yaml파일에 접근하고 수정 후 저장으로 빠져나온다.(vim편집기)
kubectl edit rs {rsName}
# ex) kubectl edit rs rs-nginx

# 2. yaml 파일을 수정한 후 apply를 한다.
kubectl apply -f rs-nginx.yml

# 3. scale 명령어를 통해 바로 수정한다.
kubectl scale rs/rs-nginx --replicas=5
```
영구적인 replicas변경인 경우엔 2번   
그렇지 않고 일시적일 경우엔 1,3번으로 쓰면 좋을 것 같다.

> ### 2. 디플로이먼트
deployment는 레플리카셋이나 레플리케이션컨트롤러를 제어하는 상위 요소의 개념이다.   
사용방법 또한 레플리카셋과 매우 흡사하다.
```yaml
# deploy-jenkins.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-jenkins
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jenkins-test
  template:
    metadata:
      labels:
        app: jenkins-test
    spec:
      containers:
        - name: jenkins
          image: jenkins/jenkins:lts-jdk11
          ports:
            - containerPort: 8080

```
조회 방법 및 관리 방법 또한 레플리카셋과 매우 흡사하다.
```bash
kubectl get pod,rs,deploy -o wide --show-labels
```

