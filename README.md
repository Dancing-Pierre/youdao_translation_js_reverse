# 1、前言
相信各位小伙伴在写爬虫的时候经常会遇到这样的情况，一些需要携带的参数一直在变化，今天逆向的这个网站[某道翻译](https://fanyi.youdao.com/index.html#/)也如此：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e346efd1c78d48af885b3839d6f11d61.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/c4d240d9d25e410ba7417d99314f407e.png)
可以发现变的就两个参数，一个 sign，一个是 mysticTime，mysticTime 一看就是时间戳，所以只要逆向 sign 参数就行了。




# 2、步骤

可以直接全局搜索 `sign：`，加一个冒号可能好搜一点。搜索返回的结果比较少，多的话就每个sign都打上断点，点击翻译看看停在哪里。如果实在是太多了，就采用跟栈的方法，准确无误，慢慢的，我们找到了 sign 的位置：

![在这里插入图片描述](https://img-blog.csdnimg.cn/becfa083dbc44053885854c2b9933145.png)

t 是个时间戳，方法就是 `(new Date).getTime()`。e 是个固定值 `"fsdsogkndfokasodnaso"`，h 函数传入了 t 和 e 后就生成了 sign，进入 h 函数，发现就在上面。而 d 和 u 这两个参数也是固定的。并且 h 函数里面有调用了一个 v 函数，进入 v 函数，原来 v 函数也在上面。这 v 函数太熟悉了啊，标准的 MD5 加密。

整理一下完整的 js 代码就如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a68e80584c7d42f081517621aefb9ce7.png)

测试完没问题后，就可以封装为 Python 进行请求了，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/846a2a068f03408696ac67314301b1b0.png)

现在可以开始编写爬虫程序，写完运行一下，发现返回的不是翻译后的内容，而是一串字符，那就需要我们来解密一下了：

