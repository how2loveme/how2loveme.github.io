---
title: 'helm 배우기1 - nginx ingress로 nginx서비스하기'
date: '2025-08-12'
---

# nginx-hello Helm 차트 상세 설명.md

이 문서는 이전에 제공한 Helm 차트의 각 파일을 구성 라인별로 상세히 설명합니다. 대상은 다음 파일들입니다:
- Chart.yaml
- values.yaml
- templates/_helpers.tpl
- templates/configmap.yaml
- templates/deployment.yaml
- templates/service.yaml
- templates/ingress.yaml (host 필드 생략 가능하도록 수정된 버전)

각 섹션은 코드와 그 라인에 대한 설명으로 구성됩니다.

---

## 1) Chart.yaml

```yaml
# yaml
apiVersion: v2
name: nginx-hello
description: A minimal Helm chart for nginx "hello world" with nginx-ingress
type: application
version: 0.1.0
appVersion: "latest"
```


- apiVersion: v2
  - Helm 차트의 메타 스키마 버전입니다. Helm 3에서 사용하는 차트 포맷입니다.
- name: nginx-hello
  - 차트의 이름입니다. 템플릿 헬퍼 등에서 사용됩니다.
- description: ...
  - 차트 설명 문자열입니다.
- type: application
  - 애플리케이션 배포용 차트임을 명시합니다. (라이브러리 차트가 아님)
- version: 0.1.0
  - 차트의 자체 버전입니다. 차트 패키징/업데이트 시 관리됩니다.
- appVersion: "latest"
  - 애플리케이션(여기서는 nginx)의 앱 버전 표기입니다. 관례적으로 이미지 버전과 연동해 설명 목적으로 사용됩니다.

---

## 2) values.yaml

```yaml
# yaml
image:
  repository: nginx
  tag: latest
  pullPolicy: IfNotPresent

replicaCount: 1

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  annotations: {}
  hosts:
    - host: example.com
      paths:
        - path: /
          pathType: Prefix
  tls: []

resources: {}
nodeSelector: {}
tolerations: []
affinity: {}
```


- image.repository: nginx
  - 사용할 컨테이너 이미지의 저장소 이름입니다.
- image.tag: latest
  - 사용할 이미지 태그(버전)입니다. 데모 용으로 latest 사용.
- image.pullPolicy: IfNotPresent
  - 로컬에 이미지가 없을 때만 풀(pull)합니다.
- replicaCount: 1
  - Deployment의 Pod 복제 수입니다.
- service.type: ClusterIP
  - Service 타입입니다. Ingress를 통해 진입하므로 ClusterIP가 표준입니다.
- service.port: 80
  - Service가 노출할 포트입니다. nginx 컨테이너의 80으로 라우팅됩니다.
- ingress.enabled: true
  - Ingress 리소스를 생성할지 여부를 제어합니다.
- ingress.className: nginx
  - 사용할 IngressClass 이름입니다. ingress-nginx 컨트롤러의 기본 클래스가 nginx입니다.
- ingress.annotations: {}
  - Ingress 메타데이터에 삽입할 주석(Annotation) 맵입니다.
- ingress.hosts: [...]
  - Ingress 라우팅 규칙 배열입니다.
  - host: example.com
    - 호스트 헤더 매칭 값입니다. 필요 시 생략 가능(템플릿에서 빈 값이면 모든 호스트 매칭).
  - paths: 경로 규칙 목록입니다.
    - path: /
      - 요청 경로(prefix)입니다.
    - pathType: Prefix
      - path 매칭 방식입니다. Prefix는 하위 경로 포함 매칭입니다.
- ingress.tls: []
  - TLS 설정입니다. 데모에서는 비워두었습니다.
- resources/nodeSelector/tolerations/affinity
  - 리소스 제한, 노드 스케줄링 제약 등을 커스터마이즈할 때 사용하는 값입니다. 기본값은 비어 있습니다.

---

## 3) templates/_helpers.tpl

```yaml
# yaml
{{- define "nginx-hello.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "nginx-hello.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "nginx-hello.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "nginx-hello.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
```


- define "nginx-hello.name"
  - 차트 이름(.Chart.Name)을 최대 63자로 자르고(trunc) 끝의 하이픈을 제거(trimSuffix "-")합니다. Kubernetes 리소스 네이밍 제한(63자)을 맞추기 위함입니다.
