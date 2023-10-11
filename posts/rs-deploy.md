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

```yaml
# deploy-alpine.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alpine
  labels: 
    app: alpine
spec:
  replicas: 10
  selector:
    matchLabels:
      app: alpine
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 50%
      maxUnavailable: 50%
  template:
    metadata:
      labels:
        app: alpine
    spec:
      containers:
        - name: alpine
          image: alpine:3.4

```

디플로이먼트를 사용하면 레플리카셋, 레플리케이션컨트롤러를 손쉽게 관리할 수 있다.   
가령 디플로이먼트의 이미지버전을 변경 할 경우,    
`RollingUpdate` 전략을 이용하여, 서버를 중단하지 않고 버전업을 할 수 있다.   
이전버전의 pod를 하나씩 죽이면서, 동시에 새로운 버전의 pod를 하나씩 올리는 방식이다.
이 때 노드들의 시스템역량을 고려해 `maxSurge`와 `maxUnavailable`을 설정해주어야 한다.   

maxSurge는 의도한 파드 수에 대해 생성할 수 있는 최대 수이다.    
예를들어 레플리카스가 4면서, maxSurge가 25%인 경우,   
레플리카스는 순간 5개까지 늘어날 수 있다.   

maxUnavailable은 반대로 의도한 파드 수에 대해 중단할 수 있는 최대 수이다.   
예를들어 레플리카스가 4면서, maxUnavailable이 25%인 경우,   
레플리카스는 동시에 최대 1개까지만 중단할 수 있다.    
다르게 말하면 최소 3개(75%)는 살아있어야 한다.   

```bash
# edit 명령어를 통한 수정
kubectl edit deploy {{deploymentName}}
# ex) kubectl edit deploy alpine

# set 명령어를 통한 수정
kubectl set image deploy http-go http-go=gasbugs/http-go:v2 --record=true

# 디플로이먼트 http-go의 롤아웃 상태보기
kubectl rollout status deploy http-go

# 디플로이먼트 http-go의 롤아웃 히스토리보기
kubectl rollout history deploy http-go 

# 디플로이먼트 이전 버전으로 돌아가기
kubectl rollout undo deploy http-go --record=true

# 디플로이먼트 특정 버전으로 돌아가기(history 좌측에 표시된 revision번호)
kubectl rollout undo deploy http-go --to-revision=1

# 롤아웃된 레플리카셋은 사라지지 않고, 남아있다. 다만 READY가 0일뿐.
kubectl get rs -o wide

# --record=true 옵션이 deprecated된다고 한다. annotate --overwrite=true 
kubectl annotate deploy http-go kubernetes.io/change-cause="version change to v2 to v3!"
# 이런 식으로 annotate명령어를 이용해 현재 리비전의 change-cause의 내용을 바꿀 수 있다.

```
