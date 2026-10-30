

async function search() {

  const params = new URLSearchParams(window.location.search)


  let lang = 'all'

  // obtain search results
  let request = await fetch(`https://umbrel.leaffish-tarpon.ts.net/search?q=${params.get('q')}&language=${lang}&format=json&`)
  let responseData = await request.json()

  // bulk pull site's names
  responseData = await getSiteName(responseData)

  // add elements to page
  results(responseData)
  infobox(responseData['infoboxes'])

}

async function results(responseData){
  for (let data of responseData['results']) {
    const url = data['url']
    const title = data['title']
    const body = data['content']


    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=40`;
    let easyUrl = data['url'].slice(8).replace(/\/$/, "").replaceAll("/", " > ")
    let name =  data["site_name"] || "Unknown";


    if (name.length > 45) { name = `${name.slice(0, 43)}...` }
    if (easyUrl.length > 45) { easyUrl = `${easyUrl.slice(0, 43)}...` }


    let resultsElement = document.getElementById('results-list');
    let result = document.createElement('div');
    result.innerHTML = `<div class="result-site-profile">` +
      `<img class="result-site-profile-icon" src=${faviconUrl}>` +
      `<p class="result-site-profile-name">${name}</p>` +
      `<p class="result-site-profile-url">${easyUrl.slice(0, 50)}</p>` +
      `</div>` +
      `<a class="result-title" href=${url}>${title}</a>` +
      `<p class="result-description">${body}</p>`

    result.className = 'result'
    resultsElement.appendChild(result);
  }
}

async function infobox(data) {
  if (Object.keys(data).length !== 0) {
    let image = data[0]['img_src']
    let content = data[0]['content']
    let title = data[0]['infobox']
    let urlTitle = data[0]['urls'][0]['title']
    let url = data[0]['urls'][0]['url']

    content = content.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")
    content = content.slice(0, 2)
    console.log(content)

    let answersElement = document.getElementById('search-response-answers')
    let infobox = document.createElement('div')
    infobox.id = 'infobox'
    infobox.innerHTML = `<h2 id="infobox-title">${title}</h2>` +
      `${image ? `<img id="infobox-image" src="${image}">` : ''}` +
      `<p id="infobox-text">${content.join(" ")}</p>` +
      `<div id="infobox-source"><p>Source</p> <a href=${url}>${urlTitle}</a></div>`
    answersElement.appendChild(infobox)
  }

  // if (Object.keys(data['infobox']).length !== 0) {
  //   let infotable = document.createElement('table')
  //
  //   for (const [key, list] of Object.entries(data.infobox)) {
  //     for (let i = 0; i < list.length; i++) {
  //       let row = document.createElement('tr')
  //
  //       if (i === 0) {
  //         let keyCell = document.createElement('th')
  //         keyCell.innerText = key
  //         keyCell.rowSpan = list.length
  //         row.appendChild(keyCell)
  //       }
  //
  //       let valueCell = document.createElement('td')
  //       valueCell.innerText = list[i]
  //       row.appendChild(valueCell)
  //
  //       infotable.appendChild(row)
  //     }
  //   }
  //
  //   middle.appendChild(infotable)
  // }
}

// AI-Made function
async function getSiteName(searxngResponse) {
  try {
    const res = await fetch(`http://${location.hostname}:3001/enrich`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searxngResponse)
    });
    return await res.json();
  } catch {
    if (searxngResponse && Array.isArray(searxngResponse.results)) {
      for (let item of searxngResponse.results) {
        if (item.url) {
          try {
            const url = item.url.startsWith('http') ? item.url : 'https://' + item.url;
            const host = new URL(url).hostname || '';
            const parts = host.toLowerCase().split('.');
            if (parts.length >= 2) {
              item.site_name = parts[parts.length - 2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            } else {
              item.site_name = parts[0] ? parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Unknown";
            }
          } catch {
            item.site_name = "Unknown";
          }
        } else {
          item.site_name = "Unknown";
        }
      }
    }
    return searxngResponse;
  }
}


search()
