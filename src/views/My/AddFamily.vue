<template>
    <div class="AddFamily">
        <div class="weui-cells weui-cells_form " :style="edit?'color:#444':''">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">真实姓名:</label></div>
                <div class="weui-cell__bd"><input type="text"
                                                  :disabled="edit"
                                                  onpaste="return false;" placeholder="请输入真实姓名" maxlength="16"
                                                  v-model="form.name"
                                                  class="weui-input"></div>
            </div>
            <div class="weui-cell weui-cell_access" @click="selectGender">
                <div class="weui-cell__hd">
                    <label class="weui-label">性别:</label>
                </div>
                <div class="weui-cell__bd">
                    <input type="text" placeholder="请选择性别"
                           v-model="gender_str" disabled class="weui-input">
                </div>
                <div class="weui-cell__ft"><span class="triangle"></span></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">身份证号:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="请输入真实身份证号" :disabled="edit"
                                                  v-model="form.cardNum"
                                                  oninput="if(value.length>18)value=value.slice(0,18)"
                                                  class="weui-input"></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊卡号:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="请输入就诊卡号" :disabled="edit"
                                                  v-model="form.treatmentCard" class="weui-input"></div>
            </div>
        </div>
        <div class="weui-cells weui-cells_form" :style="edit?'color:#444':''">
            <div class="weui-cell" v-if="sendPhone">
                <div class="weui-cell__hd"><label class="weui-label">手机号:</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" disabled v-model="sendPhone"
                           maxlength="11">
                </div>
            </div>
            <div class="weui-cell get_code" v-if="!edit && valideCode">
                <div class="weui-cell__hd"><label class="weui-label">验证码：</label></div>
                <div class="weui-cell__bd"><input type="number" placeholder="请输入验证码"
                                                  oninput="value=value.replace(/[^\d]/g,'');if(value.length>6)value=value.slice(0,6)"
                                                  maxlength="6"
                                                  v-model="form.captchaValue"
                                                  class="weui-input"></div>
                <div class="weui-cell__bd btn-text">
                    <button class="weui-btn btn-none btn-code" @click="getCode" :disabled="btnCodeStatus">
                        {{btnCodeStatus?currentTime+"秒":"获取验证码"}}
                    </button>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">家庭地址:</label></div>
                <div class="weui-cell__bd"><input type="text" placeholder="请输入家庭地址" :disabled="edit"
                                                  v-model="form.address" class="weui-input"></div>
            </div>
        </div>
        <div class="weui-cells weui-cells_form" :style="edit?'color:#444':''">
            <div class="weui-cell weui-cell_access" @click="selectType">
                <div class="weui-cell__hd">
                    <label class="weui-label">关系:</label>
                </div>
                <div class="weui-cell__bd" id="singleLinePicker">
                    <input type="text" placeholder="请选择亲属关系"
                           v-model="rel_type_str" disabled class="weui-input">
                </div>
                
                <div class="weui-cell__ft"><span class="triangle"></span></div>
            </div>
        </div>
        <button @click="btnSubmit" class="weui-btn btn-primary btn-confirm" :disabled="btnDisabled" v-if="!edit">确定
        </button>
    </div>

