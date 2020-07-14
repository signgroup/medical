import axios from 'axios'
import {apiUrl} from "./../../config";
// import SmtApi from "smtapi";
/*
*index使用发放
* 老地址
*<script type="text/javascript" src="http://thirdparty.test.nbpitech.com:8060/smtJsApi/static/jsapi/SmtApi-1.2.js"></script>
* 接口文档地址
* http://thirdparty.test.nbpitech.com:8060/smtJsApi/#/index  老地址
* http://thirdparty.test.nbpitech.com:8060/smtJsApi/#/index   新地址
* */
console.log(apiUrl)
// axios.defaults.baseURL = config.apiUrl
const w = window.weui;
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    let loading = w.loading();

    //刷新token
    const refreshToken = () => {
        this.post('/refreshToken/', {
            access_token:localStorage.getItem("accessToken"),
            refreshToken:localStorage.getItem("refreshToken")
        })
            .then((res) => {
                if(res.errorCode==40102){
                    w.topTips("请重新进入医疗挂号");

                }
                localStorage.setItem("userInfo", JSON.stringify(res));
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err)
            })
    })
        .then(data => {
            // console.log(data)
            loading.hide();


            if (data.errorCode == 40101) {
                w.alert('登录超时，请重新登录', function(){
                    // console.log(SmtApi)
                    localStorage.clear();
                    sessionStorage.clear();
                    fmapi.closeTheView()
                });
                // refreshToken()
                // w.topTips(data.message);
                /*setTimeout(()=>{
                    //token过期清除本地缓存
                    localStorage.clear()
                    sessionStorage.clear()
                    this.$router.push('/login');
                },1000)*/
            }
            return data;
        })
        .catch(err => {
            console.log("err", err)
            w.topTips("服务器异常");
            loading.hide();
        })
}