- define "nginx-hello.chart"
  - 차트 이름과 차트 버전을 합친 문자열을 반환합니다. 라벨 등에 사용합니다.
- define "nginx-hello.fullname"
  - Release 이름(.Release.Name)과 차트 이름을 결합하여 충돌 방지용 풀네임을 만듭니다. 63자 제한과 하이픈 후처리를 적용합니다.

---

## 4) templates/configmap.yaml

```yaml
# yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "nginx-hello.fullname" . }}-content
  labels:
    app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
    helm.sh/chart: {{ include "nginx-hello.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
data:
  index.html: |
    <span>hello world</span>
```


- apiVersion/kind: ConfigMap
  - 키-값 텍스트 데이터를 담는 리소스입니다.
- metadata.name
  - 배포마다 고유하도록 풀네임+접미사(-content)로 설정합니다.
- labels
  - 공통 라벨 세트입니다. 추적/선택/운영 도구와의 연계를 위해 권장되는 표준 라벨들입니다.
- data.index.html
  - nginx가 기본으로 제공하는 문서 루트(/usr/share/nginx/html)에 마운트될 index.html 내용입니다.
  - 파이프(|)는 멀티라인 문자열을 의미합니다.

---

## 5) templates/deployment.yaml

```yaml
# yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "nginx-hello.fullname" . }}
  labels:
    app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
    helm.sh/chart: {{ include "nginx-hello.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
    spec:
      containers:
        - name: nginx
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          volumeMounts:
            - name: web-content
              mountPath: /usr/share/nginx/html
              readOnly: true
      volumes:
        - name: web-content
          configMap:
            name: {{ include "nginx-hello.fullname" . }}-content
            items:
              - key: index.html
                path: index.html
      {{- with .Values.nodeSelector }}
      nodeSelector: {{ toYaml . | nindent 6 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity: {{ toYaml . | nindent 6 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations: {{ toYaml . | nindent 6 }}
      {{- end }}
```


- kind: Deployment
  - 선언적 방식의 Pod 배포/롤링 업데이트 리소스입니다.
- metadata.name/labels
  - 리소스 이름과 표준 라벨들입니다.
- spec.replicas
  - Pod 개수입니다. values.yaml의 replicaCount로 제어합니다.
- spec.selector.matchLabels
  - 이 Deployment가 관리할 Pod를 식별하는 라벨 셀렉터입니다.
- template.metadata.labels
  - 생성될 Pod에 부여할 라벨입니다. selector와 일치해야 합니다.
- containers[0].name: nginx
  - 컨테이너 이름입니다.
- image
  - values.yaml의 repository:tag로부터 이미지 풀 경로를 구성합니다.
- imagePullPolicy
  - IfNotPresent 등 풀 정책입니다.
- ports.containerPort: 80
  - 컨테이너가 리스닝하는 포트입니다.
- volumeMounts
  - web-content 볼륨을 nginx의 문서 루트(/usr/share/nginx/html)에 읽기 전용으로 마운트합니다.
- volumes.configMap
  - ConfigMap을 볼륨으로 노출합니다.
  - items.key/path
    - index.html 키만 선택적으로 마운트하고 파일명 index.html로 저장합니다.
- with .Values.nodeSelector/affinity/tolerations
  - values에 값이 있을 때만 해당 스케줄링 옵션을 렌더링합니다.
  - toYaml | nindent 6: 들여쓰기와 YAML 변환을 올바르게 처리합니다.

---

## 6) templates/service.yaml

```yaml
# yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "nginx-hello.fullname" . }}
  labels:
    app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
    helm.sh/chart: {{ include "nginx-hello.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
  selector:
    app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
```


- kind: Service
  - Pod에 대한 네트워크 엔드포인트를 생성합니다.
- spec.type
  - ClusterIP(기본)로 설정됩니다. Ingress가 이 Service로 트래픽을 보냅니다.
- ports[0].name: http
  - 포트의 이름입니다. Deployment의 containerPort 이름(http)과 매칭에 사용됩니다.
- ports[0].port
  - 서비스가 노출하는 포트(클러스터 내부에서 접근할 포트)입니다.
- ports[0].targetPort: http
  - Pod의 포트를 지정합니다. 숫자(80) 대신 포트 이름(http)으로 참조합니다.
