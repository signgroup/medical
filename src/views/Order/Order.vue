<template>
    <div class="Order">
        <div class="weui-cells__title">用户信息</div>
        <div class="weui-cells weui-cells_form ">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">挂号费:</label></div>
                <div class="weui-cell__bd">1元</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">预约专家:</label></div>
                <div class="weui-cell__bd">{{doctorDetails.doctorName?doctorDetails.doctorName:"普通医生"}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊地点:</label></div>
                <div class="weui-cell__bd">{{doctorDetails.hospitalAddress}} {{doctorDetails.departmentName}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊时间:</label></div>

                <div class="weui-cell__bd seek-time" @click="pickerTime">
                    <input type="text" v-model="seekTime" disabled>
                    <span class="triangle"></span>
                </div>
            </div>
        </div>
        <div class="weui-cells__title title-flex">
            <span>就诊人信息</span>
            <a href="#/my/family?disable=false">切换就诊人</a>
        </div>
        <div class="weui-cells weui-cells_form ">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">姓名:</label></div>
                <div class="weui-cell__bd">{{userInfo.name}}
                    <small>（{{convertType(userInfo.relType)}}）</small>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">有效证件:</label></div>
                <div class="weui-cell__bd">身份证</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">证件号码:</label></div>
                <div class="weui-cell__bd">{{userInfo.cardNum}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">手机号码:</label></div>
                <div class="weui-cell__bd">{{userInfo.phone}}</div>
            </div>
        </div>
        <p class="order-tip">注：由于预约挂号限制，请在10分钟内进行预约支付！</p>
        <div class="flex-bottom">
            <button class="weui-btn btn-primary" :disabled="btnDisabled" @click="btnSubmit">马上预约</button>
        </div>
        <!--图形验证码-->
        <Captcha :img-data="imgData" :captcha-value="captchaValue" @sendCaptchaValue="sendCaptchaValue"
                 @sendRefresh="sendRefresh"
                 @sendCaptchaClose="sendCaptchaClose"/>
    </div>
</template>
<script>
    /* eslint-disable no-//console */
    const w = window.weui;
    import Captcha from './../../components/Captcha'
    import utils from './../../assets/js/utils'

    // const utils = require('./../../assets/js/utils')
    export default {
        name: "Order",
        data() {
            return {
                doctorDetails: {},//医生详情
                pickerTimeData: [],//所有就诊时间
                btnDisabled: false,//按钮状态
                pickerVisible: false,//选择器
                seekTime: "",//就诊时间
                num: "",//就诊时间 序号
                imgData: "",//验证码图片
                captchaKey: "",//图片token
                captchaValue: "",//接收图片位置0,0;1,1;
                userInfo: {},//用户信息
            }
        },
        methods: {
            //获取图形验证码
            getChoiseImage() {
                //验证通过进入
                this.post('/validate/choiseImage/', {
                    scheduleId: this.doctorDetails.scheduleId
                })
                    .then((res) => {
                        this.captchaValue = ""
                        window.$("#clickPoints").html("");
                        this.imgData = res.imgData
                        this.captchaKey = res.token;
                        this.btnDisabled = false
                    })
            },
            //关闭验证码弹框
            sendCaptchaClose(val) {
                // //console.log("val", val)
                this.imgData = val
            },
            //接收验证码位置
            sendCaptchaValue(val) {
                this.sendCaptchaClose()
                let data = {
                    access_token: localStorage.getItem("accessToken"),
                    scheduleId: this.doctorDetails.scheduleId,
                    num: this.num,
                    memberId: this.userInfo.memberId,
                    captchaKey: this.captchaKey,
                    captchaValue: val
                }
                //console.log("data", data)
                let _this = this
                this.post('/operationReservationRecords/', data)
                    .then((res) => {
                        if (res.errorCode === 40004) {
                            w.topTips(res.message);
                            _this.getChoiseImage();
                        }
                        if (res.reservationRecordId) {
                            _this.$router.push({name: 'gopay', query: {reservationRecordId: res.reservationRecordId}})
                        } else {
                            w.topTips(res.message);
                        }
                    })
                    .catch(() => {
                        this.getChoiseImage();
                    })

            },
            //组件刷新
            sendRefresh(status) {
                if (status) {
                    this.getChoiseImage();
                }
            },
            //提交按钮
            btnSubmit() {
                if (!this.seekTime && !this.num) {
                    w.topTips("请选择就诊时间");
                    return;
                }
                let _this = this
                w.alert(`
                    <ol style="text-align: left">
                    <li>1、本次预约将支付运营商短信服务费（1元）。</li>
                    <li>2、由于医院提供的预约挂号数的限制，请在锁号后10分钟内进行支付；如若超过10分钟，平台将自动进行退号处理。</li>
                    <li>3、预约成功以后，您将收到一条预约成功短信模版消息。您可根据预约记录结果内容到医院确认（自动挂号机或人工窗口）、就诊。</li>
                    <li>4、预约成功后您可在预约记录中查询到预约信息，对于为就诊且未过期的记录您可以进行（取消预约）的操作。</li>
                    <li>5、如若您在支付成功后并未预约成功，可在预约记录里进行退款，如您主动进行的退号（取消预约）操作，将不可进行退款操作，请您谨慎操作</li>
                    </ol>
                `, function () {
                    //console.log('ok')
                    _this.getChoiseImage()
                    // _this.$router.push({name: "gopay"});

                }, {
                    title: '挂号温馨提示'
                });
            },
            //获取排班的号子列表
            getSchedulesNumbers() {
                this.post('/getSchedulesNumbers/', {
                    scheduleId: this.doctorDetails.scheduleId,
                    pageIndex: 0,
                    pageSize: 100
                })
                    .then((res) => {
                        if(!res.length){
                            console.log("进来了")
                            this.pickerTimeData = [{
                                value: 0,
                                reservationTime: "全天",
                                label: "全天",
                            }];

                        }else{
                            const set=new Set()
                            for(let item of res){
                                if(item.allowReservation===0){
                                    set.add( {
                                        label: `序号${item.num} ${item.reservationTime}`,
                                        value: item.num,
                                        reservationTime:item.reservationTime
                                    })
                                }
                            }
                            this.pickerTimeData=[...set]
                        }

                        console.log(this.pickerTimeData)
                        sessionStorage.setItem("pickerTimeData", JSON.stringify(this.pickerTimeData));
                    })
            },
            //选择时间
            pickerTime() {
                let _this = this
                w.picker(this.pickerTimeData, {
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [1],
                    /*onChange: function (result) {
                        //console.log(result)
                    },*/
                    onConfirm: function (result) {
                        //console.log(result[0].name)
                        console.log(result)
                        _this.seekTime = result[0].reservationTime
                        
                        _this.num = result[0].value
                        sessionStorage.setItem("seekTimeData",
                            JSON.stringify({
                                seekTime: result[0].reservationTime,
                                num: result[0].value
                            })
                        )
                    },
                    id: 'singleLinePicker'
                });
            },
            //亲情号类型转换
            convertType(type) {
                if (!type) {
                    return "本人";
                }
                return utils.relType(type);
            },
            // 监听历史记录点, 添加返回事件监听
            onpopstate() {
                console.log(this.$store.state)
                // 给window添加一个popstate事件，拦截返回键，执行this.closeViews事件，addEventListener需要指向一个方法
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', this.closeViews, false);//false阻止默认事件
                }
            },
            closeViews() {

                console.log("back")
                this.$router.replace({path: '/doctor', query: this.$store.state.doctor});
            }
        },
        props: [],
        components: {
            Captcha

        },
        created() {
            this.doctorDetails = JSON.parse(sessionStorage.getItem("doctorDetails"));
            //console.log(this.doctorDetails);
        },
        mounted() {
            //console.log(this.$route.query.init)
            if (this.$route.query.init == true) {
                sessionStorage.removeItem("seekTimeData")
            }
            //console.log(this.$route.query);
            //时间本地获取，减少请求
            if (this.$route.query.memberId) {
                this.userInfo = this.$route.query
                this.pickerTimeData = JSON.parse(sessionStorage.getItem("pickerTimeData"));
                let seekTimeData = JSON.parse(sessionStorage.getItem("seekTimeData"));
                console.log(seekTimeData)
                if (seekTimeData) {
                    this.seekTime = seekTimeData.seekTime;
                    this.num = seekTimeData.num;
                }
            } else {
                this.getSchedulesNumbers();
                this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
                //console.log(this.userInfo)
            }
            this.onpopstate();
        },
        watch: {},
        filter: {},
        //页面销毁时，取消监听。否则其他vue路由页面也会被监听
        destroyed() {
            window.removeEventListener('popstate', this.closeViews, false);
        },

    }
</script>
<style lang="less" scoped>
    @import "./../../assets/less/public";

    .Order {
        .seek-time {
            display: flex;
            flex-direction: row;
            input {
                border: none;
                position: relative;
                flex: 1;
            }
            .triangle {
                width: 0;
                height: 0;
                border-right: 8px solid transparent;
                border-left: 8px solid transparent;
                border-top: 12px solid #25B5F7;

            }
        }

        .order-tip {
            color: #A9A9A9;
            font-size: 10px;
            padding: 5px 15px;
        }
        .flex-bottom {
            position: fixed;
            bottom: 8px;
            padding: 15px;
            width: 100%;
            .weui-btn {
                width: 100%;
                padding: 11.5px;
            }
        }
       
    }
</style>
