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
    // Long lived Connection
    if (url.match('((http|https)://|)(www.|)youtube.com/(watch|shorts)')) {
        if (port == null)
            port = chrome.tabs.connect(tabId);

        const connection = () => {
            // console.log('Sending message to content.js .......');
            port.postMessage(null);
            port.onMessage.addListener((res) => {
                // Response from content.js
                if (res) {
                    if (!res.downloadURL) {
                        showQualityOptions(res, port);
                    }
                    else {
                        renderURL(res.downloadURL);
                    }
                } else {
                    renderURL();
                }
            });
        }
        connection();
    }
}


/*
    data1.links.forAll.forAll[{f,q}]
 */
function showQualityOptions(res, port) {
    // Show dropdown for quality
    const data1 = res.data1;

    const quality = document.getElementById('quality');
    quality.innerHTML = '';

    //mp4 
    if (data1.links.mp4)
        for (let key in data1.links['mp4']) {
            let obj = data1.links['mp4'][key];
            let f = obj.f;
            let q = obj.q;
            let opt = document.createElement('option');
            opt.setAttribute('value', q + ',' + f);
            opt.innerHTML = q;
            quality.append(opt);
        }
    //ogg
    if (data1.links.ogg)
        for (let key in data1.links['ogg']) {
            let obj = data1.links['ogg'][key];
            let f = obj.f;
            let q = obj.q;
            let opt = document.createElement('option');
            opt.setAttribute('value', q + ',' + f);
            opt.innerHTML = q + ' ogg';
            quality.append(opt);
        }
    //mp3
    if (data1.links.mp3)
        for (let key in data1.links['mp3']) {
            let obj = data1.links['mp3'][key];
            let f = obj.f;
            let q = obj.q;
            let opt = document.createElement('option');
            opt.setAttribute('value', q + ',' + f);
            opt.innerHTML = q + ' mp3';
            quality.append(opt);
        }

    const dnld = document.getElementById('dnld');
    dnld.removeAttribute('disabled');
    dnld.onclick = (event) => {
        event.preventDefault();
        const val = quality.value;
        let vidQ = val.substring(0, val.indexOf(','));
        let f = val.substring(val.indexOf(',') + 1);
        // console.log(vidQ, f);
        port.postMessage({ vidQ, f, data1 });
    }
}


function renderURL(url) {
    const para = document.getElementById('para');
    if (url) {
        para.style.display = 'none';
        document.location.href = url;
    } else {
        para.style.display = 'block';
    }
    port = null;
}