</template>
<script>
    import utils from './../../assets/js/utils'

    const w = window.weui;
    export default {
        name: "AddFamily",
        data() {
            return {
                phone: "",//手机号
                form: {},
                currentTime: 60,
                timer: null,//定时器
                edit: false,
                rel_type_str: "",//选择框picker默认文本
                gender_str: "",//性别
                disable: false,
                btnCodeStatus: false,//获取验证码状态
                btnDisabled: false,//提交按钮状态
                userInfo: {},//个人用户信息
                sendPhone: "",//
                valideCode: false,//需要验证码
                typePicker: ""
            }
        },
        methods: {
            //选择性别
            selectGender() {
                if (this.edit) {
                    return
                }
                let _this = this;
                // 单列picker
                w.picker([
                    {
                        label: '男',
                        value: 1,
                    },
                    {
                        label: '女',
                        value: 2
                    },
                ], {
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [1],
                    onConfirm: function (result) {
                        _this.gender_str = result[0].label;
                        _this.form.gender = result[0].value;
                        // console.log(_this.form.gender)
                    },
                });
            },
            //选择亲情关系
            selectType() {
                if (this.edit) {
                    return
                }
                // 单列picker
                let _this = this
                _this.typePicker = w.picker([
                    {
                        label: '父亲',
                        value: 1,
                    },
                    {
                        label: '母亲',
                        value: 2,
                    },
                    {
                        label: '配偶',
                        value: 3,
                    },
                    {
                        label: '儿子',
                        value: 4
                    },
                    {
                        label: '女儿',
                        value: 5
                    },
                    {
                        label: '其他',
                        value: -1
                    },
                ], {
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [3],
                    /*onChange: function (result) {
                        console.log(result[0].label)
                    },*/
                    onConfirm: function (result) {
                        _this.rel_type_str = result[0].label
                        _this.form.relType = result[0].value
                    },
                    id: 'singleLinePicker'
                });
            },
            //验证文本框
            getVerification(name) {
                if (!this.form.name) {
                    w.topTips('请输入姓名');
                    this.btnDisabled = false;
                    return false;
                } else if (this.form.gender === "") {//数字0也是空
                    w.topTips('请选择性别');
                    this.btnDisabled = false;
                    return false;
                } else if (!this.form.cardNum) {
                    w.topTips('请输入身份证号');
                    this.btnDisabled = false;
                    return false;
                } else if (!this.form.treatmentCard) {
                    w.topTips('请输入就诊卡号');
                    this.btnDisabled = false;
                    return false;
                }
                else if (!this.form.address) {
                    w.topTips('请输入家庭地址');
                    this.btnDisabled = false;
                    return false;
                }


            },
            //提交
            btnSubmit() {

                this.btnDisabled = true;
                this.getVerification("submit");
                //验证通过
                if (this.btnDisabled) {
                    console.log(this.form)
                    let data = this.form;
                    this.post('/createFamilyMembers/', data)
                        .then((res) => {
                            if (res == "") {
                                w.toast('操作成功', 2000);
                                this.$router.push({name: "family", query: {disable: this.disable}});
                            } else {
                                if (res.errorCode == 40001) {
                                    // this.valideCode=true
                                    // this.form.type=2
                                    this.$router.push({
                                        path: "/my/familyCode",
                                        query: {form: this.form, disable: this.disable}
                                    });
                                } else {
                                    w.topTips(res.message);
                                }
                            }


                            this.btnDisabled = false
                        })
                        .catch(() => {
                            this.btnDisabled = false
                        })
                }
            },
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

                            this.sendPhone = tel.substr(0, 3) + "****" + tel.substr(7)
                            console.log(this.sendPhone);
                        } else {
                            w.topTips(res.message);
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
                        _this.setClearInterval();
                        _this.currentTime = 60;
                        _this.btnCodeStatus = false;
                    } else {
                        _this.btnCodeStatus = true;
                    }
                }, 1000)
            },
            //获取验证码
            getCode() {
                this.btnDisabled = true;
                this.getVerification();
                if (this.btnDisabled) {
                    this.btnCodeStatus = true
                    /*if (!this.phone) {
                        w.topTips('请输入手机号');
                        this.btnCodeStatus = false;
                        this.btnDisabled = false;
                        return;
                    }
                    if (this.phone.length != 11  || !(/^1[3|5|6|7|8|9][0-9]\d{4,8}$/.test(this.phone))) {
                        w.topTips('请输入正确的手机号');
                        this.btnCodeStatus = false;
                        this.btnDisabled = false;
                        return;
                    }*/
                    this.getCaptchaCodes()
                }
            },
            //亲情号类型转换

            //清空定时器
            setClearInterval() {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        props: [],
        created() {
            this.disable = this.$route.query.disable;
            // console.log(this.$route.query);
            if (this.$route.query.cardNum) {
                this.form = this.$route.query;
                this.phone = this.$route.query.phone;
                this.gender_str = this.$route.query.gender == 1 ? "男" : "女";
                this.rel_type_str = utils.relType(this.$route.query.relType);
                this.edit = true
            } else {
                this.form = {
                    gender: "",
                    access_token: localStorage.getItem("accessToken"),
                    /*cardType： 1居民身份证 ，2：居民户口簿 ，3：护照	，4：军官证（士兵证），5：驾驶执照 ，-1：其他*/
                    cardType: 1,//默认身份证
                    /*
                    * 关系：1：父亲，2：母亲，3：配偶，4：儿子，5：女儿，-1：其他
                    * */
                    relType: -1,//默认其他
                    type: 1,//默认1 需要验证码2
                    address: "",//默认空
                    name: "",
                    cardNum: "",
                    treatmentCard: "",

                }
                this.edit = false
            }
            console.log(this.edit)

        },
        mounted() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
        },
        watch: {},
        filter: {},
        destroyed() {
        }
    }
</script>

<style lang="less" scoped>
    .AddFamily {
        height: 100%;
        overflow-y: scroll;
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
        .btn-confirm {
            margin-top: 43px;
            width: 290px;
            padding: 11.5px;
        }
    }
</style>
