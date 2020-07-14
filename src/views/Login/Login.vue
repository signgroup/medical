<template>
    <div class="Login">
        <div class="logo">
            <img src="https://static1.nbpitech.com/nbyl/src/assets/image/logo.png" alt="">
        </div>
        <!--用户名登录-->
        <div class="user-login" v-if="type===1">
            <ul class="input-box-content">
                <li class="input-box">
                    <label>帐&nbsp;&nbsp;&nbsp;&nbsp;号：</label>
                    <input type="text" placeholder="" v-model="loginName"
                           oninput="value=value.replace(/[\W]/g,'');if(value.length>16)value=value.slice(0,16)"
                           @keyup.enter="getChoiseImage"
                           class="weui-input">
                </li>
                <li class="input-box">
                    <label>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
                    <input class="weui-input" type="password" v-model="loginPwd" placeholder=""
                           @keyup.enter="getChoiseImage">
                </li>
            </ul>
            <p class="link-text"><a href="#/forgot">忘记密码？</a></p>
            <div class="btn-group">
                <button class="weui-btn btn-primary" :disabled="btnDisabled" @click="getChoiseImage">登录</button>
                <a href="#/register" class="weui-btn btn-none ">注册帐号</a>
            </div>
            <div class="btn-group flex-bottom">
                <a href="javascript:;" class="weui-btn weui-btn_plain-primary btn-plain-primary" @click="handelType(2)">身份证登录</a>
                <a href="javascript:;" class="weui-btn weui-btn_plain-primary btn-plain-primary" @click="handelType(3)">手机号码登录</a>
            </div>
        </div>
        <!--身份证号登录-->
        <div class="card-login" v-else-if="type===2">
            <ul class="input-box-content">
                <li class="input-box">
                    <label>身份证号码：</label>
                    <input class="weui-input" v-model="cardNum" type="text" placeholder="" maxlength="18"
                           oninput="(this.v=function(){this.value=this.value.replace(/^[a-zA-Z]+\D*|^\d{0,16}[a-zA-Z]+|[^0-9X]/g,'');}).call(this)"
                           @keyup.enter="getChoiseImage">
                </li>
                <li class="input-box">
                    <label>姓&nbsp;&nbsp;&nbsp;&nbsp;名：</label>
                    <input class="weui-input" type="text" v-model="name" placeholder="" @keyup.enter="getChoiseImage">
                </li>
                <li class="input-box">
                    <label>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
                    <input class="weui-input" type="password" v-model="loginPwd" placeholder=""
                           @keyup.enter="getChoiseImage">
                </li>
            </ul>
            <p class="link-text"><a href="#/forgot">忘记密码？</a></p>
            <div class="btn-group">
                <button class="weui-btn btn-primary" :disabled="btnDisabled" @click="getChoiseImage">登录</button>
                <a href="#/register" class="weui-btn btn-none ">注册帐号</a>
            </div>
            <p class="link-text link-bottom"><a href="javascript:;" @click="handelType(1)">使用账号登录</a></p>
        </div>
        <!--手机验证码登录-->
        <div class="code-login" v-else-if="type===3">
            <ul class="input-box-content">
                <li class="input-box">
                    <label>手机号码：</label>
                    <input class="weui-input" type="number" v-model="phone" pattern="[0-9]*"
                           placeholder=""
                           oninput="value=value.replace(/[^\d]/g,'');if(value.length>11)value=value.slice(0,11)"
                           maxlength="11"
                           @keyup.enter="getChoiseImage">
                </li>
                <li class="input-box">
                    <label>验证码：</label>
                    <input type="number" v-model="captchaValuePhone"
                           oninput="value=value.replace(/[^\d]/g,'');if(value.length>6)value=value.slice(0,6)"
                           maxlength="6"
                           @keyup.enter="getChoiseImage">
                    <button class="weui-btn btn-none btn-code" @click="getCode" :disabled="btnCodeStatus">
                        {{btnCodeStatus?currentTime:"获取验证码"}}
                    </button>
                </li>
            </ul>
            <p class="link-text" style="opacity: 0"><a href="#">忘记密码？</a></p>
            <div class="btn-group">
                <a href="javascript:;" class="weui-btn btn-primary" @click="getChoiseImage">登录</a>
            </div>
            <p class="link-text link-bottom"><a href="javascript:;" @click="handelType(1)">使用账号登录</a></p>
        </div>
        <!--图形验证码-->
        <div class="mask" v-if="imgData">
            <div class="plate-box">
                <img :src="imgData" alt="" @click="clickImage">
                <div id="clickPoints" style="height:0;width:0;float:left;" ref="plate"></div>
            </div>
            <div class="button-sparea">
                <a href="javascript:;" @click="closeMask" class="weui-btn weui-btn_mini weui-btn_warn">取消</a>
                <a href="javascript:;" @click="getChoiseImage" class="weui-btn weui-btn_mini weui-btn_default">刷新</a>
                <a href="javascript:;" @click="login" class="weui-btn weui-btn_mini weui-btn_primary">提交</a>
            </div>
        </div>
    
    </div>

