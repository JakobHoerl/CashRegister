let price = (Math.random() * 50).toFixed(2);
const cid = [
  ["EIN-CENT", 0.89],
  ["ZWEI-CENT", 0.3],
  ["FÜNF-CENT", 0.8],
  ["ZEHN-CENT", 43],
  ["ZWANZIG-CENT", 2],
  ["FÜNZIG-CENT", 21],
  ["EIN-EURO", 77],
  ["ZWEI-EURO", 12],
  ["FÜNF-EURO", 25],
  ["ZEHN-EURO", 30],
  ["ZWANZIG-EURO", 0],
  ["FÜNZIG-EURO", 50],
  ["EIN-HUNDERT", 100],
  ["ZWEI-HUNDERT", 400],
];
const values = {
  "EIN-CENT": 1,
  "ZWEI-CENT": 2,
  "FÜNF-CENT": 5,
  "ZEHN-CENT": 10,
  "ZWANZIG-CENT": 20,
  "FÜNZIG-CENT": 50,
  "EIN-EURO": 100,
  "ZWEI-EURO": 200,
  "FÜNF-EURO": 500,
  "ZEHN-EURO": 1000,
  "ZWANZIG-EURO": 2000,
  "FÜNZIG-EURO": 5000,
  "EIN-HUNDERT": 10000,
  "ZWEI-HUNDERT": 20000,
};

const cash = document.getElementById("cash");
const button = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const währung = document.querySelectorAll(".Währung");
const summe = document.querySelectorAll(".Summe");
const priceText = document.getElementById("price");
const cashBtn = document.getElementById("cash-btn");
const numberBtn = document.querySelectorAll(".number");
const clearBtn = document.getElementById("clear");
const backSpace = document.getElementById("back-space");
const debitCard = document.getElementById("debit-card");
const paymentCompleted = document.getElementById("pay-completed");

let displayChange = "";
let ongoingPayment = false;

const toggleChange = () => {
  priceText.innerText = `Wechselgeld: ${displayChange.toFixed(2)}€`;
};
const checkIfOngoing = () => {
  if (ongoingPayment) {
    alert(
      "Schließen sie die derzeitige Transaktion ab, bevor sie einen neuen Betrag eingeben."
    );
    return;
  }
};

const togglePrice = () => {
  priceText.innerText = `Gesamt: ${price}€`;
};

const checkRemainder = (change, arr) => {
  const dupArr = [...arr];
  let remainingChange = change;

  for (let i = 0; i < dupArr.length; i++) {
    let multipliedArr = dupArr[i][1] * 100;
    const value = values[dupArr[i][0]];

    while (remainingChange >= value && multipliedArr > 0) {
      remainingChange -= value;
      multipliedArr -= value;
    }
  }
  return remainingChange > 0;
};

const displaySheet = () => {
  for (let i = 0; i < cid.length; i++) {
    währung[i].innerText = `${cid[i][0]}: `;

    summe[i].innerText = `${cid[i][1].toFixed(2)}€`;
  }
};
const totalSum = (arr) => {
  const mappedArr = arr.map((element) => element[1]);
  return mappedArr.reduce((acc, el) => acc + el);
};

const calculateReturn = (cid, vals, price) => {
  const result = [];

  let highChange = Math.round(Number(cash.value) * 100 - price * 100);

  let reversedArr = [...cid].reverse();
  const summeReversed = [...summe].reverse();

  if (checkRemainder(highChange, reversedArr)) {
    changeDue.innerHTML = `<p class="return header">Wechselgeld kann nicht genau ausgegeben werden.</p>`;
    paymentCompleted.classList.add("light-blue");
    ongoingPayment = true;

    return;
  }

  for (let i = 0; i < reversedArr.length; i++) {
    reversedArr[i][1] = reversedArr[i][1] * 100;
    let moneyHolder = [reversedArr[i][0], 0];

    while (highChange >= vals[reversedArr[i][0]] && reversedArr[i][1] > 0) {
      highChange -= vals[reversedArr[i][0]];

      reversedArr[i][1] -= vals[reversedArr[i][0]];
      if (reversedArr[i][1] <= 0) {
        reversedArr[i][1] = 0;
      }
      summeReversed[i].innerText = summeReversed[i].innerText.replace(/€/g, "");

      summeReversed[i].innerText = (
        Number(summeReversed[i].innerText) -
        vals[reversedArr[i][0]] / 100
      ).toFixed(2);
      if (Number(summeReversed[i].innerText) < 0) {
        summeReversed[i].innerText = 0 + "";
      }
      summeReversed[i].innerText = summeReversed[i].innerText + "€";
      moneyHolder[1] += vals[reversedArr[i][0]] / 100;
    }
    reversedArr[i][1] = reversedArr[i][1] / 100;

    if (moneyHolder[1] > 0) {
      result.push(moneyHolder);
    }
  }
  changeDue.innerHTML = `<p class="return header">KASSA: Offen</p>`;
  result.forEach((el) => {
    changeDue.innerHTML += `<p class="return">${el[0]}: €${el[1].toFixed(
      2
    )} (${Math.round(el[1] / (values[el[0]] / 100))})</p>`;
  });
  paymentCompleted.classList.add("light-blue");
  ongoingPayment = true;
  toggleChange();
};

