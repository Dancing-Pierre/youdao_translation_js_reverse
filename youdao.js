const d = "fanyideskweb", u = "webfanyi"
const t = (new Date).getTime()
const e = "fsdsogkndfokasodnaso"
const crypto = require('crypto')

function sign(t, e) {
    return h(t, e)
}

function h(e, t) {
    return v(`client=${d}&mysticTime=${e}&product=${u}&key=${t}`)
}

function v(e) {
    return crypto.createHash("md5").update(e.toString()).digest("hex")
    // return r.a.createHash("md5").update(e.toString()).digest("hex")
}


//==============================分隔符（上面是发送请求的sign解密，下面是返回的字符串解密）=======================================


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
// console.log(sign(t, e))
console.log(data(text))