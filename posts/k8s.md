---
title: 'Google Cloud - Compute Engine k8s 설정'
date: '2023-09-05'
---

## 구글 클라우드를 이용한 쿠버네티스 설정
구글 클라우드에서 쿠버네티스 환경을 구성해보려고 한다.   
GKE(Google Kubernetes Engine)로 구성할 수 있다곤 하지만, 기계의 편리함과 동작방식, 혁신을 알려면 수작업도 해봐야 한다고 생각한다.   
그래서 강의를 보며 클라우드 컴퓨터로 손수 만들기로 한다.   
허나,,, k8s는 수시로 버전업이 되고 있어서 강의시점과 맞지 않는지,,,    
잘 설정이 되지 않더라.

> ### 인스턴스 만들기

`AWS의 EC2 인스턴스`와 같은 개념의 `구글의 Compute Engine 인스턴스`를 이용하여

master노드 1대와 worker노드 2대를 구성해보려고 한다.

- 먼저 아래와 같은 스펙으로 인스턴스를 만들고, SSH에 접속하여 환경을 구성을 시작한다.

    | 환경    | 값             |
    |-------|---------------|
    | OS    | ubuntu20.04   |
    | arch  | amd64(x86_64) |
    | RAM   | 4GB           |
    | 디스크유형 | 표준영구디스크       |
    | 디스크용량 | 100GB         |

> ### 환경 설정 (2023.09.05 기준)
#### 1. containerd 설치
각 노드(node)에서 파드(pod)가 실행 될 수 있도록 하는것은 `컨테이너 런타임`이다.   
쿠버네티스 1.24버전 이전에는 `도커심`으로 편하게 `도커엔진`과 통합을 하여 환경을 구축할 수 있었다고 한다.   
도커엔진은 컨테이너 런타임 중 하나이다.

* 컨테이너 런타임 종류
  1. containerd
  2. CRI-O
  3. 도커엔진
  4. 미란티스 컨테이너 런타임(MCR)

하지만 도커심이 1.24 이후 버전에서는 지원되지 않기 때문에 런타임의 종류중 하나인 containerd를 설치해보겠다.

🔗 [containerd 설치 공식url](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)

* containerd 설치 방법 3가지
  1. 바이너리 파일을 이용
  2. apt-get이나 dnf같은 패키지 매니저 사용(도커사용)
  3. 소스 이용(소스로 빌드해야함)

이 중에서 1번을 이용하여 도커없이 containerd를 설치 해보려 한다. 별다를 것 없이 설치가이드대로 진행할 것이다.


```bash
# kubelet이 정삭 작동하도록 스왑을 비활성화 해야함.
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
 
# containerd, runc, CNI plugins 3가지 설치 필요
# step1. containerd 설치
# containerd  
pwd
# /home/{user}

wget https://github.com/containerd/containerd/releases/download/v1.7.5/containerd-1.7.5-linux-amd64.tar.gz
sudo tar Cxzvf /usr/local containerd-1.7.5-linux-amd64.tar.gz

wget https://raw.githubusercontent.com/containerd/containerd/main/containerd.service
sudo mkdir -p /usr/local/lib/systemd/system/
sudo mv containerd.service /usr/local/lib/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable --now containerd


# step2. runc 설치
wget https://github.com/opencontainers/runc/releases/download/v1.1.9/runc.amd64
sudo install -m 775 runc.amd64 /usr/local/sbin/runc


# step3. CNI plugins 설치
wget https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz
sudo mkdir -p /opt/cni/bin
sudo tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.3.0.tgz

# step4. config파일 생성
sudo mkdir -p /etc/containerd/
containerd config default | sudo tee /etc/containerd/config.toml

# step5. cgroup 드라이버를 runc에서 사용 가능하도록 설정
sed 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml | sudo tee /etc/containerd/config.toml
sudo systemctl restart containerd

# 설치 확인
ls /run/containerd/containerd.sock


```

#### 2. kubeadm, kubelet, kubectl 설치
```bash
cat <<EOF > kube_install.sh
# apt패키지 색인 업데이트 및 필요 패키지 설치
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

# 구글 클라우드 pubkey 다운
sudo mkdir -p /etc/apt/keyrings/ 
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# 쿠버네티스 apt 리포지터리 추가
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# apt 패키지 색인 업데이트 및 kubeadm, kubelet, kubectl 설치
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 확인
kubeadm version
EOF

sudo bash kube_install.sh

```

> 💡Tip !
> * apt-get install 혹은 apt install할땐 다음 명령어가 실행 안 됨
> * 허나 쉘파일로 만들어서 실행시키면 한방에 실행 가능함   
> (주석은안보임 echo 때려야 함)


#### 3. IPv4를 포워딩하여 iptables가 브리지된 트래픽을 보게 하기

리눅스 노드의 iptables가 브리지된 트래픽을 올바르게 보기 위한 요구 사항   
네트워크 보안관련된 스위치설정 같은거...? 헌데 잘모르겠다.   
iptables는 방화벽 같은건데 말이다.   
...사실 잘 모르겠다 공부를 더 해봐야겠다.    

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 필요한 sysctl 파라미터를 설정하면, 재부팅 후에도 값이 유지된다.
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bri[service.md](service.md)dge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 재부팅하지 않고 sysctl 파라미터 적용하기
sudo sysctl --system
```

> ### 4. 노드 구성
쿠버네티스가 설치된 세 개의 노드가 있다고 가정하면,   
하나의 노드를 마스터노드로 쓰고, 나머지 두개의 노드를 워커노드로 사용한다.    
마스터노드에 워커노드들을 연결하는 작업이 필요하다.   
이를 클러스터라고 하고, 마스터와 워커에서 아래와 같이 작업해야한다.
```bash
# master node
sudo kubeadm init

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config[service.md](service.md)
```

마스터노드에서 kubeadm을 init하면 아래와 같은 토큰이 생성 및 조인 명령어를 표출해준다.   
이를 워커노드에서 실행하면 된다. 권한이 없이 때문에 sudo를 붙여야 한다.
```bash
# worker nodes
sudo kubeadm join 10.138.0.9:6443 --token 7av8r9.0imaecklarbq1kou         
--discovery-token-ca-cert-hash sha256:0d0ff8fdc1918f10f5caeb7fcb2dd0edaaba92b705cb9d16058f8ca56a2c514e
```
이렇게하면 조인이 된다. 마스터노드에서 아래 명령어로 확인 할 수 있다.
```bash
kubectl get nodes -o wide
```
마지막으로 파드 네트워크를 설치해서 노드간 네트워크 통신이 가능하게 해야한다.   
마스터노드에서 필요한 작업이고, Cilium을 사용해서 클러스터 파드 네트워크 통신을 하겠다.
```bash
# master node
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
cilium install
cilium status

# cluster 노드들 확인
kubectl get nodes -o wide
```
이렇게 하면 `STATUS`가 NotReady에서 Ready로 변경된 것을 볼 수 있다.




      