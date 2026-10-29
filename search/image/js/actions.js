function imageClick(imgUrl, imgParsedUrl, imgSrc, imgTitle, imgEngine) {
  let popupWrapper = document.getElementById('popup-wrapper')
  let popup = document.getElementById('image-popup')
  let popupImage = document.getElementById("image-element-popup")
  let popupInfo = document.getElementById("image-popup-info")


  const faviconUrl = `https://www.google.com/s2/favicons?domain=${imgUrl}&sz=100`;
  popup.innerHTML = `<img id="image-element-popup" src="${imgSrc}"><div id="image-popup-info"><div id="popup-basic-info"><img src="${faviconUrl}"><a href="${imgUrl}" class="image-popup-url">${imgParsedUrl[1]}</a><p>${imgTitle}</p></div><div id="popup-more-info"><a class="image-popup-source" href="${imgSrc}" style="grid-column: 1;">Go to Source</a><p style="grid-column: 1;">Engine</p><p style="grid-column: 2;">${imgEngine}</p></div></div>`

  // AI-Made
  const img = new Image()
  img.src = imgSrc

  img.onload = () => {
    const ratio = img.naturalWidth / img.naturalHeight
    if (ratio > 1.05) {
      popup.style.gridTemplateRows = "45% 1fr"
      popup.style.gridTemplateColumns = "1fr"
      popupImage.style.height = "40%"
      popupImage.style.maxWidth = "100%"
      popupImage.style.marginTop = "30px"
      popupInfo.style.gridTemplateRows = "1fr"
      popupInfo.style.gridTemplateColumns = "50% 50%"
      document.getElementById('popup-more-info').style.gridColumn = '2'
    } else {
      popup.style.gridTemplateRows = "1fr"
      popup.style.gridTemplateColumns = "45% 60%"
      popupImage.style.maxHeight = "100%"
      popupImage.style.width = "40%"
      popupImage.style.maxWidth = "40%"
      popupInfo.style.gridTemplateRows = "50% 50%"
      popupInfo.style.gridTemplateColumns = "1fr"
    }
    /*orientation =
      ratio > 1.05 ? 'landscape' :
      ratio < 0.95 ? 'portrait' :
      'square';*/
    // ...


  }

  popupWrapper.style.visibility = "visible"
}
