<template>
    <div class="MasterCard">
        <div class="logo">
            <p class="master-text">你要绑定的用湖已被其他用户绑定，系统将发送一条短信至该用户手机号{{sendPhone}}，验证完成后即更换绑定成功。</p>
        </div>
        <div class="code-login">
            <div class="weui-cells weui-cells_form">
            <div class="weui-cell get_code" >
                <div class="weui-cell__hd"><label class="weui-label">验证码：</label></div>
                <div class="weui-cell__bd"><input type="number" placeholder="请输入验证码"
                                                  oninput="value=value.replace(/[^\d]/g,'');if(value.length>6)value=value.slice(0,6)"
                                                  maxlength="6"
                                                  v-model="form.captchaValue"
                                                  class="weui-input"></div>
                <div class="weui-cell__bd btn-text">
                    <button class="weui-btn btn-none btn-code" @click="getCaptchaCodes" :disabled="btnCodeStatus">
                        {{btnCodeStatus?currentTime+"秒":"重新发送"}}
                    </button>
                </div>
            </div>
            </div>
            <div class="btn-group">
                <button class="weui-btn btn-primary btn-confirm" @click="btnSubmit">确认</button>
            </div>
        </div>
    </div>

</template>
<script>
    const w = window.weui;
    export default {
        name: "MasterCard",
        data() {
            return {
                btnCodeStatus: false,//验证码按钮状态
                btnDisabled: false,//提交按钮状态
                phone: "",//手机号
                currentTime: 60,
                disable:false,
                timer: null,//定时器
                captchaKeyPhone:"",//验证码唯一标识（token）
                form: {
                    captchaValue:''
                },
                sendPhone:'',
            }
        },
        methods: {

            //获取验证码
            getCaptchaCodes() {
                /*
                *cardType 证件类型
                *1居民身份证 ，2：居民户口簿 ，3：护照	，4：军官证（士兵证），5：驾驶执照 ，-1：其他
                *type业务类型；
                * 1：副卡账号注册，2：亲情关联
                * */
                let data = {
                    cardType: 1,
                    cardNum: this.form.cardNum,
                    name: this.form.name,
                    type: 2
                }
                this.btnDisabled = false
                this.post('/captchaMainCardCodes/', data)
                    .then((res) => {
                        console.log(res);
                        this.countdown()
                        if (res.token) {
                            this.form.captchaKey = res.token;
                            var tel = res.phone;
                            tel = "" + tel;

                            this.sendPhone=tel.substr(0,3) + "****" + tel.substr(7)
                            console.log( this.sendPhone);
                        } else {
                            // w.topTips(res.message);
                        }
                    })
                    .catch(() => {
                        this.countdown()
                    })
            },
            //按钮倒计时
            countdown() {
                var _this = this;
                var currentTime = _this.currentTime;
                _this.btnCodeStatus = true;
                _this.timer = setInterval(() => {
                    _this.currentTime = currentTime - 1;
                    currentTime--;
                    if (currentTime <= 0) {
                        _this.clearInterval();
                        _this.currentTime = 60;
                        _this.btnCodeStatus = false;
                    } else {
                        _this.btnCodeStatus = true;
                    }
                }, 1000)
            },
            //清空定时器
            clearInterval() {
                clearInterval(this.timer)
                this.timer = null
            },
            //提交
            btnSubmit() {
                console.log(this.form)
                this.btnDisabled = true;
                if (!this.form.captchaValue) {
                    w.topTips('请输入验证码');
                    this.btnDisabled = false;
                    return false;
                }
                //{"gender":2,"access_token":"eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoiNGEvTnpLYzQ4VlJoZ3FkYTdUZGJCdTR1Z0RmYTZwa0R0UzBieTNFMzgxNWN6bVJBWm1jL3VUandDU3M2bldiaWdJa205dVVSMGxYbjRUME5KVnpVOXc9PSIsImV4cCI6MTU4MzMxNzMzMCwiaWF0IjoxNTgzMzEzNzMwLCJqdGkiOiJlZjM4MmIxYzA1ZDk0MGIxODRlZGU1NDZlMjM3NGQ2YiJ9.9dabsKsTHGVBDOAHT8GmsayFHDFDefBf0qymAP0dE0w","cardType":1,"relType":-1,"type":1,"address":"嘎的个","name":"扈静静","cardNum":"411503198706150722","treatmentCard":"A8587901X","captchaKey":"eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoiQW9xWUl2cTJycmppaXViTklaR0c2Q3I2ZmQ4QkMzRjJuOEU5RTNWYXErTVF0Vm5pNDZiRTdqMEFxbisyL2FQd20zSDRobFlzaDN5Nkw3MTloVS94SXVMVXZUbEJtaEhVdmxwbWZkUkV4bmxKeWJ4VmppOFhRWnBCcVFDYVA2VXhma3lYVnJQejFJUU94eWo4aFhybHdoaTRyQzE2SS9XeUpLM0Izd29CSGkzS2d3Q1dZSlJRV1JXbWxFMmMzVlgvUXd1Ym1Dc1FEOWdvcDFFZmZqQm9LTzBKaGtXTy9RYXZadW5zOVk3VXk5WjJOdWlVb1cyTnI1OTVRZnZhZU1neHhWU3hsNW5zZHN1RDZncFl3TjlqcWhWR28yMGc0M0p1NHEwNVBQdCtvRE09IiwiZXhwIjoxNTgzMzE0NjcyLCJpYXQiOjE1ODMzMTQzNzIsImp0aSI6IjY5ZjFlZGQ5NmRlNjRmNzdiOTA3ZDk5MTljOTg4NGU4In0.8WGcQq3Z_U11NLS-Jav_b8pMh1P1ik2vOPmBBahMpSE","captchaValue":"8751"}
                //验证通过
                if (this.btnDisabled) {
                    console.log(this.form)
                    this.form.type=2;
                    let data = this.form;
                    this.post('/createFamilyMembers/', data)
                        .then((res) => {
                            if (res == "") {
                                w.toast('操作成功', 2000);
                                this.$router.push({path: "/my/family", query: {disable: this.disable}});
                            }else{
                                w.topTips(res.message);
                            }

                            this.btnDisabled = false
                        })
                        .catch(() => {
                            this.btnDisabled = false
                        })
                }
            },

        },
        props: [],
        created() {
            this.form = this.$route.query.form;
            this.disable = this.$route.query.disable;
            this.getCaptchaCodes();

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
    .MasterCard {
        width: 100%;
        position: relative;
        height: 100%;
        .logo {
            .master-text {
                text-align: left;
                padding: 15px;
                color: #CACACA;
            }
        }
        .weui-cells {
            .weui-label {
                width: 70px;
                font-size: 14px;
                color: #343434;
            }
            input {
                color: #333;
                font-size: 14px;
            }
            .btn-text {
                -webkit-box-flex: inherit;
                -webkit-flex: inherit;
                flex: inherit;
                .btn-code {
                    color: #31BAF7;
                    padding: 0;
                    width: 100px;
                    background: transparent;
                    font-size: 15px;
                }
            }
            .weui-cell__ft {
                height: 24px;
                position: relative;
                &:after {
                    content: '';
                    display: none;
                }
                .triangle {
                    position: absolute;
                    top: 6px;
                    width: 0;
                    height: 0;
                    border-right: 8px solid transparent;
                    border-left: 8px solid transparent;
                    border-top: 12px solid #25B5F7;

                }
            }

        }

        .btn-group {
            margin-top: 40px;
            .btn-confirm {
                width: 290px;
                padding: 11.5px;
            }
        }

    }
</style>
