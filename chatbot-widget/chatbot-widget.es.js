import { ref as p, createElementBlock as l, openBlock as i, createElementVNode as n, createCommentVNode as v, Fragment as _, renderList as h, normalizeClass as m, toDisplayString as y, withDirectives as f, withKeys as w, vModelText as b } from "vue";
const g = (c, o) => {
  const t = c.__vccOpts || c;
  for (const [s, r] of o)
    t[s] = r;
  return t;
}, k = { class: "chat-container" }, x = { class: "message-list" }, I = {
  key: 0,
  class: "loading-message"
}, C = { class: "input-area" }, A = ["disabled"], E = ["disabled"], N = "https://black-mud-382d.corsicajp.workers.dev/", j = {
  __name: "ChatbotWindow",
  setup(c) {
    const o = p([]), t = p(""), s = p(!1), r = async () => {
      if (t.value.trim() === "") return;
      const d = t.value;
      o.value.push({ type: "user", text: d }), t.value = "", s.value = !0;
      try {
        const e = await fetch(N, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: d })
        });
        if (!e.ok) {
          const u = await e.json();
          throw new Error(`API Error: ${e.status} - ${u.error || "Unknown error"}`);
        }
        const a = await e.json();
        o.value.push({ type: "ai", text: a.answer });
      } catch (e) {
        console.error("Failed to fetch AI answer:", e), o.value.push({ type: "ai", text: "エラーが発生しました: " + e.message });
      } finally {
        s.value = !1;
      }
    };
    return (d, e) => (i(), l("div", k, [
      e[1] || (e[1] = n("h1", null, "AI Chatbot", -1)),
      n("div", x, [
        (i(!0), l(_, null, h(o.value, (a, u) => (i(), l("div", {
          key: u,
          class: m(["message", a.type])
        }, y(a.text), 3))), 128)),
        s.value ? (i(), l("div", I, "AIが思考中...")) : v("", !0)
      ]),
      n("div", C, [
        f(n("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (a) => t.value = a),
          onKeyup: w(r, ["enter"]),
          placeholder: "質問を入力してください...",
          disabled: s.value
        }, null, 40, A), [
          [b, t.value]
        ]),
        n("button", {
          onClick: r,
          disabled: s.value
        }, "送信", 8, E)
      ])
    ]));
  }
}, O = /* @__PURE__ */ g(j, [["__scopeId", "data-v-2bf4217d"]]);
export {
  O as default
};
