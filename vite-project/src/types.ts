//todo.tsxで設定してある型の定義してあるのをこちらに移す
export interface Todo {
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
  sort: number; //並び順を管理するカラム
}