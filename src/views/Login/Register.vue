<template>
    <div class="Register">
        <div class="weui-cells__title">注册信息</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">注册账号:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="请输入字母和数字组合" v-model="form.loginName"
                                                  oninput="value=value.replace(/[\W]/g,'');if(value.length>10)value=value.slice(0,10)"
                                                  class="weui-input"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">登录密码:</label></div>
                <div class="weui-cell__bd"><input type="password" placeholder="8 ~ 16位字母和数字" v-model="form.loginPwd"
                                                  oninput="value=value.replace(/[\W]/g,'');if(value.length>16)value=value.slice(0,16)"
                                                  class="weui-input">
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">确认密码:</label></div>
                <div class="weui-cell__bd"><input type="password" placeholder="8 ~ 16位字母和数字" v-model="loginRePwd"
                                                  oninput="value=value.replace(/[\W]/g,'');if(value.length>16)value=value.slice(0,16)"
                                                  class="weui-input">
                </div>
            </div>
        </div>
        <div class="weui-cells__title">用户信息</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>真实姓名:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="请输入身份证姓名" v-model="form.name"
                                                  class="weui-input"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>身份证号:</label></div>
                <div class="weui-cell__bd"><input placeholder="请输入身份证件号码" maxlength="18"
                                                  οninput="value= value.replace(/[^\d|xX]/g,'')"
                                                  class="weui-input"
                                                  type="text"
                                                  v-model="form.cardNum"
                ></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>手机号码:</label></div>
                <div class="weui-cell__bd"><input class="weui-input" type="number" v-model="form.phone" pattern="[0-9]*"
                                                  placeholder="请输入手机号码"
                                                  oninput="value=value.replace(/[^\d]/g,'');if(value.length>11)value=value.slice(0,11)"
                                                  maxlength="11"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>验证码:</label></div>
                <div class="weui-cell__bd get-code">
                    <input type="number" v-model="form.captchaValue"
                           
                           placeholder="输入验证码"
                           oninput="value=value.replace(/[^\d]/g,'');if(value.length>6)value=value.slice(0,6)"
                           maxlength="6">
                    <button class="weui-btn btn-primary btn-code" @click="getCode" :disabled="btnCodeStatus">
                        {{btnCodeStatus?currentTime+"秒":"获取验证码"}}
                    </button>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>就诊卡号:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="医保卡/通用就诊卡" class="weui-input"
                                                  oninput="value=value.replace(/[\W]/g,'')"
                                                  v-model="form.treatmentCard"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label"><span>*</span>家庭地址</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="必填" maxlength="50"   v-model="form.address" class="weui-input">
                </div>
            </div>
        </div>
        <div class="btn-group">
            <button class="weui-btn btn-primary" :disabled="btnDisabled" @click="register">提交
            </button>
        </div>
    </div>

