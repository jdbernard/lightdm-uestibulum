var powerOptionsEl = document.getElementById("power-options")
var powerPanelClasses = document.getElementById("power-panel").classList;

function showPowerOptions() {
  powerPanelClasses.add('active');
}

function hidePowerOptions(e) {
  console.log(e.target);
  if (e.target != powerOptionsEl) return;
  powerPanelClasses.remove('active');
}