- selector
  - 이 Service가 트래픽을 라우팅할 Pod를 선택하는 라벨입니다. Deployment의 라벨과 일치해야 합니다.

---

## 7) templates/ingress.yaml (host 생략 가능 버전)

```yaml
# yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "nginx-hello.fullname" . }}
  labels:
    app.kubernetes.io/name: {{ include "nginx-hello.name" . }}
    helm.sh/chart: {{ include "nginx-hello.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - {{- if .host }}
      host: {{ .host | quote }}
      {{- end }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType | default "Prefix" }}
            backend:
              service:
                name: {{ include "nginx-hello.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
  {{- with .Values.ingress.tls }}
  tls:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
```


- if .Values.ingress.enabled
  - values에서 Ingress 생성 여부를 확인합니다. false면 전체 블록이 렌더링되지 않습니다.
- apiVersion/kind: Ingress
  - L7(HTTP/S) 라우팅을 정의하는 리소스입니다.
- metadata.name/labels
  - 리소스 이름과 표준 라벨입니다.
- with .Values.ingress.annotations
  - 주석 맵이 비어 있지 않을 때만 annotations를 렌더링합니다.
- spec.ingressClassName
  - 사용할 Ingress 컨트롤러 클래스를 지정합니다. 여기서는 nginx(ingress-nginx).
- rules
  - Ingress 라우팅 규칙들입니다.
- range .Values.ingress.hosts
  - hosts 배열을 순회하며 규칙을 생성합니다.
- if .host
  - host 값이 존재할 때만 host 필드를 렌더링합니다. 값이 없으면 모든 호스트에 매칭됩니다.
- http.paths
  - 경로 규칙 목록입니다. 각 path마다 backend로 라우팅을 정의합니다.
- path / pathType
  - 경로 문자열과 매칭 타입입니다. Prefix는 하위 경로 매칭에 사용됩니다.
- backend.service.name
  - 트래픽 대상 Service 이름입니다. 동일 차트의 Service를 include 헬퍼로 가져옵니다.
- backend.service.port.number
  - Service 포트 번호입니다. values의 service.port를 사용합니다.
- with .Values.ingress.tls
  - TLS 설정이 있을 때만 tls 블록을 렌더링합니다.

---

## 8) 동작 흐름 요약

- 클라이언트 → ingress-nginx(컨트롤러 Service)
  - LoadBalancer가 없으면 NodePort(예: 30080)로 접근합니다.
- ingress-nginx → Ingress 규칙 매칭
  - host가 비어 있으면 모든 Host 헤더 수용, path로 매칭.
- Ingress → Service(ClusterIP)
  - 지정된 포트로 라우팅.
- Service → Pod(nginx 컨테이너)
  - /usr/share/nginx/html의 index.html을 제공. ConfigMap에서 마운트됨.

---

## 9) 테스트/운영 팁

- host 없이 테스트하려면 values.yaml에서 hosts 항목의 host 키를 생략하세요. 예:
```yaml
# yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - paths:
        - path: /
          pathType: Prefix
```

- ingress-nginx를 NodePort로 배포했다면:
  - 브라우저: http://<워커노드-IP>:30080/
  - curl: curl -i http://<워커노드-IP>:30080/
- host를 지정했다면 Host 헤더가 일치해야 합니다:
  - curl -H "Host: example.com" http://<워커노드-IP>:30080/

---

## 10) 주요 Helm 템플릿 함수/지시어 간단 정리

- include "name" .
  - 다른 템플릿 블록의 출력을 삽입합니다.
- toYaml . | nindent N
  - 객체를 YAML로 직렬화하고 N칸 들여쓰기합니다.
- with .Values.something
  - 값이 비어 있지 않을 때 블록을 실행합니다.
- if/else, range
  - 조건부 렌더링 및 반복 렌더링에 사용합니다.
- trunc 63 | trimSuffix "-"
  - 문자열 길이 제한과 접미사 제거를 통해 K8s 이름 제한을 준수합니다.

---

필요하시면 이 문서와 함께 실제 차트 폴더를 아카이브로 정리하거나, 추가 옵션(리소스 제한, 헬스 체크, 로그/메트릭 설정 등)도 확장해 드릴 수 있습니다.
