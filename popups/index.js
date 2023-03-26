const btn = document.getElementById('btn');
btn.onclick = () => {
    // console.log('Please wait........Downloading.......');

    // Get data of tabs
    chrome.tabs.query({ active: true, currentWindow: true }, sendToContent);
}


let port = null;
function sendToContent(tabs) {
    const url = tabs[0].url;
    const tabId = tabs[0].id;
    const vidQ = '720p';
    // Long lived Connection
    if (port == null)
        port = chrome.tabs.connect(tabId);

    const connection = () => {
        console.log('Sending message to content.js .......');
        port.postMessage({ url, vidQ });
        port.onMessage.addListener((res) => {
            // Response from content.js
            if (res) {
                renderURL(res.downloadURL);
            } else {
                renderURL();
            }
        });
    }
    connection();
}

function renderURL(url) {
    const dnld = document.getElementById('dnld');
    const para = document.getElementById('para');
    if (url) {
        para.style.display = 'none';
        dnld.removeAttribute('disabled');
        dnld.onclick = (event) => {
            event.preventDefault();
            document.location.href = url;
        }
    } else {
        para.style.display = 'block';
    }
}