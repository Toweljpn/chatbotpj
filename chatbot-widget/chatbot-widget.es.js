import { ref as s, onMounted as D, createElementBlock as c, openBlock as v, createElementVNode as d, createCommentVNode as I, Fragment as $, renderList as L, normalizeClass as M, toDisplayString as X, withDirectives as Y, withKeys as A, vModelText as N, defineComponent as S } from "vue";
const j = (p, r) => {
  const a = p.__vccOpts || p;
  for (const [i, t] of r)
    a[i] = t;
  return a;
}, F = { class: "message-list" }, H = {
  key: 0,
  class: "loading-message"
}, O = { class: "input-area" }, P = ["disabled"], T = ["disabled"], V = "https://black-mud-382d.corsicajp.workers.dev/", B = {
  __name: "ChatbotWindow",
  setup(p) {
    const r = s([]), a = s(""), i = s(!1), t = s(null), w = s(!1), f = s(0), h = s(0), m = s(0), y = s(0), E = (n) => {
      w.value = !0, f.value = n.clientX, h.value = n.clientY;
      const e = window.getComputedStyle(t.value);
      m.value = parseFloat(e.left), y.value = parseFloat(e.top), window.addEventListener("mousemove", g), window.addEventListener("mouseup", _);
    }, g = (n) => {
      if (!w.value) return;
      const e = n.clientX - f.value, l = n.clientY - h.value;
      let o = m.value + e, u = y.value + l;
      const b = t.value.offsetWidth, k = t.value.offsetHeight, W = window.innerWidth, C = window.innerHeight;
      o < 0 && (o = 0), u < 0 && (u = 0), o + b > W && (o = W - b), u + k > C && (u = C - k), t.value.style.left = `${o}px`, t.value.style.top = `${u}px`, console.log(`Dragging: newX=${o}, newY=${u}, style.left=${t.value.style.left}, style.top=${t.value.style.top}`);
    }, _ = () => {
      w.value = !1, window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", _);
    }, x = async () => {
      if (a.value.trim() === "") return;
      const n = a.value;
      r.value.push({ type: "user", text: n }), a.value = "", i.value = !0;
      try {
        const e = await fetch(V, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: n })
        });
        if (!e.ok) {
          const o = await e.json();
          throw new Error(`API Error: ${e.status} - ${o.error || "Unknown error"}`);
        }
        const l = await e.json();
        r.value.push({ type: "ai", text: l.answer });
      } catch (e) {
        console.error("Failed to fetch AI answer:", e), r.value.push({ type: "ai", text: "エラーが発生しました: " + e.message });
      } finally {
        i.value = !1;
      }
    };
    return D(() => {
      t.value && (console.log("Chat window element:", t.value), t.value.style.left = "50px", t.value.style.top = "50px");
    }), (n, e) => (v(), c("div", {
      class: "chat-container",
      ref_key: "chatWindow",
      ref: t
    }, [
      d("div", {
        class: "chat-header",
        onMousedown: E
      }, e[1] || (e[1] = [
        d("h1", null, "AI Chatbot", -1)
      ]), 32),
      d("div", F, [
        (v(!0), c($, null, L(r.value, (l, o) => (v(), c("div", {
          key: o,
          class: M(["message", l.type])
        }, X(l.text), 3))), 128)),
        i.value ? (v(), c("div", H, "AIが思考中...")) : I("", !0)
      ]),
      d("div", O, [
        Y(d("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (l) => a.value = l),
          onKeyup: A(x, ["enter"]),
          placeholder: "質問を入力してください...",
          disabled: i.value
        }, null, 40, P), [
          [N, a.value]
        ]),
        d("button", {
          onClick: x,
          disabled: i.value
        }, "送信", 8, T)
      ])
    ], 512));
  }
}, K = /* @__PURE__ */ j(B, [["__scopeId", "data-v-fda0551a"]]), q = S(K);
export {
  q as default
};
