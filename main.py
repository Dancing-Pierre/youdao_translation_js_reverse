import json
import time
import requests
import subprocess
from functools import partial

subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')
import execjs


def get_sign(time_now):
    with open('./youdao.js', 'r', encoding='utf-8') as file:
        result = file.read()
        context1 = execjs.compile(result)
        sign = context1.call('sign', time_now, 'fsdsogkndfokasodnaso')
    return sign


def get_data(chinese, sign):
    url = 'https://dict.youdao.com/webtranslate'
    header = {
        "Cookie": "OUTFOX_SEARCH_USER_ID=1214310433@10.108.162.135; OUTFOX_SEARCH_USER_ID_NCOO=799123950.7993276",
        "Host": "dict.youdao.com",
        "Origin": "https://fanyi.youdao.com",
        "Referer": "https://fanyi.youdao.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    data = {
        "i": f"{chinese}",
        "from": "auto",
        "to": "",
        "dictResult": "true",
        "keyid": "webfanyi",
        "sign": f"{sign}",
        "client": "fanyideskweb",
        "product": "webfanyi",
        "appVersion": "1.0.0",
        "vendor": "web",
        "pointParam": "client,mysticTime,product",
        "mysticTime": f"{time_now}",
        "keyfrom": "fanyi.web"
    }
    response = requests.post(url=url, headers=header, data=data)
    data = response.text
    explain_data = get_explain_data(data)
    return explain_data


def get_explain_data(data):
    with open('./youdao.js', 'r', encoding='utf-8') as file:
        result = file.read()
        context1 = execjs.compile(result)
        explain_data = context1.call('data', data)
    explain_data = json.loads(explain_data)
    eng = explain_data['translateResult'][0][0]['tgt']
    return eng


if __name__ == '__main__':
    while True:
        print('===================【跳出程序请输入：退出】====================')
        chinese = input('请输入中文：')
        if chinese == '退出':
            break
        t = time.time()
        time_now = int(round(t * 1000))
        sign = get_sign(time_now)
        result = get_data(chinese, sign)
        print('英文翻译是：{}'.format(result))
