import { profile } from "./content.js";
import {
  formEndpoint,
  validateFeedback,
  emailDraft,
  submitFeedback,
} from "./feedback-core.js";

export function setupFeedback() {
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("feedback-status");
  const submit = document.getElementById("feedback-submit");
  const mode = document.getElementById("feedback-mode");
  const fallback = document.getElementById("email-fallback");
  const draftLink = document.getElementById("email-draft");
  const message = document.getElementById("message");
  const endpoint = formEndpoint(import.meta.env.VITE_FORMSPREE_FORM_ID);
  let sending = false,
    currentDraft = null;

  mode.textContent = endpoint
    ? "Your note is sent privately to Adit through Formspree. No account needed."
    : "The web mailbox is not connected yet. You can prepare a note here and send it through your email app.";
  const buttonText = endpoint ? "Send private note ↗" : "Continue in email ↗";
  submit.textContent = buttonText;
  function showStatus(text, state) {
    status.textContent = text;
    status.dataset.state = state;
  }
  function prepareFallback(data) {
    currentDraft = emailDraft(data, profile.email);
    draftLink.href = currentDraft.url;
    fallback.hidden = false;
  }
  message.addEventListener("input", () => {
    document.getElementById("message-count").textContent =
      `${message.value.length.toLocaleString()} / 3,000 characters (minimum 10)`;
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const result = validateFeedback(Object.fromEntries(new FormData(form)));
    if (result.error) {
      showStatus(result.error, "error");
      return;
    }
    if (!endpoint) {
      prepareFallback(result.data);
      showStatus("Draft prepared. Nothing has been sent yet.", "info");
      draftLink.focus();
      return;
    }
    sending = true;
    submit.disabled = true;
    submit.textContent = "Sending…";
    fallback.hidden = true;
    form.setAttribute("aria-busy", "true");
    showStatus("Sending your note…", "info");
    try {
      await submitFeedback(endpoint, result.data);
      form.reset();
      document.getElementById("message-count").textContent =
        "10–3,000 characters";
      currentDraft = null;
      showStatus(
        "Thanks! Your note has been delivered privately to Adit.",
        "success",
      );
    } catch (error) {
      showStatus(error.message, "error");
      prepareFallback(result.data);
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = buttonText;
      form.removeAttribute("aria-busy");
    }
  });
  document
    .getElementById("copy-feedback")
    .addEventListener("click", async () => {
      if (!currentDraft) return;
      try {
        await navigator.clipboard.writeText(currentDraft.body);
        showStatus("Message copied. Paste it into your email to Adit.", "info");
      } catch {
        showStatus(
          "Copy was unavailable. Select the text in the message field and copy it manually.",
          "error",
        );
      }
    });
}
