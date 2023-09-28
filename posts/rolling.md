---
title: 'rolling'
date: '2023-09-28'
---

## k8s 개념공부 - 롤링업데이트
쿠버네티스를 사용함에 있어 기본적인 개념과 명령어를 정리해보려고 한다. 33

> ### 1. 롤링업데이트
```yaml
# http-go-deploy.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: http-go
  labels: 
    app: http-go
spec:
  replicas: 3
  selector:
    matchLabels:
      app: http-go
  template:
    metadata:
      labels:
        app: http-go
    spec:
      containers:
        - name: http-go
          image: gasbugs/http-go:v1
          ports:
            - containerPort: 8080

```
위 yaml파일을 이용하여 deploy를 생성해준다.
record옵션으로 true를 줘야만 rollout history에서 이력을 확인 할 수 있다.

```bash
kubectl create -f http-go-deploy-v1.yml --record=true

kubectl describe deploy http-go # deployment 상세정보 확인
kubectl rollout status deploy http-go # 현재 rollout 상태 확인
kubectl rollout history deploy http-go # rollout history 확인
```
이렇게 롤아웃 한 디플로이먼트를 수정할 수 있다.   
수정시 디플로이먼트의 전략타입(strategyType)에 따라 반영방법이 달라진다.   
디플로이먼트의 롤링 `strategyType`은 `RollingUpdate`와 `Recreate`가 있는데
롤링업데이트는 버전이 공존하면서 미래버전으로 서서히 바뀌는 것을 말한다.   
이 때 주의할 점은 미래버전이 이전버전의 기능들을 지원해야 서비스 운영시 문제가 없다.   
리크리에이트는 레플리카셋을 삭제시키고 다시 생성하는 것을 말하며, 중단시간이 존재한다.   
기본값은 RollingUpdate이다.   
patch 명령어를 통해 디플로이먼트의 옵션을 변경 할 수 있다.   
`minReadySeconds`옵션은 최소 10초를 기다린 후에 변경사항을 반영하라는 옵션이다.   

```bash
kubectl patch deploy http-go -p '{"spec": {"minReadySeconds": 10}}'
```

또 expose 명령어를 통해 해당 디플로이먼트를 서비스할 수 있다.
```bash
kubectl expose deploy http-go
kubectl get svc # 확인
```
롤링업데이트를 확인 하기 위해서 1초간격으로 get svc의 ip에 지속적인 요청을 할 것이다.   
이걸로 버전이 어떻게 업데이트 되는지 알아보자
```bash
kubectl run -it --rm --image busybox -- bash
# bash 진입 후
while true; do wget -O- -q 10.98.134.227:8080; sleep 1; done
```
이렇게 버전을 볼 수 있도록 켜놓고 디플로이먼트를 변경해보겠다.   
변경방법에는 여러가지가 있는데   
set 명령어를 통해서 deploy의 이미지를 변경할 수 있다.    
이 때 record옵션을 true로 줘야만 rollout history에 `이력번호`와 내용을 남길 수 있다.
또한 edit 명령어를 통해 직접 yaml설정에 들어가서 변경 할 수도 있다.   
이 또한 record옵션에 true를 줘야한다.
```bash
kubectl set image deploy {deployName} {containerName=imageName} --record=true 
# ex) kubectl set image deploy http-go http-go=gasbugs/http-go:v2
kubectl edit deploy http-go --record=true
```
이전버전으로 돌아가는 롤백 방법도 있다.   
rollout undo 명령어를 사용하는 방법인데,   
이 땐 record옵션을 줄수 없고, 주지 않아도 history에 번호가 증가되어 반영된다.   
--to-revision 옵션값으로 history에 적힌 이력번호를 주면 그 버전으로 돌아간다. 
```bash
kubectl rollout undo deploy http-go # 이전버전으로 돌아가기
kubectl rollout undo deploy --to-revision=1 # 특정버전으로 돌아가기
```