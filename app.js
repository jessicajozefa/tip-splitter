let tips = JSON.parse(localStorage.getItem("tips") || "[]");

function addTip() {
  const val = parseFloat(document.getElementById("amount").value);

  if (!val) return;

  tips.push({
    amount: val,
    time: new Date().toISOString()
  });

  localStorage.setItem("tips", JSON.stringify(tips));

  document.getElementById("amount").value = "";

  update();
}

function update() {
  let html = "";

  for (let t of tips) {
    html += `
      <div>
        <b>$${t.amount.toFixed(2)}</b>
      </div>
    `;
  }

  document.getElementById("result").innerHTML =
    html || "No entries yet";
}

update();
