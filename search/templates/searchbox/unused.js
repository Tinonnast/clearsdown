siteMode = window.top.location.pathname.split("/")[2]
let currentMode = siteMode
document.getElementById(`mode-${siteMode}`).style.backgroundColor = '#2d2d2d'



function changeMode(mode) {
  const elementSearchInput = document.getElementById('search-bar-input')
  if (mode === currentMode && elementSearchInput.placeholder !== 'Type here to start Searching...') {
    if (elementSearchInput.value !== '') {
      window.top.location.href = `../../${mode}/?q=${elementSearchInput.value}`
    } else {
      window.top.location.href = `../../${mode}/?q=${elementSearchInput.placeholder}`
    }
  }
  document.getElementById(`mode-${currentMode}`).style.backgroundColor = 'transparent'
  document.getElementById(`mode-${mode}`).style.backgroundColor = '#2d2d2d'
  currentMode = mode
}

document.getElementById('search-bar-input').addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    changeMode(currentMode)
  }
})


document.getElementById('search-bar-input').addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
    this.value = this.placeholder
  }
})

document.getElementById('search-bar-input').addEventListener("input", function (event) {
  if (this.value === "..") {
    this.value = this.placeholder
  }
})


const params = new URLSearchParams(window.top.location.search)
if (!params.has('q')) {
  window.top.location.href = '../../../index.html'
}
document.getElementById('search-bar-input').placeholder = params.get('q')