![在这里插入图片描述](https://img-blog.csdnimg.cn/989464c3212343e1ad159c46031d5fa6.png)
我们用跟栈的方法看密文在哪里出现的和在哪里发生了变化，一步一步往下跟，最先调用的函数放在最下面，我们只需要跟到明文出现的那一刻就行了。

我们先复制请求的 URL：

![在这里插入图片描述](https://img-blog.csdnimg.cn/8009cc33f5a94be9ac634b1272870c63.png)

切换到源代码，在XHR/提取断点把刚才复制的网址加上去，重新点一下翻译

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff53a79c66d041ea8f1d87cd8ce11b18.png)
可以看到这个 send 就是发请求，现在主要要找返回的数据，我们一步步进入下一个函数调用看看

![在这里插入图片描述](https://img-blog.csdnimg.cn/63e13937b4cc4e77b7cef40d65a859ad.png)
不过一会咱们可以看见，咱们刚才爬虫请求返回的字符出现了，接下来咱们要注意看了，因为要开始处理这个返回的字符串

![在这里插入图片描述](https://img-blog.csdnimg.cn/03fd90653c50437995f2aa750bd22ed5.png)
跟到这边的话，可以发现在这字符串成功翻译出来了，如图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/8c67f892cfef4c3487d60de24eb251e2.png)

可以看到起作用的是这个 `decodeData` ，我们进入那个 js 文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/2a1485fa866c4acb9e208e17c3589af5.png)
把其他断点取消，这边打上断点，重新翻译一下，一步一步往下跟，我们只需要跟到明文出现的那一刻就行了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/4b04d41e38c74662b707c7590a5e1553.png)
到 t 的时候还是一串字符串，继续往下走
![在这里插入图片描述](https://img-blog.csdnimg.cn/393e83a532b24180bdeef038b068eaf2.png)
可以看到到 s 的时候已经翻译出来了

![在这里插入图片描述](https://img-blog.csdnimg.cn/9c2422c0c658415d81c5d375f619ead3.png)
我们把代码扣下来放到 js 文件中去执行应该就差不多了
![在这里插入图片描述](https://img-blog.csdnimg.cn/703c096f0f7b45b9a1140ffabe62fdba.png)
看到了 r.a.createDecipheriv，就可以用 node 中内置的加密库 crypto 库去执行，当然也可以硬扣，就是有点费时间，而且还可能出现各种报错。

运行报错缺 g ，去代码再抠出来，记得 `r.a.createHash("md5").update(e).digest()` 改为 node 中内置的加密库 crypto 库：
![在这里插入图片描述](https://img-blog.csdnimg.cn/d9de50f076084aaf97b3f1f7cb12fa9b.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/af4951439a16414d8621b06d388dea0b.png)

运行报错缺了 o ，直接把 o 复制进来，
![在这里插入图片描述](https://img-blog.csdnimg.cn/0ecfdd7119f94873b6532bd09c820060.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7831c69949b443f690268ca52495177d.png)

再次运行报错没有 e.alloc 函数 ，这就需要补充一点 node.js 的相关知识了：

>逆向改写知识补充之 Node.js 
>Buffer.alloc() 方法：用于创建指定大小的新缓冲区对象。
>此方法比 Buffer.alloconsafe() 方法慢，但它确保新创建的 Buffer 实例永远不会包含可能敏感的旧信息或数据。
>语法：Buffer.alloc(size, fill, encoding)
>参数三个参数：
>- 大小：指定缓冲区的大小。
>- 填充：为可选参数，指定填充缓冲区的值。其默认值为 0。
>- 编码：如果缓冲区值是字符串，它是指定值的可选参数。其默认值为‘utf8’。
>
>返回值:
>- 这个方法返回一个新的指定大小的初始化缓冲区。
>- 如果给定的大小不是数字，将引发类型错误。

故我们只需要修改 js 代码为如下：

```javascript
function data(t) {
    // const a = e.alloc(16, g(o))
    //     , c = e.alloc(16, g(n))
    const a = Buffer.alloc(16, g(o))
        , c = Buffer.alloc(16, g(n))
        , i = crypto.createDecipheriv("aes-128-cbc", a, c);
    //, i = r.a.createDecipheriv("aes-128-cbc", a, c);
    let s = i.update(t, "base64", "utf-8");
    return s += i.final("utf-8"),
        s
}
```
再次运行，缺少 n ，返回复制补到 js 代码中：
![在这里插入图片描述](https://img-blog.csdnimg.cn/249c6b68c6ef4e84840ff50f01a31088.png)
最后咱们的 js 代码如下，测试之后，确实没有问题，直接用 Python 封装起来：

```javascript
const crypto = require('crypto')
const o = 'ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl';
const n = 'ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4';

function data(t) {
    const a = Buffer.alloc(16, g(o))
        , c = Buffer.alloc(16, g(n))
        , i = crypto.createDecipheriv("aes-128-cbc", a, c);
    //, i = r.a.createDecipheriv("aes-128-cbc", a, c);
    let s = i.update(t, "base64", "utf-8");
    return s += i.final("utf-8"),
        s
}

function g(e) {
    return crypto.createHash("md5").update(e).digest()
    // r.a.createHash("md5").update(e).digest()
}


text = 'Z21kD9ZK1ke6ugku2ccWu4n6eLnvoDT0YgGi0y3g-v0B9sYqg8L9D6UERNozYOHqnYdl2efZNyM6Trc_xS-zKtfTK4hb6JP8XwCzNh0avc8qItQUiIU_4wKKXJlIpvMvfKvJaaZzaX6VEtpkr2FdkfoT_Jgbm2GRSVj3r40autIdlImENG8hC0ZH4ww7utwuTt3Oo_ZpXg0BSq9wePSAB75-ChkiGKF9HTIPeCl2bl84SBD1XDfFCZpkKQhecYSs0JLoXOqP2ltavxRrg58Hp1q5uIgZZ_Oo2-Jmd-t1r4es40drcAq5bjmS62M2VJF8D6ojtOh9JTfNwgzD3CxYn-Pd7-TgHMyNEJEkFXTAyxzpjlFqtrCYDE3SZUYlENkqsL8Wrra1hM-1nTfiB-BLcWAdRBynNpP5_54aq_-GBsq8bB_9yEX5ovzDB4_Ry_spVVuUnb39iplMHCdCnjOD3ngiIDbl9SUz-9npjBX05ZYRdPmFPAl424qdoaxeVqnVoH8jQFPZVqaHMzu4mJg0SICDWFH7GP1zqGRbXd3ESjT_iBInl3gICt2XVuhh_nubcELkTEC6xbqEDRQkPUNMpzXJHjcvsLHtcmSW0S9F0445ho9kT2qZYdMBC3Fs0OaHpUtFu77gZpQn7sGiqh8VliXIcUtfvvop-1c-Vu5QjfUbLn2-s5POR9fGYG6rt6ioe_PGmwWj-Cc00zUM7FybfarKTr4D3Rk57R72qpXN4Ja86ZsCAMmDG-m5z31RQh_V7echJ8Kna3Go3yWKCK4vtSwOWrFhiS5RTz6EkrGc3SkFKbb5vp8Wop_84myBtgnBmj4CczhTq2HcOxrJf4def6yDt2uBxyv4bTVGx9Yx3uB4Gx0iK5kYvfma6B_LnkRWk331wjuXKQtBGYIuWkR8J5QtvBmIRVaa7AA19Z4xMIEAqbcuQ5p4I9FCElthBrJd9YOcouHK4U27xxYWJJXcJoTvzG7zWtiV76fHDeQLgAWvJJ7ww4NFgjhqc6AKA_2afxa4c_lAvVZgFuKL3XSCL7PfKxp6GhjcGKeSRr80PT1gfFw2xi8X4ejjNm_prsUZ\n'
console.log(data(text))
```

用 json.loads 解析一下解密后的数据，即可获取翻译的正文，

```python
def get_explain_data(data):
    with open('./youdao.js', 'r', encoding='utf-8') as file:
        result = file.read()
        context1 = execjs.compile(result)
        explain_data = context1.call('data', data)
    explain_data = json.loads(explain_data)
    eng = explain_data['translateResult'][0][0]['tgt']
    return eng
```
最终效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c55c408e6bcd4af2ba934431c44b3bba.png)
# 3、号外
如果我的博客对你有帮助、如果你喜欢我的博客内容，请 “👍点赞” “✍️评论” “💙收藏” 一键三连哦！
【👇🏻👇🏻👇🏻关注我| 获取更多源码 | 定制源码】大学生毕设模板、期末大作业模板 、Echarts大数据可视化、爬虫逆向等! 「一起探讨 ，互相学习」！（vx：python812146）
以上内容技术相关问题😈欢迎一起交流学习👇🏻👇🏻👇🏻🔥
