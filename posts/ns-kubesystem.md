---
title: 'ns-kubesystem'
date: '2023-10-05'
---

## k8s 개념공부 - 네임스페이스, 큐브시스템, 스태틱파드, etcd
쿠버네티스를 사용함에 있어 기본적인 개념과 명령어를 정리해보려고 한다. 33

> ### 1. 네임스페이스
네임스페이스는 쿠버네티스에서 다른 작업영역이라고 보면 될것같다.   
기본적으로 우리가 작업하는 공간은 default이지만, 네임스페이스를 생성할 수도 있고, 삭제 할 수도 있다.   
그리고 기본적으로 생성되어 있는 네임스페이스들도 있다.    
`kube-node-lease`, `kube-public`, `kube-system`이 그것들이며, 쿠브시스템은 상당히 많은 구성요소를 가지고 있다.   

> 💡팁!!   
> `~/.kube/config` 파일에 `contexts.contexts.namespace`를 수정하여    
> 기본 namespace를 변경할 수 있다(미 설정시 기본값 **default**)

```bash
# namespace 목록보기
kubectl get ns

# 특정 namespace의 요소에 명령을 내릴 땐 --namespace, -n 옵션을 부여한다.
kubectl get all --namespace=kube-system
kubectl get all -n kube-system

# 모든 namespace의 관한 명령을 내릴땐 --all-namespaces를 부여한다.
kubectl get all --all-namespaces
kubectl get all -A

```

아래와 같이 yaml파일에 요소에 대한 namespace를 정해줄 수 있다.    
또한 `---` 구분기호를 통해 뒤에서부터 여러개의 요소를 정의할 수 있다.   
하지만 위에서 아래이기 때문에 순서는 중요하다.   

> 💡팁!!    
> 아래 명령어처럼  `--dry-run=client -o yaml`을 이용하여 yml파일을 손쉽게 작성 할 수 있다.
>    
> ```bash[service.md](service.md)
>  kubectl create ns ns-jenkins --dry-run=client -o yaml > ns-jenkins.yml
> ```


```yaml
# ns-jenkins.yml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: ns-jenkins
spec: {}
status: {}

---

apiVersion: v1
kind: Pod
metadata:
  name: jenkins
  namespace: ns-jenkins
spec:
  containers:
    - name: jenkins
      image: jenkins/jenkins:lts-jdk11
      ports:
        - containerPort: 8080

```

> ### 2. 큐브시스템, 스태틱파드, etcd
`/etc/kubernetes/manifests/` 경로에 환경설정 파일들이 있다.
* etcd.yaml
* kube-apiserver.yaml
* kube-controller-manager.yaml
* kube-scheduler.yaml

이 폴더에 yaml파일로 pod를 추가로 작성하면 스태틱파드를 생성할 수 있다.   
스태틱 파드는 삭제되더라도 바로 다시 생성된다.

etcd~~
