let engines = "bing images"
function changeTypeFilter(typeParam) {
  let options = {
    "standard": "bing images",
    "icons": "!mi!luc!fli!di"
  }
  engines = options[typeParam]
}

async function obtainSearchData() {
  const params = new URLSearchParams(window.location.search)
  let lang = 'all'

  let request = await fetch(`http://${location.hostname}:8080/search?q=${params.get('q')}&engines=${engines}&categories=images&language=${lang}&format=json&`)
  let response = await request.json()
  console.log(response)

  let names_response = await getSiteName(response)



  const results = document.getElementById('results-list');


  for (let image of names_response['results']) {
    if (image['parsed_url'] === null) {
      let url_split = image['url'].replaceAll('https://', "").replaceAll('http://', "").split('/')
      image['parsed_url'] = ["https://", url_split[0], url_split[1], "", "", ""]
    }
    let content = document.createElement('div');
    const image_src = image['img_src']
    content.innerHTML = `<div class="result" onclick='imageClick(${JSON.stringify(image['url'])},${JSON.stringify(image['parsed_url'])},${JSON.stringify(image['img_src'])},${JSON.stringify(image['title'])},${JSON.stringify(image['engine'])})'><div class="img-wrapper"><img class="result-img" src="${image_src}" alt="${image['title']}"></div><img src="${image_src}" class="result-bg-img"><div class="result-info"><p class="result-url">${image['parsed_url'][1].replaceAll("www.", "")}</p></div></div>`
    // AI-Made
    const result = content.firstElementChild;

    const mainImg = result.querySelector('.result-img');
    const bgImg = result.querySelector('.result-bg-img');

    const removeResult = () => result.remove();

    mainImg.onerror = removeResult;
    bgImg.onerror = removeResult;
    // ...
    results.appendChild(result);
  }


}

obtainSearchData()

// AI-Made function
async function getSiteName(searxngResponse) {
  const res = await fetch(`http://${location.hostname}:3001/enrich`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searxngResponse)
  });
  return await res.json();
}
// ...

