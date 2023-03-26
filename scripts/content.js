function getLink({ vidQ, port }) {
    let videoURL = document.URL;

    // Request 1

    const xhr1 = new XMLHttpRequest();
    const url1 = 'https://savetube.app/api/ajaxSearch';
    const params1 = `q=${videoURL}&vt=home`;
    xhr1.open('post', url1, true);
    xhr1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr1.send(params1);
    xhr1.onerror = () => {
        // alert('Please try again');
        port.postMessage(null);
    }
    xhr1.onload = () => {
        const data1 = JSON.parse(xhr1.responseText);
        let v_id = data1.vid;
        let ftype = 'mp4';
        let fquality = vidQ ? vidQ : Object.values(data1.links.mp4)[0].q;
        let token = data1.token;
        let timeExpire = data1.timeExpires;
        const x_requested_key = 'de0cfuirtgf67a';

        // Request 2

        const xhr2 = new XMLHttpRequest();
        const url2 = 'https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994';
        const params2 = `v_id=${v_id}&ftype=${ftype}&fquality=${fquality}&token=${token}&timeExpire=${timeExpire}`;
        xhr2.open('post', url2, true);
        xhr2.setRequestHeader('x-requested-key', x_requested_key);
        xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr2.send(params2);
        xhr2.onerror = () => {
            // alert('Please try again');
            port.postMessage(null);
        }
        xhr2.onload = () => {
            let fname = data1.title ? data1.title : data1.vid;
            const data2 = JSON.parse(xhr2.responseText);

            // Request 3

            const xhr3 = new XMLHttpRequest();
            const url3 = data2.c_server + '/api/json/convert';
            const params3 = params2 + `&fname=${fname}`;
            xhr3.open('post', url3, true);
            xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr3.send(params3);
            xhr3.onerror = () => {
                // alert('Please try again');
                port.postMessage(null);
            }
            xhr3.onload = () => {
                const data3 = JSON.parse(xhr3.responseText);

                // Send response to Popup
                console.log(data3.result);
                port.postMessage({ downloadURL: data3.result });
            }
        }
    }
}


// Long-lived connection btw popup and content using port
// Message from Popup
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        // console.log(msg);
        const { url, vidQ } = msg;
        getLink({ vidQ, port });
    });
});