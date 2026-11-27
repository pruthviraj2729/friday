const API_URL = "/api/v1/conversation";

async function readJson(response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong. Please try again.");
  }
  return result.data;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export async function fetchConversations(token) {
  const response = await fetch(API_URL, {
    headers: authHeaders(token)
  });
  const data = await readJson(response);
  return data.conversations;
}

export async function fetchMessages(token, conversationId, signal) {
  const response = await fetch(`${API_URL}/messages/${conversationId}`, {
    headers: authHeaders(token),
    signal
  });
  const data = await readJson(response);
  return data.messages;
}

export async function streamMessage(token, { content, conversationId }, onEvent) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      Accept: "text/event-stream"
    },
    body: JSON.stringify({
      content,
      ...(conversationId ? { conversation: conversationId } : {})
    })
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Friday couldn't send your message.");
  }
  if (!response.body) throw new Error("Streaming is not supported by this browser.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  function dispatchEvents() {
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() || "";

    for (const event of events) {
      const data = event
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (data) onEvent(JSON.parse(data));
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      dispatchEvents();
      if (done) break;
    }

    if (buffer.trim()) {
      const data = buffer
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (data) onEvent(JSON.parse(data));
    }
  } finally {
    reader.releaseLock();
  }
}
