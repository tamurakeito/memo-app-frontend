import axios from "axios";

export const client = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
  timeout: 15000,
});

// 必要なAPI
// 各メモの詳細を取得する
// メモの一覧を取得する
// メモ名を変更する
// メモのタグステータスを変更する
// メモを追加する
// メモを削除する
// タスクステータスを変更する（複数）
// タスクを追加する
// タスクを削除する（複数）
//
