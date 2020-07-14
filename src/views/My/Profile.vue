<template>
    <div class="Profile">
        <div class="weui-cells__title">用户信息</div>
        <div class="weui-cells weui-cells_form text-non-editable">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">真实姓名:</label></div>
                <div class="weui-cell__bd">{{userInfo.name}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">身份证号:</label></div>
                <div class="weui-cell__bd">{{userInfo.cardNum}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">绑定手机:</label></div>
                <div class="weui-cell__bd">{{userInfo.phone}}</div>
            </div>
        </div>
        <div class="weui-cells__title title-flex">
            <span>卡号信息</span>
            <span v-if="!edit" @click="handelEdit">修改</span>
        </div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">卡号信息:</label></div>
                <div class="weui-cell__bd"><input type="text" :disabled="!edit" v-model="treatmentCard"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">家庭地址:</label></div>
                <div class="weui-cell__bd">
                    <input type="text" v-if="edit"  class="address-text" :disabled="!edit" v-model="address" title="">
                    <p v-else>{{address}}</p>
                </div>
            </div>
            <div class="weui-cell" v-if="edit" style="display:none">
                <div class="weui-cell__hd"><label class="weui-label">验证码:</label></div>
                <div class="weui-cell__bd get-code">
                    <input type="number" oninput="if(value.length>6)value=value.slice(0,6)">
                    <button class="weui-btn btn-primary btn-code" @click="getCaptchaCodes" :disabled="btnCodeStatus">
                        发送验证码
                    </button>
                </div>
            </div>
        </div>
        <div class="btn-group flex-bottom" v-if="edit">
            <a href="javascript:;" class="weui-btn weui-btn_plain-primary btn-plain-primary"
               @click="handelEdit">取消修改</a>
            <button class="weui-btn btn-primary" @click="btnSubmit" :disabled="btnCodeStatus">确认绑定</button>
        </div>
    </div>

</template>
<script>
    const w = window.weui;
    export default {
        name: "Profile",
        data() {
            return {
                userInfo: {},//用户信息
                edit: false,
                currentTime: 60,
                timer: null,//定时器
                disable: false,
                btnCodeStatus: false,//获取验证码状态
                treatmentCard: "",//就诊卡号
                address: "",//地址信息
            }
        },
        methods: {
            //点击修改
            handelEdit() {
                this.edit = !this.edit;
                this.treatmentCard = this.userInfo.treatmentCard
                this.address = this.userInfo.address
            },
            //验证文本框
            getVerification() {
                if (!this.treatmentCard.trim()) {
                    w.topTips('请输入就诊卡号');
                    this.btnCodeStatus = false;
                    return;
                } else if (!this.address.trim()) {
                    w.topTips('请输入地址');
                    this.btnCodeStatus = false;
                    return;
                }
            },
            //修改提交
            btnSubmit() {
                this.btnCodeStatus = true
                this.getVerification()
                if (this.btnCodeStatus) {
                    let data = {
                        access_token: localStorage.getItem("accessToken"),
                        treatmentCard: this.treatmentCard,
                        address: this.address
                    }
                    this.post('/updateMembers/', data)
                        .then(res => {
                            console.log(res)
                            if (!res) {
                                this.edit = false
                                w.toast('更新成功', 2000);
                                this.btnCodeStatus = false;
                                this.getMembers()
                            } else {
                                w.topTips(res.message);
                                this.btnCodeStatus = false;
                            }
                        })
                }

            },

            //获取用户信息
            getMembers() {
                this.$http.post('/getMembers/', {
                    access_token: localStorage.getItem("accessToken")
                })
                    .then((res) => {
                        console.log(res.data);
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                        this.userInfo = res.data
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            //获取验证码
            getCaptchaCodes() {
                this.btnCodeStatus = true
                let data = {
                    phone: JSON.parse(localStorage.getItem("userInfo")).phone,
                    type: 2
                }
                this.post('/captchaCodes/', data)
                    .then((res) => {
                        if (res.data.token) {
                            this.form.captchaKey = res.token;
                            this.countdown()
                        } else {
                            w.topTips(res.data.message);
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
                        this.clearInterval(_this.timer);
                        this.currentTime = 60;
                        _this.btnCodeStatus = false;
                    } else {
                        _this.btnCodeStatus = true;
                    }
                }, 1000)
            },
            //清空定时器
            clearInterval() {
                this.timer = null;
            }
        },
        props: [],
        created() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
            this.treatmentCard = this.userInfo.treatmentCard
            this.address = this.userInfo.address
        },
        mounted() {

        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";
    
    .Profile {
        .address-text{
            width: 100%;
            overflow-x: scroll;
        }
        .flex-bottom {
            margin-top: 60px;
            padding: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .weui-btn {
                padding: 10.5px;
                height: 45px;
            }
            .weui-btn + .weui-btn {
                margin-top: 0;
                margin-left: 45px;
            }
            .btn-plain-primary{
                border:1px solid rgba(49,186,247,1);
                color: #31BAF7;
            }
        }
    }

</style>
