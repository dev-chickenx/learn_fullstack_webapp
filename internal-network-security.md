# 社内ネットワークからのアクセス制限設定

このドキュメントでは、Traefikを利用して社内ネットワークからのみアクセスを許可する設定方法について説明します。特にデータベース管理ツール（Adminer）などの機密性の高いサービスへのアクセスを制限する方法に焦点を当てています。

## 1. IP制限による保護

Traefikでは、特定のIPアドレス範囲からのアクセスのみを許可するミドルウェアを設定できます。これにより、社内ネットワークのIPアドレス範囲からのアクセスのみを許可することができます。

### 設定手順

#### 1.1 社内ネットワークのIPアドレス範囲を特定する

多くの企業では、以下のようなプライベートIPアドレス範囲を使用しています：

- `10.0.0.0/8` - クラスA プライベートネットワーク
- `172.16.0.0/12` - クラスB プライベートネットワーク
- `192.168.0.0/16` - クラスC プライベートネットワーク

実際の社内ネットワークのIPアドレス範囲を確認してください。例えば、社内が`10.1.0.0/16`を使用している場合は、その範囲を指定します。

#### 1.2 docker-compose.ymlの修正

以下はAdminerサービスにIP制限を追加する例です：

```yaml
adminer:
  # ... 既存の設定 ...
  labels:
    # ... 既存のラベル ...
    - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    - traefik.http.routers.${STACK_NAME?Variable not set}-adminer-http.middlewares=${STACK_NAME?Variable not set}-adminer-ipwhitelist
```

**設定の説明：**

- `ipwhitelist.sourcerange`: アクセスを許可するIPアドレス範囲をCIDR表記で指定します。複数の範囲はカンマで区切ります。
- 上記の例では、一般的なプライベートIPアドレス範囲を全て許可していますが、実際の環境では必要な範囲のみを指定してください。

#### 1.3 すべての管理サービスに制限を適用

より包括的なセキュリティのために、APIやその他の管理サービスにも同様の制限を適用できます：

```yaml
backend:
  # ... 既存の設定 ...
  labels:
    # ... 既存のラベル ...
    - traefik.http.middlewares.${STACK_NAME?Variable not set}-api-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    - traefik.http.routers.${STACK_NAME?Variable not set}-backend-http.middlewares=${STACK_NAME?Variable not set}-api-ipwhitelist

traefik:
  # ... 既存の設定 ...
  labels:
    # ... 既存のラベル ...
    - traefik.http.middlewares.traefik-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    - traefik.http.routers.traefik-dashboard-http.middlewares=admin-auth,traefik-ipwhitelist
```

## 2. IP制限と認証の組み合わせ

より強力なセキュリティのために、IP制限とBasic認証を組み合わせることができます。

### 設定手順

#### 2.1 認証情報の設定

環境変数に認証情報を追加します（.envファイル）：

```
# 管理ツール用認証情報
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=生成されたハッシュ値
```

ハッシュ値の生成は以下のコマンドで行えます：

```bash
openssl passwd -apr1 "あなたのパスワード"
```

#### 2.2 docker-compose.ymlの修正

IP制限と認証を組み合わせた設定例：

```yaml
adminer:
  # ... 既存の設定 ...
  labels:
    # ... 既存のラベル ...
    - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
    - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-auth.basicauth.users=${ADMIN_USER?Variable not set}:${ADMIN_PASSWORD_HASH?Variable not set}
    - traefik.http.routers.${STACK_NAME?Variable not set}-adminer-http.middlewares=${STACK_NAME?Variable not set}-adminer-ipwhitelist,${STACK_NAME?Variable not set}-adminer-auth
```

**設定の説明：**

- `basicauth.users`: Basic認証に使用するユーザー名とパスワードハッシュ
- `middlewares`: 複数のミドルウェア（IP制限と認証）をカンマで区切って適用

## 3. 環境別の設定管理

本番環境と開発環境で異なるセキュリティ設定を適用するために、環境変数と条件付き設定を組み合わせることができます。

### 3.1 環境変数による制御

`.env`ファイルで環境を指定：

```
ENVIRONMENT=production  # または staging, local
```

### 3.2 環境別の設定ファイル

環境別の設定ファイルを作成します：

- `docker-compose.yml`: 基本設定
- `docker-compose.prod.yml`: 本番環境用（セキュリティ強化）
- `docker-compose.dev.yml`: 開発環境用（より緩いアクセス制限）

