 Todo List (React + Rails API)

## 🚀 起動
```bash
git clone https://github.com/sutou81/todo_list_proaka.git
cd todo_list_proaka
docker compose up -d          # front:5173 / api:3031 / db


## 動作確認
curl http://localhost:3031/api/v1/todos | jq .//以下の添付画像①を参照

### React ⇔ API が繋がっている証拠
①![Image](https://github.com/user-attachments/assets/ec81596f-55c0-44a2-beff-9d3a6110cc62)
②![Image](https://github.com/user-attachments/assets/a810ef0b-3e4e-4c2a-be9d-382423f8232c)
