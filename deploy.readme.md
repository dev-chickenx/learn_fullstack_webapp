# HTTPでデプロイする場合

## 目的

HTTPを用いて接続し、LetsEncryptを利用しないでtraefikを利用する方法を実現する。

## 設定変更点と理由

### 1. docker-compose.traefik.yml の変更

元のファイルではHTTPSへのリダイレクトが設定されており、TLS証明書（Let's Encrypt）も利用する構成でした。
内部環境で使用するため、以下の変更を行いました：

- ポート443（HTTPS）の設定を削除
- HTTPSエントリーポイントの削除
- HTTPSリダイレクト関連の設定を削除
- 証明書関連の設定とボリュームを削除

```yaml
# 変更前（一部抜粋）
ports:
  # Listen on port 80, default for HTTP, necessary to redirect to HTTPS
  - 80:80
  # Listen on port 443, default for HTTPS
  - 443:443

# 変更後
ports:
  # Listen on port 80, default for HTTP
  - 80:80
```

TLS証明書の生成や検証に関するコマンドも削除しました：

```yaml
# 変更前（一部抜粋）
command:
  # ...
  # Create an entrypoint "https" listening on port 443
  - --entrypoints.https.address=:443
  # Create the certificate resolver "le" for Let's Encrypt
  - --certificatesresolvers.le.acme.email=${EMAIL?Variable not set}
  # Store the Let's Encrypt certificates in the mounted volume
  - --certificatesresolvers.le.acme.storage=/certificates/acme.json
  # Use the TLS Challenge for Let's Encrypt
  - --certificatesresolvers.le.acme.tlschallenge=true

# 変更後
command:
  # ...
  # Create an entrypoint "http" listening on port 80
  - --entrypoints.http.address=:80
  # その他のTLS関連設定は削除
```

### 2. docker-compose.yml の変更

メインのdocker-compose.ymlでは、各サービス（backend、frontend、adminer）で以下の変更を行いました：

- HTTPSルータールールの削除
- HTTPからHTTPSへのリダイレクト設定の削除
- フロントエンドのAPI URL設定をHTTPに変更

```yaml
# 変更前（backend設定の一部）
- traefik.http.routers.${STACK_NAME?Variable not set}-backend-https.rule=Host(`api.${DOMAIN?Variable not set}`)
- traefik.http.routers.${STACK_NAME?Variable not set}-backend-https.entrypoints=https
- traefik.http.routers.${STACK_NAME?Variable not set}-backend-https.tls=true
- traefik.http.routers.${STACK_NAME?Variable not set}-backend-https.tls.certresolver=le
- traefik.http.routers.${STACK_NAME?Variable not set}-backend-http.middlewares=https-redirect

# 変更後はHTTPルーターのみを残し、HTTPS関連設定を削除
```

フロントエンドのビルド設定も変更しました：

```yaml
# 変更前
args:
  - VITE_API_URL=https://api.${DOMAIN?Variable not set}

# 変更後
args:
  - VITE_API_URL=http://api.${DOMAIN?Variable not set}
```

### 3. .env ファイルの変更

環境変数ファイルでは以下の変更を行いました：

- DOMAINを内部ドメイン名に設定
- FRONTEND_HOSTをHTTPに変更
- BACKEND_CORS_ORIGINSをHTTPのみにして内部ドメインを指定
- デプロイ用のセキュリティキーを変更（SECRET_KEY、FIRST_SUPERUSER_PASSWORD、POSTGRES_PASSWORD）

```
# 変更前
DOMAIN=localhost
FRONTEND_HOST=http://localhost:5173

# 変更後
DOMAIN=test-app.internal
FRONTEND_HOST=http://dashboard.${DOMAIN}
```

### 4. frontend/.env ファイルの変更

フロントエンドの環境変数ファイルでは、API URLをHTTPに変更しました：

```
# 変更前
VITE_API_URL=http://localhost:8000

# 変更後
VITE_API_URL=http://api.test-app.internal
```

## デプロイ手順

1. トラフィックネットワークの作成

```bash
docker network create traefik-public
```

2. トラフィックの認証情報設定

```bash
export USERNAME=admin
export PASSWORD=適切なパスワード
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
```

3. トラフィックの起動

```bash
docker compose -f docker-compose.traefik.yml up -d
```

4. メインアプリケーションの起動

```bash
docker compose -f docker-compose.yml up -d
```

## アクセス方法

設定したドメイン名でアクセスできます：

- フロントエンド: `http://dashboard.test-app.internal`
- バックエンドAPI: `http://api.test-app.internal`
- Adminer: `http://adminer.test-app.internal`
- Traefik管理画面: `http://traefik.test-app.internal`

ホスト名を解決するために、社内DNSに登録するか、一時的にhostsファイルに追加する必要があります。
