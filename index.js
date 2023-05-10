import fetch from "node-fetch";
import qs from "qs";
import dayjs from "dayjs";
import crypto from "node:crypto";

export default class WdtCLient {
    constructor(sid, appkey, appsecret, baseurl = 'https://sandbox.wangdian.cn') {
        this.sid = sid;
        this.appkey = appkey;
        this.appsecret = appsecret;
        this.baseurl = baseurl;
    }
    sign(params) {
        const param_list = [];
        for (const key of Object.keys(params).sort()) {
            const value = params[key].toString();
            const item = `${key.length.toString().padStart(2, 0)}-${key}:${value.length.toString().padStart(4, '0')}-${value}`;
            param_list.push(item);
        }
        const str_params = param_list.join(';') + this.appsecret;
        params['sign'] = crypto.createHash('md5').update(str_params).digest('hex');
        return params;
    };
    async doRequest(url, params) {
        const request_url = `${this.baseurl}${url}`;
        const headers = { 'content-type': 'application/x-www-form-urlencoded' };
        const request_params = this.sign({ ...params, sid: this.sid, appkey: this.appkey, timestamp: dayjs().unix() });
        const resp = await fetch(request_url, { method: 'post', headers: headers, body: qs.stringify(request_params) });
        const result = await resp.json();
        return result;
    }
}