</template>
<script>
    var w = window.weui;

    export default {
        name: "Register",
        data() {
            return {
                btnDisabled: false,//提交按钮状态
                form: {},//表单
                loginRePwd: "",//确认密码（只验证）
                currentTime: 60,
                timer: null,//定时器
                btnCodeStatus: false,//获取验证码状态
                imgData: "",
                captchaKey: ""
            }
        },
        components: {
        },
        methods: {
            //验证文本框
            getVerification(name) {
                if (!this.form.loginName) {
                    w.topTips('请输入注册帐号');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.loginPwd) {
                    w.topTips('请输入登录密码');
                    this.btnDisabled = false;
                    return;
                }
                let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
                if (!pwdReg.test(this.form.loginPwd)) {
                    w.topTips('密码格式不正确');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.loginRePwd) {
                    w.topTips('请输入确认密码');
                    this.btnDisabled = false;
                    return;
                }
                if (this.loginRePwd !== this.form.loginPwd) {
                    w.topTips('两次密码输入不一致');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.name) {
                    w.topTips('请输入身份证姓名');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.cardNum) {
                    w.topTips('请输入身份证证号码');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.phone) {
                    w.topTips('请输入手机号码');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.treatmentCard) {
                    w.topTips('请输入就诊卡号');
                    this.btnDisabled = false;
                    return;
                }
                if (!this.form.address) {
                    w.topTips('请输入家庭地址');
                    this.btnDisabled = false;
                    return;
                }
                if(name==="submit" && !this.form.captchaValue){
                    w.topTips('请输入验证码');
                    this.btnDisabled = false;
                    return;
                }
            },
            //获取验证码
            getCaptchaCodes() {
                let data = {
                    phone: this.form.phone,
                    type: 1
                }
                this.btnDisabled = false
                this.post('/captchaCodes/', data)
                    .then((res) => {
                        if (res.token) {
                            this.countdown()
                            this.form.captchaKey = res.token;
                        } else {
                            this.btnCodeStatus = false
                            w.topTips(res.message);
                        }
                    }).catch(() => {
                    this.btnCodeStatus = false
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
                        this.clearInterval(_this.timer);
                        this.currentTime = 60;
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
            },
            // 注册
            register() {
                
                this.btnDisabled = true
                this.getVerification("submit")
                
                /*
                * type=1
                * 不需要主卡验证
                * type=2 主卡验证
                * captchaKeyPhone
                * captchaValuePhone
                * */
                if (this.btnDisabled) {
                let data = {
                    ...this.form,
                    type: 1,
                }
                // {"token":"eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoiMTFNZENqU2xydDFsRlJydVhvaVBiVmV0RWtUeXRMOCt3MEY3ZDY3b2VmQnFxU09mWjVYZmdKclRReUdyR0xNelk2dGNzWVZzVTNvZHN5enEzMFIrY0JLbU9yUU43MUNWUDd2SGwvcjJTNEsyWlhOV1FYWERibHRWZVJWQkZ1eVhmVjhycWQ0ajRYU3ZCOHlva09hZmFEekJwNEsxSmQ0ZUtIQnhsbURKb2FCQkRIQlZZRXB0UHBUeU9TaWRvTUlaVHRrL20rYUwwVHRWTm1Xd3pDdC84WUNiYm93emsrUHVpbTFzRDNuMkFEOXYxamN6OUNtR0paZ1FaTWw2aWhjZElPN3ZkVW0vNzNjZ2Ezb3ZLdy9velI5ZXNZbUsrZjVENlJvUXZRbWhFOWNjRGJyVndWcllNS3FLcDVzTTVZcld1QzA1dy9WVjRvWEV2bkx1V1pEc2RZNjdtanlMMldyMWJ5U0tuR253S05BPSIsImV4cCI6MTU3Njg5Nzg2NywiaWF0IjoxNTc2ODk3NTY3LCJqdGkiOiJkNTIzODVhMDlhNDI0MDBmOTZhZmJiNzVhZDk1NjdjOSJ9.6L3Nqc8p3NHtdxwUxn8b9dbwzBtV4s_mb3tFJejbTuA"}
                //let data={"loginName":"aa112233","loginPwd":"aa112233","name":"智加","cardNum":"63010219900307087X","phone":"13581995025","treatmentCard":"057412345678","address":"地址","captchaKey":"eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoiMTFNZENqU2xydDFsRlJydVhvaVBiVmV0RWtUeXRMOCt3MEY3ZDY3b2VmQWJiYjlDTDNzeTFWU2FTbW9zY2lFc0ZKZm9Vck9LVytLQzlzQW1JUjJpYndwTzhkQmZVNjkrU0xVczhmS0dZbElSQzRIa2dxbTBCVndPN3ZPUURwZGwwNzdxby9ueUxpVU95aGpDOWFpRS9TOFdkREEvV3FWdDNTdElxUUNBTndMLy8wYlhQVStJVlBGbjkzejk2YlBrZGlCdEgwMkw4WExpMzNHUGE3bnkzc1hqam1ScW9WZzVJS0JJUjd4LzhKQVl1ZndITTR2Ykh6cXV5RDEwNDk3U1M0QWI5YllMOEZQTC8yVU9YemxZMDlMazNvVjFTTVhXVXF0VCtMZ1B1bDBHalZMUnpNVUVudkZzWmIvT0k5c0UiLCJleHAiOjE1NzY4OTcxODYsImlhdCI6MTU3Njg5NzA2NiwianRpIjoiMzk5MmRjMjM5NjE5NDE1ZWJiZmZhMmJkNmNkNDIxM2IifQ.GV_dxoU_AuJGHd42jHhy2mSihYtb46nyyaMwmIDpHM0","captchaValue":"117,76;42,143","type":1}
                console.log(data)
                this.post('/registeredMembers/', data)
                    .then((res) => {
                        console.log(res);
                        if (res.accessToken) {
                            localStorage.setItem("accessToken", res.accessToken);
                            localStorage.setItem("refreshToken", res.refreshToken);
                            this.$router.push({name: "hospital"});
                            this.getMembers(res.accessToken);
                        }else{
                            w.topTips(res.message);
                            if(res.errorCode==40001){
                                this.$router.push({name: 'masterCard', query: {phone: res.data.phone}})
                                sessionStorage.setItem("registerInfo",JSON.stringify(this.form))
                            }
                        }
                        this.btnDisabled=false
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
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

        },
        props: [],
        created() {

        },
        mounted() {

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
    @import "./../../assets/less/public";
    @import "./../../assets/less/login";
    
    .Register {
        height: 100%;
        overflow-y: scroll;
        .weui-cell {
            padding: 10.5px;
            .weui-label {
                width: 90px;
                padding-left: 5px;
                > span {
                    color: #FB5757;
                }
            }
            
        }
        .btn-group {
            margin-top: 55px;
        }
    }
</style>
