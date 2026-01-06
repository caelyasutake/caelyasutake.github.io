// Theme switch logic (plain JavaScript)
(function () {
  let isDark = document.documentElement.classList.contains("dark");

  function setTheme(dark) {
    isDark = dark;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  function toggleDark(event) {
    const isAppearanceTransition =
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setTheme(!isDark);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(async () => {
      setTheme(!isDark);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: "ease-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  }

  const btn = document.getElementById("themeSwitch");
  if (btn) btn.addEventListener("click", toggleDark);

  // Initialize theme: saved preference > system preference
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    setTheme(true);
  } else if (saved === "light") {
    setTheme(false);
  } else {
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  // Sync with system changes only if user hasn't chosen explicitly
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const saved = localStorage.getItem("theme");
      if (saved !== "dark" && saved !== "light") {
        setTheme(e.matches);
      }
    });
})();
