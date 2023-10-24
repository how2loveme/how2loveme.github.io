---
title: 'pod, rabel, rc'
date: '2023-09-26'
---

## k8s 개념공부 - pod, 라벨, 레플리케이션컨트롤러
쿠버네티스를 사용함에 있어 기본적인 개념과 명령어를 정리해보려고 한다.

> ### 2. pod
마스터노드에서 kubectl 명령으로 pod를 생성하면, 연결된 워커노드 중 할당된 자원과 일을 계산해서    
합리적인 노드에다가 pod를 생성해준다.   
pod 생성시에는 명령어만을 통해서 새로운 pod를 실행할 수 있지만,   
스크립트 관리 및 편의를 위해 yaml(yml)파일을 사용한다.   
특정한 형식을 맞춰서 생성해줘야 하는데 아래가 기본적인 예시이다.   
`kind` 부분에 `Pod`로 명시해줘야 하고,    
`metadata`에는 기능 이외의 설정부분   
`spec`에는 기능과 관련된 설정부분을 작성해준다.

```yaml
# simple-pod.yml
apiVersion: v1
kind: Pod
metadata:
  name: jenkins-manual
spec:
  containers:
    - name: jenkins-manual
      image: jenkins/jenkins:lts-jdk11
      ports:
        - containerPort: 8080
```

만든 yaml 파일을 `create -f` 명령어를 실행하면 pod가 생성된다.
```bash
# 생성
kubectl create -f simple-pod.yml
kubectl port-forward pod nginx 80:80 # 포트포워딩

# 삭제
kubectl delete {podName}
# ex) kubectl delete jenkins-manual 
```

get 명령어를 통해 pod관련 정보를 얻을 수 있다.
```bash
kubectl get pod # 기본
kubectl get pod [podName] -o yaml # pod의 상세 구성정보
kubectl get pod -o wide # 기본보다 많은 정보보기 옵션
kubectl get pod -w # 모니터링옵션
kubectl describe pod [podName] # pod의 이벤트들을 볼수 있음
kubectl explain pods 
kubectl logs [podName] # pod 로그보기
kubectl exec [podName] -- {command} # pod 내부에서 커맨드 실행하기
kubectl exec --stdin --tty jenkins-manual -- /bin/bash # pod 내부 터미널로 들어가기
# ex) kubectl exec nginx -- curl localhost
```

> ### 3. label
쿠버네티스에서는 metedata의 label을 이용하여 pod를 찾는다.   
pod가 생성된 이후에라도 label을 추가, 수정, 삭제 할 수 있다.
```bash
# label을 활용한 pod검색
kubectl get pod --show-labels
kubectl get pod --L {'key1,[[key2],...]'}
kubectl get pod -l {'key1[=value1][,key2[=value2],...]'}
# ex)
# kubectl get pod -l env
# kubectl get pod -l !env
# kubectl get pod -l 'env'
# kubectl get pod -l '!env'
# kubectl get pod -l 'env=prod'
# kubectl get pod -l 'env=prod,creation_method=manual'
# kubectl get pod -L app -l "app=nginx"

# label의 추가, 수정, 삭제
kubectl label pod http-go test=foo # 추가
kubectl label pod http-go test=foo1 --overwrite # 수정
kubectl label pod http-go test- # 삭제

# pod 및 요소 전체 삭제
kubectl delete pod --all # pod 전체 삭제
kubectl delete all --all # 모든요소 전체 삭제
```

> ### 4. rc
replicationController 레플리케이션컨트롤러를 rc로 줄여서 표현한다.   
replication는 복제이라는 뜻으로 같은 pod를 지정된 개수만큼 유지해준다.   
`replicas`는 복제품의 개수를 정의한다.    
`template`에서 복제품을 정의한다.
`selector`
```yaml
# http-go-rc.yml
apiVersion: v1
kind: ReplicationController
metadata:
  name: http-go
spec:
  replicas: 3
  selector:
    app: http-go
  template:
    metadata:
      name: http-go
      labels:
        app: http-go
    spec:
      containers:
        - name: http-go
          image: gasbugs/http-go
          ports:
            - containerPort: 8080
```

rc도 pod와 동일하게 생성하고 삭제한다.    
yml파일의 변경시 삭제 및 재생성 하지 않아도 반영이 가능하다.
```bash
# 생성
kubectl create -f http-go-rc.yml

# rc를 삭제하지 않아도 yml의 변경내역을 반영할 수 있다.
kubectl apply -f http-go-rc.yml

# 삭제
kubectl delete {rcName}
# ex) kubectl delete http-go
```
rc의 장점인 응답가능한 파드개수의 유지는 직전에 배웠던 `labels`속성에 의해 동작한다.   
`selector`의 key,value와 pod의 `label`이 동일해야 replicas로 인식한다.   
보통 key값으로 '**app**'을 많이 사용하는 듯 하다. 

만약 pod의 label이 변경되거나, pod자체가 삭제된다면, 혹은 pod가 정해진 개수보다 많다면   
rc가 알아서 생성 및 삭제를 진행한다.  

