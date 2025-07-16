<script setup>
import { ref } from 'vue';

const messages = ref([]);
const userInput = ref('');
// ローディング状態を管理する変数
const isLoading = ref(false);

// APIエンドポイントのURL
// あなたのCloudflare WorkersのURLに置き換えてください
const API_ENDPOINT = 'https://black-mud-382d.corsicajp.workers.dev/';

const sendMessage = async () => { // asyncを追加して非同期処理を可能にする
  if (userInput.value.trim() === '') return;

  const userQuestion = userInput.value;
  messages.value.push({ type: 'user', text: userQuestion });
  userInput.value = ''; // 入力フィールドをクリア

  isLoading.value = true; // ローディング開始

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userQuestion }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    messages.value.push({ type: 'ai', text: data.answer });
  } catch (error) {
    console.error('Failed to fetch AI answer:', error);
    messages.value.push({ type: 'ai', text: 'エラーが発生しました: ' + error.message });
  } finally {
    isLoading.value = false; // ローディング終了
  }
};
</script>

<template>
  <!-- 本番環境に埋め込むチャットボットウィンドウの開始 -->
  <div class="chat-container">
    <h1>AI Chatbot</h1>
    <div class="message-list">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
        {{ msg.text }}
      </div>
      <div v-if="isLoading" class="loading-message">AIが思考中...</div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="質問を入力してください..."
        :disabled="isLoading" />
      <button @click="sendMessage" :disabled="isLoading">送信</button>
    </div>
  </div>
  <!-- 本番環境に埋め込むチャットボットウィンドウの終了 -->
</template>

<style scoped>
/* 本番環境に埋め込むチャットボットウィンドウのスタイルの開始 */
.loading-message {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 15px;
  max-width: 80%;
  background-color: #f0f0f0;
  color: #555;
  text-align: center;
  align-self: flex-start;
  margin-right: auto;
  font-style: italic;
}

.chat-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  background-color: white; /* 背景色を追加 */
}

h1 {
  text-align: center;
  color: #333;
}

.message-list {
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.message {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 15px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
  text-align: right;
}

.message.ai {
  background-color: #e2e3e5;
  color: #333;
  align-self: flex-start;
  text-align: left;
}

.input-area {
  display: flex;
  gap: 10px;
}

.input-area input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input-area button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.input-area button:hover {
  background-color: #218838;
}
/* 本番環境に埋め込むチャットボットウィンドウのスタイルの終了 */
</style>
