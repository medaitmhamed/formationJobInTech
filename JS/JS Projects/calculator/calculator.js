// -------------------
// les variables li 4an5dmo bihom 
// -------------------
const state = {
  current: "0",       // la valeur li 3andna daba
  previous: null,     // la valeur li kant 9bel
  operator: null,     // l'opérateur li clickina 3lih
  overwrite: false,   // ila kan had variable true ghanbdaw nktbo nombre jdid
};

let history = [];

// -------------------
// DOM Elements
// -------------------
const displayEl = document.getElementById("display");
const keysEl = document.getElementById("keys");
const historyEl = document.getElementById("his");

// -------------------
// fonction li kat7seb kata5d a w b w l'opérateur w katrj3 resultat
// -------------------
function operate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default:  return b;
  }
}

// -------------------
// Display & History
// -------------------
function updateDisplay() {
  displayEl.textContent =
    state.current.length > 12
      ? Number(state.current).toExponential(6)  // ila kan numero kbir bzaaf kanrdoh b l'ecriteur scientifique
      : state.current;
}

function updateHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyEl.appendChild(li);
}

function clearHistory() {
  history = [];
  historyEl.innerHTML = "";
}

// -------------------
// Handlers
// -------------------

// fach nklicki 3la numero wach ghankteb numero jdid ola ghankmlo l numero li kayn
function inputDigit(digit) {
  if (state.overwrite || state.current === "0") {
    state.current = digit;
    state.overwrite = false;
  } else {
    state.current += digit;
  }
  updateDisplay();
}


// bach mankboch virgule 2 mrrat
function inputDecimal() {
  if (!state.current.includes(".")) {
    state.current += ".";
    updateDisplay();
  }
}


function setOperator(op) {
  if (state.operator && !state.overwrite) {
    compute();
  }
  state.previous = state.current;
  state.operator = op;
  state.overwrite = true;
}

function compute() {
  if (!state.operator || state.previous === null) return;

  const result = operate(state.previous, state.current, state.operator);
  const entry = `${state.previous} ${state.operator} ${state.current} = ${result}`;

  state.current = String(result);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;

  history.push(entry);
  updateHistory(entry);
  updateDisplay();
}

function handleCommand(cmd) {
  switch (cmd) {
    case "AC": // Tout réinitialiser
      Object.assign(state, { current: "0", previous: null, operator: null, overwrite: false });
      clearHistory();
      break;
    case "CE": // Effacer juste la valeur actuelle
      state.current = "0";
      state.overwrite = false;
      break;
    case "neg": // Inverser le signe
      state.current = state.current.startsWith("-")
        ? state.current.slice(1)
        : "-" + state.current;
      break;
    case "pct": // Pourcentage
      state.current = (parseFloat(state.current) / 100).toString();
      break;
  }
  updateDisplay();
}

// -------------------
// Events
// -------------------
keysEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const { type, value } = btn.dataset;

  if (type === "digit") return value === "." ? inputDecimal() : inputDigit(value);
  if (type === "op")    return setOperator(value);
  if (type === "eq")    return compute();
  if (type === "cmd")   return handleCommand(value);
});

// Keyboard Support
document.addEventListener("keydown", (e) => {
  if (/\d/.test(e.key)) inputDigit(e.key);
  if (e.key === ".") inputDecimal();
  if (["+", "-", "*", "/"].includes(e.key)) setOperator(e.key);
  if (e.key === "Enter") compute();
  if (e.key === "Backspace") handleCommand("CE");
  if (e.key === "Escape") handleCommand("AC");
});

