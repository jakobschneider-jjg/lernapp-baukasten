/* ==========================================================================
   Baukasten: Start – Knöpfe verdrahten, dann LearningView/Gerät laden
   ========================================================================== */
(function boot() {
  document.title = APP.title;
  $("loadHero").innerHTML = APP.hero ? APP.hero() : "";
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));
  document.querySelectorAll(".iconbtn[data-go], #taskBack, #codeBack").forEach(b => b.innerHTML = ICON.back);
  document.querySelectorAll(".starcount .st").forEach(s => s.innerHTML = ICON.star);
  document.querySelectorAll(".lockbig").forEach(s => s.innerHTML = ICON.lock);
  $("doneNext").innerHTML = "Weiter " + ICON.next;
  $("taskBack").onclick = () => { clearTimeout(M && M.wt); go("map"); };
  $("codeBack").onclick = () => go("map");
  $("codeClear").onclick = () => { codeIn = []; renderCode(); };
  $("lvRefresh").addEventListener("click", requestClass);
  $("ki").textContent = APP.credit || "mit KI erstellt";
  $("lvTitle").textContent = APP.title + " · Klassenübersicht";
  fxInit(); computeSizes(); buildTeacher(); boardInit(); lvInit();
})();
