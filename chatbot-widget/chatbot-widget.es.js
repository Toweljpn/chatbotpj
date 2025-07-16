import { ref as s, onMounted as D, createElementBlock as c, openBlock as v, createElementVNode as u, createCommentVNode as I, Fragment as L, renderList as M, normalizeClass as A, toDisplayString as N, withDirectives as S, withKeys as X, vModelText as Y, defineComponent as j } from "vue";
const F = (p, r) => {
  const a = p.__vccOpts || p;
  for (const [l, t] of r)
    a[l] = t;
  return a;
}, H = { class: "message-list" }, O = {
  key: 0,
  class: "loading-message"
}, P = { class: "input-area" }, T = ["disabled"], $ = ["disabled"], V = "https://black-mud-382d.corsicajp.workers.dev/", B = {
  __name: "ChatbotWindow",
  setup(p) {
    const r = s([]), a = s(""), l = s(!1), t = s(null), w = s(!1), h = s(0), f = s(0), m = s(0), y = s(0), C = (o) => {
      w.value = !0, h.value = o.clientX, f.value = o.clientY;
      const e = window.getComputedStyle(t.value);
      m.value = parseFloat(e.left), y.value = parseFloat(e.top), window.addEventListener("mousemove", g), window.addEventListener("mouseup", _);
    }, g = (o) => {
      if (!w.value) return;
      const e = o.clientX - h.value, i = o.clientY - f.value;
      let n = m.value + e, d = y.value + i;
      const x = t.value.offsetWidth, k = t.value.offsetHeight, W = window.innerWidth, E = window.innerHeight;
      n < 0 && (n = 0), d < 0 && (d = 0), n + x > W && (n = W - x), d + k > E && (d = E - k), t.value.style.left = `${n}px`, t.value.style.top = `${d}px`;
    }, _ = () => {
      w.value = !1, window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", _);
    }, b = async () => {
      if (a.value.trim() === "") return;
      const o = a.value;
      r.value.push({ type: "user", text: o }), a.value = "", l.value = !0;
      try {
        const e = await fetch(V, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: o })
        });
        if (!e.ok) {
          const n = await e.json();
          throw new Error(`API Error: ${e.status} - ${n.error || "Unknown error"}`);
        }
        const i = await e.json();
        r.value.push({ type: "ai", text: i.answer });
      } catch (e) {
        console.error("Failed to fetch AI answer:", e), r.value.push({ type: "ai", text: "エラーが発生しました: " + e.message });
      } finally {
        l.value = !1;
      }
    };
    return D(() => {
      t.value && (t.value.style.left = "50px", t.value.style.top = "50px");
    }), (o, e) => (v(), c("div", {
      class: "chat-container",
      ref_key: "chatWindow",
      ref: t
    }, [
      u("div", {
        class: "chat-header",
        onMousedown: C
      }, e[1] || (e[1] = [
        u("h1", null, "AI Chatbot", -1)
      ]), 32),
      u("div", H, [
        (v(!0), c(L, null, M(r.value, (i, n) => (v(), c("div", {
          key: n,
          class: A(["message", i.type])
        }, N(i.text), 3))), 128)),
        l.value ? (v(), c("div", O, "AIが思考中...")) : I("", !0)
      ]),
      u("div", P, [
        S(u("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (i) => a.value = i),
          onKeyup: X(b, ["enter"]),
          placeholder: "質問を入力してください...",
          disabled: l.value
        }, null, 40, T), [
          [Y, a.value]
        ]),
        u("button", {
          onClick: b,
          disabled: l.value
        }, "送信", 8, $)
      ])
    ], 512));
  }
}, K = /* @__PURE__ */ F(B, [["__scopeId", "data-v-aabab572"]]), q = j(K);
export {
  q as default
};
