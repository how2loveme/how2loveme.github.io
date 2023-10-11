---
title: 'svc'
date: '2023-10-11'
---

## k8s 개념공부 - 서비스
쿠버네티스를 사용함에 있어 기본적인 개념과 명령어를 정리해보려고 한다. 44

> ### 1. 서비스
서비스 api를 이용해서 pod들을 클러스터링할 수 있다.   

아래의 명령어를 입력해주면, 손쉽게 서비스와 디플로이먼트를 합친 yaml파일을 만들 수 있다.     
kubectl create svc clusterip http-go --tcp=80:8080 --dry-run=client -o yaml > http-go-deploy.yml
echo --- >> http-go-deploy.yml
kubectl create --image=gasbugs/http-go deploy http-go --dry-run=client -o yaml >> http-go-deploy.yml

```yaml
# http-go-deploy.yml
apiVersion: v1
kind: Service
metadata:
  name: http-go-svc
spec:
  selector:
    run: http-go
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    run: http-go
  name: http-go
spec:
  replicas: 1
  selector:
    matchLabels:
      run: http-go
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: http-go
    spec:
      containers:
        - image: gasbugs/http-go
          name: http-go
          resources: {}
status: {}

```
아래의 명령어로 http-go가 잘 rollout 되었는지 확인한다.
디플로이먼트와 서비스의 라벨이 잘 맞아야 엔드포인트에 해당 pod들의 ip가 나열된다.
```bash
kubectl rollout status deploy/http-go
kubectl describe svc http-go

# 간단한 http요청을 위해 busybox이미지와 wget을 이용한다.
kubectl run -it --m --image=busybox bash
wget -O- -q 10.108.143.152
```