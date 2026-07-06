const CAPS = {
  insurance: 622,
  tax: 600,
  amex: 2000,
  rent: 1500,
  ira: 200
};
let tips = JSON.parse(localStorage.getItem("tips") || "[]");

function addTip() {
  const input = document.getElementById("amount");
  const val = parseFloat(input.value);

  if (isNaN(val)) return;

  const entry = {
    amount: val,
    insurance: val * 0.12,
    tax: val * 0.12,
    amex: val * 0.40,
    rent: val * 0.30,
    ira: val * 0.04,
    spain: val * 0.02,
    time: new Date().toISOString()
  };

  tips.push(entry);
  localStorage.setItem("tips", JSON.stringify(tips));

  input.value = "";
  update();
  function renderProgress() {
  const totals = getMonthTotals();

  const bars = {
    insurance: "Insurance",
    tax: "Taxes",
    amex: "Amex",
    rent: "Rent",
    ira: "IRA"
  };
renderProgress();
  let html = "";

  for (let key in bars) {
    let pct = Math.min(100, (totals[key] / CAPS[key]) * 100);

    html += `
      <div style="margin-bottom:10px;">
        <div>${bars[key]} - $${totals[key].toFixed(2)} / $${CAPS[key]}</div>
        <div style="background:#eee; height:10px; border-radius:5px;">
          <div style="width:${pct}%; height:10px; background:black; border-radius:5px;"></div>
        </div>
      </div>
    `;
  }

  document.getElementById("progress").innerHTML = html;
}
}

function update() {
  const total = tips.reduce((s, t) => s + t.amount, 0);

  let html = "";

  tips.slice().reverse().forEach(t => {
    html += `
      <div style="padding:10px; border-bottom:1px solid #eee;">
        <b>$${t.amount.toFixed(2)}</b><br/>
        <small>
          Insurance: $${t.insurance.toFixed(2)} |
          Taxes: $${t.tax.toFixed(2)} |
          Amex: $${t.amex.toFixed(2)} |
          Rent: $${t.rent.toFixed(2)} |
          IRA: $${t.ira.toFixed(2)} |
          Spain: $${t.spain.toFixed(2)}
        </small>
      </div>
    `;
  });

  document.getElementById("result").innerHTML = `
    <h2>Total: $${total.toFixed(2)}</h2>
    <hr/>
    ${html || "No entries yet"}
  `;
}

function init() {
  document.getElementById("saveBtn").addEventListener("click", addTip);
  update();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

update();
function bind() {
  const btn = document.getElementById("saveBtn");

  if (!btn) {
    console.error("Save button not found");
    return;
  }

  btn.onclick = addTip;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bind);
} else {
  bind();
}
document.getElementById("resetMonth").onclick = () => {
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();

  tips = tips.filter(t => {
    let d = new Date(t.time);
    return !(d.getMonth() === m && d.getFullYear() === y);
  });

  localStorage.setItem("tips", JSON.stringify(tips));
  update();
};

document.getElementById("resetAll").onclick = () => {
  tips = [];
  localStorage.removeItem("tips");
  update();
};
function bindResetButtons() {
  const monthBtn = document.getElementById("resetMonth");
  const allBtn = document.getElementById("resetAll");

  if (monthBtn) {
    monthBtn.addEventListener("click", () => {
      const now = new Date();
      const m = now.getMonth();
      const y = now.getFullYear();

      tips = tips.filter(t => {
        const d = new Date(t.time);
        return !(d.getMonth() === m && d.getFullYear() === y);
      });

      localStorage.setItem("tips", JSON.stringify(tips));
      update();
    });
  }

  if (allBtn) {
    allBtn.addEventListener("click", () => {
      tips = [];
      localStorage.removeItem("tips");
      update();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindResetButtons);
} else {
  bindResetButtons();
}
function renderProgress() {
  const totals = getMonthTotals();

  const caps = {
    insurance: 622,
    tax: 600,
    amex: 2000,
    rent: 1500,
    ira: 200
  };

  const labels = {
    insurance: "Insurance",
    tax: "Taxes",
    amex: "Amex",
    rent: "Rent",
    ira: "IRA"
  };

  let html = "";

  for (let key in caps) {
    const used = totals[key] || 0;
    const pct = Math.min(100, (used / caps[key]) * 100);

    let color = "black";
    if (pct > 80) color = "orange";
    if (pct > 95) color = "red";

    html += `
      <div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between;">
          <strong>${labels[key]}</strong>
          <span>$${used.toFixed(2)} / $${caps[key]}</span>
        </div>

        <div style="background:#eee; height:12px; border-radius:6px; overflow:hidden;">
          <div style="
            width:${pct}%;
            height:12px;
            background:${color};
            transition: width 0.4s ease;
          "></div>
        </div>
      </div>
    `;
  }

  document.getElementById("progress").innerHTML = html;
}
renderProgress();