**docker-compose.prod.yml の例：**

```yaml
version: '3'

services:
  adminer:
    labels:
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-auth.basicauth.users=${ADMIN_USER?Variable not set}:${ADMIN_PASSWORD_HASH?Variable not set}
      - traefik.http.routers.${STACK_NAME?Variable not set}-adminer-http.middlewares=${STACK_NAME?Variable not set}-adminer-ipwhitelist,${STACK_NAME?Variable not set}-adminer-auth

  backend:
    labels:
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-api-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - traefik.http.routers.${STACK_NAME?Variable not set}-backend-http.middlewares=${STACK_NAME?Variable not set}-api-ipwhitelist
```

### 3.3 環境に応じた起動コマンド

環境に応じて異なるコマンドで起動します：

```bash
# 本番環境
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 開発環境
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 4. ネットワークセグメンテーション

データベースサービスを内部ネットワークのみにアクセス可能にし、直接外部からアクセスできないようにします。

### 設定手順

#### 4.1 docker-compose.ymlの修正

```yaml
db:
  # ... 既存の設定 ...
  networks:
    - default
  # traefik-publicネットワークには接続しない
```

この設定により、DBサービスはTraefikを通じた外部からのアクセスが不可能になり、コンテナ間の内部通信のみが許可されます。

## 5. 完全なセキュリティ設定例

以下は、すべてのセキュリティ対策を組み合わせた完全な設定例です。

```yaml
version: '3'

services:
  traefik:
    # ... 既存の設定 ...
    labels:
      # ... 既存のラベル ...
      - traefik.http.middlewares.traefik-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - traefik.http.routers.traefik-dashboard-http.middlewares=admin-auth,traefik-ipwhitelist

  db:
    # ... 既存の設定 ...
    networks:
      - default  # 内部ネットワークのみ

  adminer:
    # ... 既存の設定 ...
    networks:
      - traefik-public
      - default
    labels:
      # ... 既存のラベル ...
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-adminer-auth.basicauth.users=${ADMIN_USER?Variable not set}:${ADMIN_PASSWORD_HASH?Variable not set}
      - traefik.http.routers.${STACK_NAME?Variable not set}-adminer-http.middlewares=${STACK_NAME?Variable not set}-adminer-ipwhitelist,${STACK_NAME?Variable not set}-adminer-auth

  backend:
    # ... 既存の設定 ...
    labels:
      # ... 既存のラベル ...
      - traefik.http.middlewares.${STACK_NAME?Variable not set}-api-ipwhitelist.ipwhitelist.sourcerange=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - traefik.http.routers.${STACK_NAME?Variable not set}-backend-http.middlewares=${STACK_NAME?Variable not set}-api-ipwhitelist
```

## 6. 追加のセキュリティ対策

### 6.1 リバースプロキシの保護

Traefikがインターネットに公開されている場合は、以下の対策も検討してください：

1. **WAF (Web Application Firewall)** の導入
2. **レート制限** の設定：

   ```yaml
   - traefik.http.middlewares.rate-limit.ratelimit.average=100
   - traefik.http.middlewares.rate-limit.ratelimit.burst=50
   ```

3. **ヘッダーセキュリティ** の強化：

   ```yaml
   - traefik.http.middlewares.secure-headers.headers.sslRedirect=true
   - traefik.http.middlewares.secure-headers.headers.contentTypeNosniff=true
   - traefik.http.middlewares.secure-headers.headers.forceSTSHeader=true
   - traefik.http.middlewares.secure-headers.headers.stsIncludeSubdomains=true
   - traefik.http.middlewares.secure-headers.headers.stsPreload=true
   ```

### 6.2 定期的なセキュリティレビュー

1. **コンテナのスキャン**：`docker scan`や`trivy`などを使用してセキュリティ脆弱性をスキャン
2. **アクセスログの監視**：不審なアクセスパターンを検出
3. **設定の定期的な見直し**：不要なサービスの無効化や、IPホワイトリストの更新

## まとめ

社内ネットワークからのみアクセス可能にする設定は、プロダクション環境におけるセキュリティの重要な要素です。IP制限、認証、ネットワークセグメンテーションを組み合わせることで、機密性の高いサービスや管理ツールへのアクセスを効果的に制限できます。

環境別の設定ファイルを使用することで、開発環境と本番環境で適切なセキュリティレベルを維持しながら、柔軟性も確保できます。
