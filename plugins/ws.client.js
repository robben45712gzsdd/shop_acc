// plugins/ws.client.js
export default ({ store }, inject) => {
  let ws = null;

  const getToken = () =>
    store.state.token || store.state.user_data?.token || null;

  const connect = () => {
    const rawToken = getToken();
    const token = rawToken ? encodeURIComponent(rawToken) : "";
    let reconnectTimeout = null;
    const url =
      "wss://" +
      process.env.NUXT_ENV_BASE_WS +
      "/ws/main?access_token=" +
      token;
    ws = new WebSocket(url);

    ws.onopen = () => {
      // Gửi token lại 1 lần nữa khi socket mở — đảm bảo server nhận token
      const freshToken = getToken();
      if (freshToken) {
        ws.send(
          JSON.stringify({
            type: "AUTH",
            access_token: freshToken,
          })
        );
      }
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        window.dispatchEvent(new CustomEvent("ws-message", { detail: data }));
      } catch {}
    };

    ws.onclose = () => {
      console.log("WS disconnected. Reconnecting in 2s…");
      reconnectTimeout = setTimeout(connect, 2000);
    };

    ws.onerror = (e) => {
      console.log("WS error:", e);
      ws.close();
    };
  };

  connect();

  const send = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn("WS not ready");
    }
  };

  inject("ws", { send });
};
