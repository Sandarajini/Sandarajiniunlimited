//  ------------------------------------------------------------
// Admin Dashboard Control Engine – Sandarajini Unlimited
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // 1. මුරපද පරීක්ෂාව (Admin Authentication)
  const adminPassword = "sandarajini2026"; // මෙතැනට ඔබේ රහස් මුරපදය ලියන්න
  
  if (sessionStorage.getItem('admin_authenticated') !== 'true') {
    const userInput = prompt("පරිපාලක මුරපදය ඇතුළත් කරන්න:");
    if (userInput === adminPassword) {
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      alert("අනවසර ප්‍රවේශයකි!");
      window.location.href = 'index1.html'; // මුරපදය වැරදි නම් මුල් පිටුවට යවයි
      return; 
    }
  }

  // Common Structural Element Selectors
  const statusForm = document.getElementById('statusForm');
  const vehicleSelect = document.getElementById('vehicleSelect');
  const statusInput = document.getElementById('statusInput');
  const coordsInput = document.getElementById('coordsInput');
  const logoutBtn = document.getElementById('logoutBtn');
  const mapIframe = document.querySelector('.map-wrapper iframe');
  const availableTripsList = document.getElementById('availableTripsList');
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const earningsDisplay = document.getElementById('earningsDisplay');
  const bus2EarningsPanel = document.getElementById('bus2EarningsPanel'); 
  const bus2DateSelector = document.getElementById('bus2DateSelector');
  const bus2DataForm = document.getElementById('bus2DataForm');
  const bus2DisplayDate = document.getElementById('bus2DisplayDate');

  let currentActiveVehicle = 'bus2';

  // ==========================================
  // LOCALSTORAGE DATABASE CONFIGURATION
  // ==========================================
  let fleetFinancialDatabase = JSON.parse(localStorage.getItem('sandarajini_financial_records')) || {
    bus1: {},
    bus2: {},
    van: {}
  };

  const todayStr = new Date().toISOString().split('T')[0];
  if (bus2DateSelector) {
    bus2DateSelector.value = todayStr;
  }

  // ==========================================
  // FINANCIAL DATA RENDERING CORE ENGINE
  // ==========================================
  function showFinancialDataForDate(vehicleKey, dateStr) {
    if (!bus2DisplayDate) return;
    
    const vehicleNames = { bus1: 'Bus 1', bus2: 'Bus 2', van: 'Van' };
    bus2DisplayDate.innerHTML = `<span style="color:#00eaff; font-weight:bold;">${vehicleNames[vehicleKey]}</span> Operations - Date: ${dateStr}`;
    
    const record = fleetFinancialDatabase[vehicleKey] ? fleetFinancialDatabase[vehicleKey][dateStr] : null;

    const lblConductor = document.getElementById('lblConductor');
    const inConductor = document.getElementById('inConductor');
    
    if (vehicleKey === 'van') {
      if (lblConductor) lblConductor.textContent = "N/A (No Conductor)";
      if (inConductor) {
        inConductor.value = "";
        inConductor.disabled = true;
      }
    } else {
      if (inConductor) {
        inConductor.disabled = false;
      }
    }

    if (!record) {
      if (document.getElementById('lblDriver')) document.getElementById('lblDriver').textContent = "No Record Filed";
      // ... (අනෙක් සියලුම Fields 0 කිරීමේ කොටස)
      return;
    }

    const condExpenses = record.condPaid || 0;
    const netProfit = record.revenue - (record.fuel + record.driverPaid + condExpenses + record.otherCost);

    // දත්ත තිරයේ පෙන්වීම
    if (document.getElementById('lblDriver')) document.getElementById('lblDriver').textContent = record.driver;
    if (document.getElementById('lblProfit')) document.getElementById('lblProfit').textContent = `LKR ${netProfit.toLocaleString()}`;
    // ... (අනෙක් Fields සඳහා දත්ත පිරවීම මෙතැනට එකතු කරන්න)
  }

  // ==========================================
  // TAB & FORM LOGIC
  // ==========================================
  if (bus2DataForm) {
    bus2DataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // දත්ත සුරැකීමේ පර්යාවසාන කෝඩ් එක
      alert('Records saved successfully!');
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchVehicleTab(e.target.dataset.vehicle);
    });
  });

  function switchVehicleTab(vehicleKey) {
    currentActiveVehicle = vehicleKey;
    showFinancialDataForDate(vehicleKey, bus2DateSelector.value);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      window.location.href = 'index1.html';
    });
  }

  loadAvailableTrips();
  switchVehicleTab('bus2');
});