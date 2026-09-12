document.body.classList.remove("no-js");

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
const closeMenu = () => {
  menu?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
};
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menu?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

function setupContentInteractions(scope = document) {
  scope.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".contact-primary");
      const address = card.querySelector(".direct-email").textContent;
      const status = card.querySelector(".copy-email-status");
      try {
        await navigator.clipboard.writeText(address);
        status.textContent =
          "Email address copied. Paste it into your preferred email app.";
      } catch {
        status.textContent = `Copy this address: ${address}`;
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(card.querySelector(".direct-email"));
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  });
  scope.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visible = 0;
      scope
        .querySelectorAll("[data-filter]")
        .forEach((other) =>
          other.setAttribute("aria-pressed", String(other === button)),
        );
      scope.querySelectorAll(".project-card").forEach((card) => {
        card.hidden =
          filter !== "All projects" && card.dataset.category !== filter;
        if (!card.hidden) visible++;
      });
      scope.querySelector("#filter-status").textContent =
        `${visible} ${visible === 1 ? "project" : "projects"} shown.`;
    });
  });
  scope.querySelectorAll("[data-project]").forEach((button) => {
    const dialog = document.getElementById(`project-${button.dataset.project}`);
    button.addEventListener("click", () => {
      dialog._opener = button;
      dialog.showModal();
    });
    if (dialog.dataset.bound) return;
    dialog.dataset.bound = "true";
    dialog
      .querySelector(".dialog-close")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        dialog.close();
    });
    dialog.addEventListener(
      "close",
      () =>
        dialog._opener?.isConnected &&
        dialog._opener.focus({ preventScroll: true }),
    );
  });
}

if (document.body.dataset.page === "feedback") {
  import("./feedback.js").then(({ setupFeedback }) => setupFeedback());
}

if (document.body.dataset.page === "aequitas") {
  import("./feature-lab.js").then(({ setupFeatureLab }) => setupFeatureLab());
}

if (document.body.dataset.page === "overview") {
  import("./studio.js").then(({ setupStudio }) => setupStudio());
  setupContentInteractions();
}
if (["contact", "achievements"].includes(document.body.dataset.page))
  setupContentInteractions();
if (document.body.dataset.page === "home") {
  import("./game.js")
    .then(({ setupGame }) =>
      setupGame({
        onPanelOpen(id, scope) {
          setupContentInteractions(scope);
          if (id === "feedback")
            import("./feedback.js").then(({ setupFeedback }) => {
              if (document.getElementById("feedback-form")) setupFeedback();
            });
          if (id === "aequitas")
            import("./feature-lab.js").then(({ setupFeatureLab }) =>
              setupFeatureLab(),
            );
        },
      }),
    )
    .catch((error) => {
      console.error("Unable to initialize the game", error);
      const welcome = document.querySelector(".game-welcome");
      welcome.dataset.error = "true";
      welcome.hidden = false;
      welcome.querySelector("h2").textContent = "The game could not start.";
      welcome.querySelector("p").textContent =
        "Use Read portfolio to explore all my work.";
    });
}
