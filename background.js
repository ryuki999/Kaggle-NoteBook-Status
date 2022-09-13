// https://qiita.com/jimpei/items/eb09f4af122198952ffd

let searchText = "https://www.kaggle.com/code"
let microsecondsPerDay = 1000 * 60 * 60 * 24
let searchStartDate = (new Date).getTime() - microsecondsPerDay * 365 * 20

let searchQuery = {
    text: searchText,
    startTime: searchStartDate,
    maxResults: 10000
}

let alreadyRead = []

// 履歴取得
chrome.history.search(searchQuery, function (historyItems) {
    historyItems.forEach(function (historyItem) {
        code_url = historyItem.url.replace("https://www.kaggle.com", "")
        if (code_url.substr(0, 5) == "/code") {
            alreadyRead.push(historyItem.url)
        }
    })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.status === 'complete') {
        console.log(tab.id)
        if (!tab.url.includes("chrome://")) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: onRun,
                args: [alreadyRead],
            });
        }
    }
});


function onRun(alreadyRead) {
    setInterval(() => {
        // 一覧ページの各NoteBookのdiv区画に割り当てられているクラス
        elements = document.querySelectorAll(".sc-iNWwEs.hBdoQq")
        // elements = document.querySelectorAll(".sc-gFGZVQ.NUNdY.sc-bqxtXh.drSOOc")

        for (let i = 0; i < elements.length; i++) {
            // console.log(elements[i].childNodes[1])
            if (alreadyRead.some(e => e == elements[i].childNodes[1].href)) {
                console.log("ok")
                elements[i].style.setProperty('background', '#f5f4f4', 'important');
            }
        }
    }, 1000);
}