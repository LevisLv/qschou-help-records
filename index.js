'use strict';

const INDEX_HTML_FILE_PATH = './index.html';
const URI = 'https://gateway.qschou.com/v3.0.0/support/support/ebf16d11-2128-484d-8a0b-5060f5870816';

const fs = require('fs');
const rp = require('request-promise');

let helpMoney = 0.0;

fetchHelpRecords('')
    .catch(function (err) {
        console.error(err);
    });

async function fetchHelpRecords(next) {
    return rp({
        uri: URI,
        qs: {
            next: next
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    })
        .then(function (body) {
            if (Array.isArray(body.data)) {
                if (next === '') {
                    fs.writeFileSync(INDEX_HTML_FILE_PATH, `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" name="viewport">
    <link rel="shortcut icon" href="/img/favicon.ico">
    <title>轻松筹帮助记录</title>
</head>

<body>
<a href="https://m2.qschou.com/project/love/love_v7_manager.html?projuuid=ebf16d11-2128-484d-8a0b-5060f5870816" target="_blank">案件链接</a>
<a href="./好友转账.html">好友转账</a>
<table border="1" bordercolor="gray" cellpadding="5" cellspacing="0">
    <tr>
        <th>时间</th>
        <th>头像</th>
        <th>昵称</th>
        <th>帮助金额(共计xxxx.xx元)</th>
        <th>祝福语</th>
    </tr>
`);
                }
                body.data.forEach(function (item) {
                    helpMoney += parseFloat(item.title[1].text);
                    fs.appendFileSync(INDEX_HTML_FILE_PATH, `    <tr>
        <td><label style="color: #333333;">${getTime(item.created)}</label></td>
        <td><a href="${item.user.avatar}" target="_blank"><img style="width: 45px; height: 45px; border-radius: 45px;" src="${item.user.avatar}"></a></td>
        <td><label style="color: #4284B6;">${item.user.nickname}</label></td>
        <td><label style="color: #F25B4B;">${item.title[1].text}元</label></td>
        <td><label style="color: #333333;">${item.message}</label></td>
    </tr>
`);
                });
                if (body.next === '') {
                    fs.appendFileSync(INDEX_HTML_FILE_PATH, `</table>
</body>
</html>
`);
                }
            }
            if (body.next === '') {
                console.log(`helpMoney: ${helpMoney}`);
            } else {
                return fetchHelpRecords(body.next);
            }
        });
}

function getTime(timestamp) {
    const time = new Date(parseInt(timestamp) * 1000);
    const fullYear = time.getFullYear();
    const month = `0${time.getMonth() + 1}`.slice(-2);
    const date = `0${time.getDate()}`.slice(-2);
    const hours = `0${time.getHours()}`.slice(-2);
    const minutes = `0${time.getMinutes()}`.slice(-2);
    const seconds = `0${time.getSeconds()}`.slice(-2);
    return `${fullYear}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}
