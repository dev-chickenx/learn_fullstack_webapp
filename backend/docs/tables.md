# Database Tables

## テーブル一覧
| テーブル物理名 | テーブル論理名 | 説明 |
|--------------|--------------|------|
| user | ユーザー | システムユーザー情報を管理するテーブル |
| item | アイテム | ユーザーが所有するアイテム情報を管理するテーブル |
| product | 商品 | システムで取り扱う商品の基本情報を管理するテーブル |

## User Table (user)

| 物理名 | 論理名 | データ型 | PK | FK | NULL | UNIQUE | INDEX | デフォルト値 | 説明 |
|--------|--------|----------|----|----|------|--------|--------|------------|------|
| id | ユーザーID | UUID | ○ | - | NO | YES | - | uuid_generate_v4() | システム内部で使用する一意のID |
| email | メールアドレス | VARCHAR(255) | - | - | NO | YES | YES | - | ログイン時に使用するメールアドレス |
| is_active | アクティブフラグ | BOOLEAN | - | - | NO | - | - | TRUE | アカウントの有効/無効状態 |
| is_superuser | 管理者フラグ | BOOLEAN | - | - | NO | - | - | FALSE | 管理者権限の有無 |
| full_name | 氏名 | VARCHAR(255) | - | - | YES | - | - | NULL | ユーザーの氏名 |
| hashed_password | パスワード | VARCHAR | - | - | NO | - | - | - | ハッシュ化されたパスワード |
| created_at | 作成日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード作成日時 |
| updated_at | 更新日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード更新日時 |

## Item Table (item)

| 物理名 | 論理名 | データ型 | PK | FK | NULL | UNIQUE | INDEX | デフォルト値 | 説明 |
|--------|--------|----------|----|----|------|--------|--------|------------|------|
| id | アイテムID | UUID | ○ | - | NO | YES | - | uuid_generate_v4() | システム内部で使用する一意のID |
| title | タイトル | VARCHAR(255) | - | - | NO | - | - | - | アイテムのタイトル |
| description | 説明 | VARCHAR(255) | - | - | YES | - | - | NULL | アイテムの説明文 |
| owner_id | 所有者ID | UUID | - | ○ | NO | - | YES | - | 所有ユーザーのID |
| created_at | 作成日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード作成日時 |
| updated_at | 更新日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード更新日時 |

## Product Table (product)

| 物理名 | 論理名 | データ型 | PK | FK | NULL | UNIQUE | INDEX | デフォルト値 | 説明 |
|--------|--------|----------|----|----|------|--------|--------|------------|------|
| reference_type | 参照タイプ | ENUM('R','T','Y') | ○ | - | NO | - | - | - | 商品の参照タイプ（R: 通常商品, T: 期間限定商品, Y: 予約商品） |
| item_code | 商品コード | CHAR(8) | ○ | - | NO | - | - | - | 商品を識別する8桁のコード |
| name | 商品名 | VARCHAR(255) | - | - | NO | - | YES | - | 商品の名称 |
| price | 価格 | DECIMAL(10,2) | - | - | NO | - | - | 0.00 | 商品の販売価格 |
| stock_quantity | 在庫数 | INTEGER | - | - | NO | - | - | 0 | 現在の在庫数量 |
| category | カテゴリ | VARCHAR(100) | - | - | NO | - | YES | - | 商品のカテゴリ分類 |
| status | ステータス | VARCHAR(20) | - | - | NO | - | YES | 'active' | 商品の状態（active/inactive/discontinued） |
| weight_grams | 重量(g) | INTEGER | - | - | YES | - | - | NULL | 商品の重量（グラム） |
| created_at | 作成日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード作成日時 |
| updated_at | 更新日時 | TIMESTAMP | - | - | NO | - | - | CURRENT_TIMESTAMP | レコード更新日時 |

## テーブル間の関連

### User - Item
- 関連タイプ: One-to-Many
- 親テーブル: user
- 子テーブル: item
- 外部キー制約:
  - 参照元: item.owner_id
  - 参照先: user.id
  - ON DELETE: CASCADE
  - ON UPDATE: NO ACTION

## 共通仕様

### データ型制約
- VARCHAR型のフィールドは特に指定がない限り最大255文字
- TIMESTAMP型は UTC で保存
- UUID型は version 4 を使用
- 商品参照タイプは ENUM型で以下の値のみ許可
  - R: 通常商品 (Regular)
  - T: 期間限定商品 (Temporary)
  - Y: 予約商品 (Yoyaku)

### 入力規則
- メールアドレス (email)
  - 有効なメールアドレス形式であること
  - 最大255文字
  - 重複不可
- パスワード
  - 8文字以上40文字以下
  - ハッシュ化して保存
- 商品参照タイプ (reference_type)
  - R, T, Y のいずれかの値のみ許可
- 商品コード (item_code)
  - 8桁の固定長文字列

### 監査証跡
- 全テーブルに created_at, updated_at カラムを設置
- TIMESTAMP型で、UTCタイムゾーンで記録

### インデックス
- 主キー (PK) には自動的にインデックスが作成される
- 外部キー (FK) には検索性能向上のためインデックスを作成
- メールアドレスには UNIQUE インデックスを作成

### 削除ポリシー
- ユーザーが削除された場合、関連するアイテムは自動的に削除される（CASCADE）
