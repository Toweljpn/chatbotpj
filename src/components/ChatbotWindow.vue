<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);

const API_ENDPOINT = 'https://black-mud-382d.corsicajp.workers.dev/';

// ドラッグ機能のためのrefと状態
const chatWindow = ref(null);
const isDragging = ref(false);
const initialMouseX = ref(0); // マウスの初期X座標
const initialMouseY = ref(0); // マウスの初期Y座標
const initialWindowX = ref(0); // ウィンドウの初期left値
const initialWindowY = ref(0); // ウィンドウの初期top値

const startDrag = (e) => {
  isDragging.value = true;
  initialMouseX.value = e.clientX;
  initialMouseY.value = e.clientY;

  // ウィンドウの現在のleftとtopのスタイル値を取得し、数値に変換
  // style.left/top が設定されていない場合は、getComputedStyleを使用
  const computedStyle = window.getComputedStyle(chatWindow.value);
  initialWindowX.value = parseFloat(computedStyle.left);
  initialWindowY.value = parseFloat(computedStyle.top);

  window.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', stopDrag);
};

const doDrag = (e) => {
  if (!isDragging.value) return;

  // マウスの移動量に基づいてウィンドウの新しい位置を計算
  const dx = e.clientX - initialMouseX.value;
  const dy = e.clientY - initialMouseY.value;

  let newX = initialWindowX.value + dx;
  let newY = initialWindowY.value + dy;

  // ウィンドウが画面外に出ないように制限
  const windowWidth = chatWindow.value.offsetWidth;
  const windowHeight = chatWindow.value.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (newX < 0) newX = 0;
  if (newY < 0) newY = 0;
  if (newX + windowWidth > viewportWidth) newX = viewportWidth - windowWidth;
  if (newY + windowHeight > viewportHeight) newY = viewportHeight - windowHeight;


  chatWindow.value.style.left = `${newX}px`;
  chatWindow.value.style.top = `${newY}px`;
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', doDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const sendMessage = async () => {
  if (userInput.value.trim() === '') return;

  const userQuestion = userInput.value;
  messages.value.push({ type: 'user', text: userQuestion });
  userInput.value = '';

  isLoading.value = true;

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
    isLoading.value = false;
  }
};

onMounted(() => {
  if (chatWindow.value) {
    // 初期位置を画面の右下あたりに設定する代わりに、画面内に確実に表示される位置に設定
    // 例: 画面の右下から20px、下から20pxの位置
    const initialRight = 20;
    const initialBottom = 20;

    // ウィンドウの幅と高さを取得 (paddingなどを含む実際の表示サイズ)
    const windowWidth = chatWindow.value.offsetWidth;
    const windowHeight = chatWindow.value.offsetHeight;

    // 画面の幅と高さを取得
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 計算されたleftとtopの位置
    let calculatedLeft = viewportWidth - windowWidth - initialRight;
    let calculatedTop = viewportHeight - windowHeight - initialBottom;

    // 負の値にならないように調整 (画面左上端に固定)
    if (calculatedLeft < 0) calculatedLeft = 0;
    if (calculatedTop < 0) calculatedTop = 0;

    chatWindow.value.style.left = `${calculatedLeft}px`;
    chatWindow.value.style.top = `${calculatedTop}px`;
  }
});
</script>

<template>
  <!-- 本番環境に埋め込むチャットボットウィンドウの開始 -->
  <div class="chat-container" ref="chatWindow">
    <div class="chat-header" @mousedown="startDrag">
      <h1>AI Chatbot</h1>
    </div>
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
.chat-container {
  position: fixed; /* 自由に動かすためにfixedに変更 */
  /* 初期位置はJavaScriptで設定するため、ここではleft/top/right/bottomを削除 */
  max-width: 350px; /* App.vueのfloating-chatbotのwidthに合わせる */
  max-height: 500px; /* App.vueのfloating-chatbotのmax-heightに合わせる */
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  background-color: white;
  z-index: 1000; /* 他の要素の上に表示 */
  resize: both; /* リサイズ可能にする */
  overflow: auto; /* リサイズ時にコンテンツがはみ出さないように */
}

.chat-header {
  cursor: grab; /* ドラッグ可能であることを示すカーソル */
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.chat-header h1 {
  text-align: center;
  color: #333;
  margin: 0; /* h1のデフォルトマージンをリセット */
}

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