</template>
<script>
    const w = window.weui;
    const $ =window.$;
    export default {
        name: "Login",
        data() {
            return {
                type: 1,//登录类型 说明handelType()
                btnDisabled: false,//按钮状态
                imgData: "",//验证码图片
                captchaKey: "",//图片token
                captchaValue: "",//接收图片位置0,0;1,1;
                loginName: "",//用户名
                loginPwd: "",//密码
                name: "",//姓名（身份证登录）
                cardNum: "",//身份证号码
                phone: "",//手机号
                currentTime: 60,
                timer: null,//定时器
                btnCodeStatus: false,//获取验证码状态
                captchaKeyPhone: "",//验证码token
                captchaValuePhone: "",//验证码
            }
        },
        methods: {
            /*
           * 切换登录
           * type
           * 1 帐号密码登录
           * 2 身份证登录
           * 3 手机验证码登录
           * */
            handelType(type) {
                //清空 用户名 密码 姓名 身份证等
                this.loginName = "";
                this.loginPwd = "";
                this.name = "";
                this.type = type
            },
            //验证文本框
            getVerification() {
                console.log(this.type)
                if (this.type === 1) {
                    if (!this.loginName) {
                        w.topTips('请输入帐号');
                        this.btnDisabled = false;
                        return;
                    } else if (!this.loginPwd) {
                        w.topTips('请输入密码');
                        this.btnDisabled = false;
                        return;
                    }
                } else if (this.type === 2) {
                    if (!this.cardNum) {
                        w.topTips('请输入身份证号');
                        this.btnDisabled = false;
                        return;
                    } else if (!this.name) {
                        w.topTips('请输入姓名');
                        this.btnDisabled = false;
                        return;
                    } else if (!this.loginPwd) {
                        w.topTips('请输入密码');
                        this.btnDisabled = false;
                        return;
                    }
                } else if (this.type === 3) {
                    if (!this.phone) {
                        w.topTips('请输入手机号');
                        this.btnDisabled = false;
                        return;
                    }
                    if (this.phone.length != 11 || !(/^1[3|5|6|7|8|9][0-9]\d{4,8}$/.test(this.phone))) {
                        w.topTips('请输入正确的手机号');
                        this.btnDisabled = false;
                        return;
                    }
                }
            },
            //获取图形验证码
            getChoiseImage() {
                this.btnDisabled = true;
                this.getVerification();
                //验证通过进入
                if (this.btnDisabled) {
                    this.post('/validate/choiseImage/')
                        .then((res) => {
                            this.captchaValue = ""
                            $("#clickPoints").html("");
                            this.imgData = res.imgData
                            this.captchaKey = res.token;
                            this.btnDisabled = false
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            //点击图片验证码获取位置
            clickImage(e) {
                if (this.captchaValue) this.captchaValue += ";";
                this.captchaValue += e.offsetX + "," + e.offsetY;
                let point = e.offsetX + "," + e.offsetY;
                let {x, y} = {x: e.offsetX - 10, y: e.offsetY - 10}
                let _this = this
                $(`<div style="width:20px;height:20px;line-height:20px;position:absolute; left:${x}px; top:${y}px; color:red;  cursor:grabbing;"><img src="https://static1.nbpitech.com/nbyl/src/assets/image/logo.png" alt=""></div>`)
                    .click(function () {
                        $(this).remove();
                        console.log(_this.captchaValue)
                        _this.captchaValue = _this.captchaValue.replace(point, "").replace(/(^\;)|(\;$)|\s/g, "").replace(/\;{2,}/g, ",");
                    })
                    .appendTo("#clickPoints");
                console.log(this.captchaValue)

            },
            //关闭弹框
            closeMask() {
                this.imgData = "";
                this.captchaValue = "";
                $("#clickPoints").html("");
            },
            //登录
            login() {
                let url = "";
                let data = {
                    loginPwd: this.loginPwd,
                    captchaKey: this.captchaKey,
                    captchaValue: this.captchaValue
                };
                /*
                * 1 用户名
                * （1） loginName 登陆名
                * 2 身份证
                * (1)cardType [证件类型；证件类型 ：1居民身份证 ，2：居民户口簿 ，3：护照	，4：军官证（士兵证），5：驾驶执照 ，-1：其他）]
                * (2)cardNum 证件号
                * (3)name 姓名
                * 3 手机验证码
                *  type 1：登录密码，2：动态验证码
                *  captchaKeyPhone 手机验证码token
                *  captchaValuePhone 数字验证码4位
                * */
                if (this.type === 1) {
                    url = "/loginNameLogin/"
                    data.loginName = this.loginName
                } else if (this.type === 2) {
                    url = "/IDNumberlogin/";
                    data.cardType = 1
                    data.cardNum = this.cardNum
                    data.name = this.name
                } else if (this.type === 3) {
                    url = "/phoneLogin/";
                    data.phone = this.phone;//手机号
                    data.type = 2;//动态验证码
                    data.captchaKeyPhone = this.captchaKeyPhone;
                    data.captchaValuePhone = this.captchaValuePhone;
                    delete data.loginPwd
                }
                console.log("data", data)
                console.log("url", url)
                this.post(url, data)
                    .then((res) => {
                        this.btnDisabled = false
                        if (res.errorCode == 40004) {
                            w.alert(res.message, () => {
                                this.getChoiseImage();
                            });
                            return;
                        }
                        if (res.errorCode == 40000) {
                            w.alert(res.message, () => {
                                this.base64 = "";
                                this.ans = "";
                               $("#clickPoints").html("");
                            });
                            return;
                        }
                        if (res.accessToken) {
                            localStorage.setItem("accessToken", res.accessToken);
                            localStorage.setItem("refreshToken", res.refreshToken);
                            this.$router.push({name: "hospital"});
                            this.getMembers(res.accessToken);
                        }
                    })
                    .catch(() => {
                        this.btnDisabled = false
                    })
            },
            //获取用户信息
            getMembers(access_token) {
                this.post('/getMembers/', {
                    access_token: access_token
                })
                    .then((res) => {
                        localStorage.setItem("userInfo", JSON.stringify(res));
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            //获取验证码
            getCaptchaCodes() {
                let data = {
                    phone: this.phone,
                    type: 2
                }
                this.post('/captchaCodes/', data)
                    .then((res) => {
                        if (res.token) {
                            this.captchaKeyPhone = res.token;
                            this.countdown()
                        } else {
                            w.topTips(res.message);
                        }
                    })
            },
            //按钮倒计时
            countdown() {
                var _this = this;
                var currentTime = _this.currentTime;
                _this.btnCodeStatus = true;
                _this.timer = setInterval(function () {
                    _this.currentTime = currentTime - 1;
                    currentTime--;
                    console.log(currentTime);
                    if (currentTime <= 0) {
                        _this.clearInterval(_this.timer);
                        _this.currentTime = 60;
                        _this.btnCodeStatus = false;
                    } else {
                        _this.btnCodeStatus = true;
                    }
                }, 1000)
            },
            //获取验证码
            getCode() {
                this.btnDisabled = true
                this.getVerification()
                //验证成功=>发送验证码
                console.log(this.btnDisabled)
                if (this.btnDisabled) {
                    this.getCaptchaCodes()
                }
            },
            //清空定时器
            clearInterval() {
                this.timer = null;
            }
        },
        props: [],
        created() {

        },
        mounted() {
            // window.weui.alert('alert');
        },
        watch: {},
        filter: {},
        //页面销毁时
        destroyed() {
            this.clearInterval()
        },
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/login";
    
    .Login {
        width: 100%;
        padding: 15px;
        position: relative;
        height: 100%;
        overflow-y: scroll;
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .6);
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            .plate-box {
                width: 290px;
                height: 180px;
                position: relative;
                .plate-click {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                }
            }
            .button-sparea {
                .weui-btn {
                    margin-right: 10px;
                }
            }
            
        }
    }
</style>
