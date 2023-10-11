---
title: 'svc, endpoints, endpointslice, nodeport'
date: '2023-10-11'
---

## k8s 개념공부 - 서비스, 엔드포인트, 노드포트
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
  creationTimestamp: null
  labels:
    app: http-go
  name: http-go
spec:
  ports:
    - name: 80-8080
      port: 80
      protocol: TCP
      targetPort: 8080
  selector:
    app: http-go
  type: ClusterIP
status:
  loadBalancer: {}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: http-go
  name: http-go
spec:
  replicas: 1
  selector:
    matchLabels:
      app: http-go
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: http-go
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

> ### 2. 엔드포인트
서비스가 레이블(셀렉터)를 가질 때,    
해당 레이블과 일치하는 파드들을 클러스터링 하는 엔드포인트, 엔드포인트슬라이스를 자동으로 생성하는 반면,

엔드포인트는 서비스가 레이블이 없을 때, 미리 클러스터링 할 ip를 적시해 놓고    
엔드포인트 슬라이스를 수동으로 생성하여, 서비스와 연결시켜 클러스터링 한다.   
nslookup how2love.me

```yaml
# my-service-endpoint.yml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
---
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 관행적으로, 서비스의 이름을
  # 엔드포인트슬라이스 이름의 접두어로 사용한다.
  labels:
    # "kubernetes.io/service-name" 레이블을 설정해야 한다.
    # 이 레이블의 값은 서비스의 이름과 일치하도록 지정한다.
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: '' # 9376 포트는 (IANA에 의해) 잘 알려진 포트로 할당되어 있지 않으므로
    # 이 칸은 비워 둔다.
    appProtocol: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "223.130.195.200" # 이 목록에 IP 주소를 기재할 때 순서는 상관하지 않는다.
      - "199.201.110.204"

```
아래 명령어를 통해 엔드포인트슬라이스가 잘 생성되었나 확인한다.
```bash
kubectl apply -f my-service-endpoint.yml # 생성
kubectl get endpoints,endpointslice
kubectl get svc
kubectl run http-go --image=gasbugs/http-go
kubectl exec -it http-go -- bash
# curl {serviceName}
# ex) curl my-service
```


> ### 3. 노드포트
노드포트는 쿠버네티스에서 외부포트를 열어 통신할 수 있도록 하는 서비스이다.   
다시말해, 파드별로 외부로 여는 것이 아닌, 서비스에서 노드를 외부에 열어서 클러스터링하는 서비스이다.  
하나의 파드에 여러 서비스가 달려들어 붙을 수 있다.
아래 yaml파일은 위의`http-go-deploy.yml`과 호환된다.

```yaml
# http-go-np.yml
apiVersion: v1
kind: Service
metadata:
  name: http-go-svc
spec:
  type: NodePort
  selector:
    app: http-go
  ports:
    # 기본적으로 그리고 편의상 `targetPort` 는 `port` 필드와 동일한 값으로 설정된다.
  - port: 80
    targetPort: 8080
    # 선택적 필드
    # 기본적으로 그리고 편의상 쿠버네티스 컨트롤 플레인은 포트 범위에서 할당한다(기본값: 30000-32767)
    nodePort: 30001

```

`type`에 `NodePort`를 적어주어야 한다.  
port는 서비스의 접근 포트이고,  
targetPort는 파드의 접근 포트이다.  
그리고 nodePort는 쿠버네티스의 외부포트이며, node의 외부 ip를 통해 접근할 수 있다.

쿠버네티스 특정 포트에 접근하려면 googlecloud engine을 이용하고 있기 때문에,  
cloudshell 터미널에서 방화벽을 이용하여 특정 포트를 열어주어야 한다.  
아래 명령어를 cloudshell에서 입력하여 준다.  
`gcloud compute firewall-rules create http-go-svc-rule --allow=tcp:30001`

그 이후에 노드의 `외부ip:포트`로 접근 시 해당 서비스가 클러스터링하여 파드에 접근함을 확인 할 수 있다.  
`ex) curl 34.82.22.116:30001`

