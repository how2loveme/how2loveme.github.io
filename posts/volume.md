---
title: 'Volume'
date: '2023-11-14'
---

## volume
#### 1. 임시볼륨
두 개 이상의 컨테이너간 저장소 공유를 위함
- emptyDir
[공식문서](https://kubernetes.io/ko/docs/concepts/storage/volumes/#emptydir)   

```yaml
# count-httpd.yaml
apiVersion: v1
kind: Pod
metadata:
  name: count
spec:
  containers:
    - image: gasbugs/count
      name: html-generator
      volumeMounts:
        - mountPath: /var/htdocs
          name: html
    - image: httpd
      name: web-server
      volumeMounts:
        - mountPath: /usr/local/apache2/htdocs
          name: html
          readOnly: true
      ports:
        - containerPort: 80
  volumes:
    - name: html
      emptyDir:
        sizeLimit: 500Mi

```
위 yaml파일을 실행시킨 후에 아무 pod나 만들어서 들어간다음에, count컨테이너에 접속해본다.   
볼륨을 사용하기 때문에 httpd로 접속하더라도, gasbugs/count로 인해 생성된 /var/htdocs의 html이 응답으로 표출된다.     
```bash
kubectl create -f count-httpd.yaml
kubectl create deploy http-go --image=gasbugs/http-go
kubectl exec -it {pod} -- curl {ip}
```

#### 2. 로컬볼륨

- hostPath