# CouchDB Sync with PouchDB


## Overview

CouchDB と PouchDB の双方向同期サンプル


## How to setup CouchDB on docker

- `$ docker run -d --name mycouchdb --restart unless-stopped -p 5984:5984 -e COUCHDB_USER=user1 -e COUCHDB_PASSWORD=pass1 couchdb`


## How to reset whole DBs

- Stop and remove CouchDB on server
  - `$ docker rm -f mycouchdb`

- Reset PouchDB in all browser which has been synchronized before.

- Re-create CouchDB on server


## References

- https://hub.docker.com/_/couchdb

- https://pouchdb.com/api.html

- https://ascii.jp/elem/000/001/240/1240653/


## 課題

- [x] リモート DB の URL が HTML 内に
  - encode / decode で解決

- [x] DB が stop 後に start / restart したことを検知できない
  - `sync()` 時に **retry** オプションを付けて解決

- [x] ドキュメントの変更履歴を見る
  - オプション `{ revs_info: true }` を付けて `db.get()`

- [x] 検索 API
  - 可能であれば全文検索
  - そうでなくても、なるべく CouchDB/PouchDB で汎用的に使えそうな形で実現したい
  - 参照リンク
    - [ ] https://pouchdb.com/api.html#query_index
    - [ ] https://stackoverflow.com/questions/42931364/couchdb-full-text-search
    - [x] https://github.com/pouchdb-community/pouchdb-quick-search
  - これ↑で実現できた、スコア付き。ただし日本語非対応

- [ ] ドキュメントの変更履歴が見れないパターンがある
  - Chrome では見れるが、FireFox では見れない、というパターンもある


## Licensing

This code is licensed under MIT.


## Copyright

2023  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
