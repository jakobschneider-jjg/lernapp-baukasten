/* ==========================================================================
   Baukasten: Tafel-Modus „Klasse gegen Lehrkraft“ (digitale Tafel)
   APP.board = { stapelId: { label, cards: () => [{ html, reveal }] } }
   - html: was gezeigt wird; reveal: Lösung (erscheint erst nach „Lösung zeigen“)
   - Punkte nur in sessionStorage (verschwinden beim Schließen des Tabs)
   ========================================================================== */
let BD = { deck: null, cards: [], i: 0, k: 0, l: 0 };
const BOARD_KEY = () => STORE_KEY() + "-tafel";
function boardInit() {
  const ids = Object.keys(APP.board || {});
  if (!ids.length) { $("toBoard").hidden = true; if ($("lvBoard")) $("lvBoard").hidden = true; return; }
  BD.deck = ids[0];
  try { const r = sessionStorage.getItem(BOARD_KEY()); if (r) { const o = JSON.parse(r); if (APP.board[o.deck]) BD.deck = o.deck; BD.k = o.k | 0; BD.l = o.l | 0; } } catch (e) { }
  $("bReveal").onclick = () => { const r = $("reveal"); if (r) r.classList.add("on"); };
  $("bNext").onclick = () => { BD.i++; if (BD.i >= BD.cards.length) { BD.cards = APP.board[BD.deck].cards(); BD.i = 0; } renderCard(); };
  $("bK").onclick = () => { BD.k++; saveBoard(); $("sK").textContent = BD.k; burst($("sK")); };
  $("bL").onclick = () => { BD.l++; saveBoard(); $("sL").textContent = BD.l; };
  $("bReset").onclick = () => { BD.k = 0; BD.l = 0; saveBoard(); renderCard(); };
  const open = () => { go("board"); renderDecks(); renderCard(); };
  $("toBoard").onclick = open; if ($("lvBoard")) $("lvBoard").onclick = open;
}
function saveBoard() { try { sessionStorage.setItem(BOARD_KEY(), JSON.stringify({ deck: BD.deck, k: BD.k, l: BD.l })); } catch (e) { } }
function renderDecks() {
  $("decks").innerHTML = Object.entries(APP.board).map(([k, d]) => '<button class="deck ' + (k === BD.deck ? "on" : "") + '" data-d="' + k + '">' + d.label + '</button>').join("");
  $("decks").querySelectorAll(".deck").forEach(b => b.onclick = () => { BD.deck = b.dataset.d; BD.cards = APP.board[BD.deck].cards(); BD.i = 0; saveBoard(); renderDecks(); renderCard(); });
}
function renderCard() {
  if (!BD.cards.length) BD.cards = APP.board[BD.deck].cards();
  const c = BD.cards[BD.i % BD.cards.length];
  $("bshow").innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%">' + c.html
    + (c.reveal ? '<div class="reveal" id="reveal">' + c.reveal + '</div>' : "") + '</div>';
  $("bReveal").hidden = !c.reveal;
  $("sK").textContent = BD.k; $("sL").textContent = BD.l;
}
