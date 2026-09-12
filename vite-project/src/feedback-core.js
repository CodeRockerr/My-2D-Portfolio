const categories = new Set(["suggestion", "issue", "comment", "collaboration"]);

export function formEndpoint(id) {
  return /^[a-zA-Z0-9]{6,30}$/.test(id || "")
    ? `https://formspree.io/f/${id}`
    : null;
}

export function validateFeedback(values) {
  const message = String(values.message || "").trim();
  const name = String(values.name || "").trim();
  const email = String(values.email || "").trim();
  if (values._gotcha)
    return {
      error: "The form could not be submitted. Please email Adit directly.",
    };
  if (!categories.has(values.category))
    return { error: "Please select a valid message category." };
  if (message.length < 10 || message.length > 3000)
    return { error: "Please write a message between 10 and 3,000 characters." };
  if (name.length > 100)
    return { error: "Please keep your name under 100 characters." };
  if (
    email &&
    (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    return { error: "Please enter a valid email address, or leave it blank." };
  return { data: { category: values.category, message, name, email } };
}

export function emailDraft(data, recipient) {
  const body = `${data.message}\n\nCategory: ${data.category}${data.name ? `\nName: ${data.name}` : ""}${data.email ? `\nReply email: ${data.email}` : ""}`;
  return {
    body,
    url: `mailto:${recipient}?subject=${encodeURIComponent(`Portfolio ${data.category}`)}&body=${encodeURIComponent(body)}`,
  };
}

export async function submitFeedback(
  endpoint,
  data,
  { fetchFn = fetch, timeoutMs = 12000 } = {},
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...data,
        _subject: `Portfolio: ${data.category}`,
      }),
      signal: controller.signal,
    });
    // Preserve user-entered data on any failure; never report success for a rejected request.
    if (response.status === 429)
      throw new Error(
        "Too many attempts. Please wait a few minutes or send your note by email.",
      );
    if (!response.ok)
      throw new Error(
        "Your note could not be delivered. Please try again or send it by email.",
      );
    return true;
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error(
        "The connection timed out. Please try again or send your note by email.",
      );
    if (error instanceof TypeError)
      throw new Error(
        "Unable to connect. Your message is still here; you can retry or send it by email.",
      );
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