const displayText = () => {
  const closedArr = cid.slice(0, 4).reverse();
  const total = totalSum(cid);
  let change = Number(cash.value) - price;
  price = Number(price);
  displayChange = change;

  const cashValue = Number(cash.value);
  if (cashValue < price) {
    cash.value = "";
    alert("Kundengeld ist zu wenig.");
    return;
  } else if (cashValue === price) {
    changeDue.innerHTML = `<p class="return header">Kein Wechselgeld nötig, Kunde hat genau bezahlt.</p>`;
    toggleChange();
    paymentCompleted.classList.add("light-blue");
    ongoingPayment = true;
    return;
  } else if (parseInt(change) > parseInt(total)) {
    console.log(parseInt(change), parseInt(total));
    changeDue.innerHTML = `<p class="return header">In der Kassa befindet sich zu wenig Geld.</p>`;
    return;
  } else if (change === total) {
    if (changeDue.innerHTML) {
      changeDue.innerHTML += `<p class="return header" >KASSA: Offen</p>`;
    }
    closedArr.forEach((el) => {
      changeDue.innerHTML += `<p>${el[0]}: $${el[1]}</p>`;
    });
    toggleChange();
    paymentCompleted.classList.add("light-blue");
    ongoingPayment = true;

    return;
  } else {
    calculateReturn(cid, values, price);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  displaySheet();
  togglePrice();
  cash.value = "";
});
cashBtn.addEventListener("click", () => {
  if (ongoingPayment) {
    alert(
      "Schließen sie die derzeitige Transaktion ab, bevor sie einen neuen Betrag eingeben."
    );
    return;
  }
  if (!cash.value) {
    alert("Bitte geben Sie das Geld des Kunden ein");
    return;
  }

  displayText();
  cash.value = "";
});

numberBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (ongoingPayment) {
      alert(
        "Schließen sie die derzeitige Transaktion ab, bevor sie einen neuen Betrag eingeben."
      );
      cash.value = "";
      return;
    }
    if (cash.value.includes(".")) {
      const afterDecimal = cash.value.split(".")[1].length;
      if (btn.innerText === "." || afterDecimal >= 2) {
        return;
      }
    }
    cash.value += btn.innerText;
  });
});

clearBtn.addEventListener("click", () => {
  cash.value = "";
});

backSpace.addEventListener("click", () => {
  cash.value = cash.value.slice(0, cash.value.length - 1);
});

debitCard.addEventListener("click", () => {
  cash.value = "";
  if (ongoingPayment) {
    alert(
      "Schließen sie die derzeitige Transaktion ab, bevor sie einen neuen Betrag eingeben."
    );
    return;
  }
  ongoingPayment = true;
  paymentCompleted.classList.add("light-blue");
  changeDue.innerHTML = `<p class="return header">Kartenzahlung.</p>`;
});

paymentCompleted.addEventListener("click", (e) => {
  if (!e.target.classList.contains("light-blue")) {
    alert("Es ist keine Zahlung ausstehend.");
    return;
  }

  paymentCompleted.classList.remove("light-blue");
  changeDue.innerHTML = "";
  price = (Math.random() * 50).toFixed(2);
  togglePrice();
  ongoingPayment = false;
});
