
    function toNum(id) {
      const v = parseFloat(document.getElementById(id).value);
      return isNaN(v) ? 0 : v;
    }

    function formatMoney(num) {
      return num.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
    }

    function autoSetBrokerage(quantity) {
      // 1 lot = 75 qty, 1 lot brokerage = 20
      if (quantity <= 0) {
        document.getElementById('brokeragePerOrder').value = 0;
        return 0;
      }
      const lots = quantity / 75;           // exact lots (75,150,300 ...)
      const brokeragePer = lots * 20;      // per order
      document.getElementById('brokeragePerOrder').value = brokeragePer.toFixed(2);
      return brokeragePer;
    }

    function calculate() {
      const buyPremium    = toNum('buyPremium');
      const sellPremium   = toNum('sellPremium');
      const quantity      = toNum('quantity');

      if (quantity <= 0) {
        alert('Quantity (Lot Size) 0 se bada hona chahiye.');
        return;
      }

      // brokerage auto from qty
      const brokeragePer  = autoSetBrokerage(quantity);

      const sttRate       = toNum('sttRate');
      const exchRate      = toNum('exchRate');
      const sebiPerCrore  = toNum('sebiPerCrore');
      const gstRate       = toNum('gstRate');
      const stampRate     = toNum('stampRate');

      // 1) Turnover
      const buyTurnover  = buyPremium * quantity;
      const sellTurnover = sellPremium * quantity;

      // 2) Gross Profit/Loss
      const grossPL = (sellPremium - buyPremium) * quantity;

      // 3) Charges
      const totalBrokerage = 2 * brokeragePer; // Buy + Sell

      const stt = (sttRate / 100) * sellTurnover;

      const exchCharges = (exchRate / 100) * (buyTurnover + sellTurnover);

      // SEBI fee per crore (1 crore = 10,000,000)
      const sebiFees = (sebiPerCrore / 100000000) * (buyTurnover + sellTurnover);

      const stampDuty = (stampRate / 100) * buyTurnover;

      const gstBase = totalBrokerage + exchCharges + sebiFees;
      const gstValue = (gstRate / 100) * gstBase;

      const totalCharges = totalBrokerage + stt + exchCharges + sebiFees + stampDuty + gstValue;

      const netProfit = grossPL - totalCharges;

      // Update UI
      document.getElementById('buyTurnover').textContent  = '₹ ' + formatMoney(buyTurnover);
      document.getElementById('sellTurnover').textContent = '₹ ' + formatMoney(sellTurnover);
      document.getElementById('grossPL').textContent      = '₹ ' + formatMoney(grossPL);
      document.getElementById('totalBrokerage').textContent = '₹ ' + formatMoney(totalBrokerage);
      document.getElementById('sttValue').textContent       = '₹ ' + formatMoney(stt);
      document.getElementById('exchCharges').textContent    = '₹ ' + formatMoney(exchCharges);
      document.getElementById('sebiFees').textContent       = '₹ ' + formatMoney(sebiFees);
      document.getElementById('stampDuty').textContent      = '₹ ' + formatMoney(stampDuty);
      document.getElementById('gstValue').textContent       = '₹ ' + formatMoney(gstValue);
      document.getElementById('totalCharges').textContent   = '₹ ' + formatMoney(totalCharges);

      const netEl = document.getElementById('netProfit');
      netEl.textContent = '₹ ' + formatMoney(netProfit);
      netEl.classList.remove('positive', 'negative', 'muted');
      if (netProfit > 0) {
        netEl.classList.add('positive');
      } else if (netProfit < 0) {
        netEl.classList.add('negative');
      } else {
        netEl.classList.add('muted');
      }
    }

    function resetDefaults() {
      document.getElementById('buyPremium').value       = 0;
      document.getElementById('sellPremium').value      = 0;
      document.getElementById('quantity').value         = 75;
      document.getElementById('sttRate').value          = 0.05;
      document.getElementById('exchRate').value         = 0.0035;
      document.getElementById('sebiPerCrore').value     = 10;
      document.getElementById('gstRate').value          = 18;
      document.getElementById('stampRate').value        = 0.003;
      autoSetBrokerage(75);
      calculate();
    }

    // Auto-calc on load and on input change:
    window.addEventListener('load', () => {
      resetDefaults();
      document.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => {
          calculate();
        });
      });
    });