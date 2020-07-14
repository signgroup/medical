<template>
    <div class="goPay">
        <div class="weui-msg">
            <div class="weui-msg__icon-area">
                <i class="weui-icon-success"></i>
                <p class="success-text">锁定成功</p>
            </div>
            <div class="weui-msg__text-area">
                <div class="weui-msg__desc">
                    <p>请在 <span class="time-color">10分钟</span>内进行支付，以便完成预约挂号</p>
                </div>
            </div>
        </div>
        <div class="weui-cells__title weui-flex">
            <div>选择支付方式</div>
            <div class="weui-flex__item" style="text-align:right">支付金额
                <!--<span>{{regfee>0?regfee:1}}元</span>-->
                <span class="color-red">1元</span>
            </div>
        </div>
        <div class="weui-cells weui-cells_checkbox">
            <!--<div class="weui-cell weui-check__label" style="padding: 12px;">
                <div class="weui-cell__hd" style="display: flex;">
                    <img class="icon-sms" src="./../../assets/img/icon-sms.png" alt="">
                </div>
                <div class="weui-cell__bd">
                    <p style="font-size: 15px">短信挂号</p>
                </div>
                <div>
                    <div class="weui-cell__hd">
                        <input type="checkbox" class="weui-check" name="checkbox1" id="s11" checked="checked">
                        <i class="weui-icon-checked"></i>
                    </div>
                </div>
            </div>-->
            <div class="weui-cell weui-check__label" style="padding: 5px 10px;">
                <div class="weui-cell__hd">
                    <i class="iconfont icon-zhifubao" style="font-size: 40px;color: #31BAF7;"></i>
                </div>
                <div class="weui-cell__bd">
                    <p style="font-size: 15px">支付宝支付</p>
                </div>
                <div>
                    <div class="weui-cell__hd">
                        <input type="checkbox" class="weui-check" name="checkbox1" id="s11" checked="checked">
                        <i class="weui-icon-checked"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui-msg__opr-area">
            <p class="weui-btn-area">
                <a @click="btnPayment()" class="weui-btn btn-primary">确认支付</a>
                <a href="#/my/orderList" class="weui-btn btn-none">返回预约列表</a>
            </p>
        </div>
    </div>

</template>
<script>
    import utils from './../../assets/js/utils';

    const w = window.weui;
    export default {
        name: "goPay",
        data() {
            return {
                reservationRecordId: "",//约记录Id
                orderInfo: {}
            }
        },
        methods: {
            //确认支付
            btnPayment() {
                /*//发送手机支付
                const sendPayPhone = (orderNum) => {
                    let data = {
                        access_token: localStorage.getItem("accessToken"),
                        pkey: orderNum,
                        phone: this.orderInfo.patientPhone,
                        totalFee: 1,
                        info: `用户${this.orderInfo.patientName}在${this.orderInfo.hospitalName}(${this.orderInfo.departmentName})预约了${this.orderInfo.reservationTime}的${this.orderInfo.num}号`
                    }
                    this.post('/sendPayPhone/', data)
                        .then(() => {
                            this.$router.replace({name: "payResult", query: this.orderInfo})
                        })
                }
                //跳转支付宝支付
                const alipayOrder=(orderNum)=>{
                    let data = {
                        pay_num:orderNum,
                        access_token: localStorage.getItem("accessToken"),
                    }
                    this.post('/alipay/', data)
                        .then((res) => {
                            console.log(res)
                            if(res.pay_url){
                                window.location.href=res.pay_url
                            }else{
                                this.$router.path({name: "payResult", query: {payStatus:false}})
                            }
                            ///this.$router.replace({name: "payResult", query: this.orderInfo})
                        })
                }
                //创建支付订单
                const createPaymentOrder = () => {
                    this.post('/createPaymentOrder/', {
                        access_token: localStorage.getItem("accessToken"),
                        reservationRecordId: this.reservationRecordId,
                        payChannel:3009,
                        memberId:this.orderInfo.personid
                    })
                        .then((res) => {
                            console.log(res)
                            if (res.errorCode == 50044) {
                                w.topTips("支付超时，请重新预约！");
                                return
                            }
                            if(res.orderNum){
                                alipayOrder(res.orderNum)
                            }
                           
                            // sendPayPhone(res.orderNum)
                        })
                }
                */
                let _this=this
                w.confirm('是否确认支付', function () {
                        console.log('yes',_this.orderInfo)
                        utils.createPaymentOrder(_this,_this.orderInfo.reservationRecordId, _this.orderInfo.personid)
                        // this.$router.push({name:"payResult"})
                    },
                    function () {
                        console.log('no')
                    }
                );
            },
            //获取订单详情 expireIn:锁号有效期，单位秒;列表页没有，倒计时的服务器时间
            reservationRecordsInfo() {
                this.post('/reservationRecordsInfo/', {
                    access_token: localStorage.getItem("accessToken"),
                    reservationRecordId: this.reservationRecordId
                })
                    .then((res) => {
                        this.orderInfo = res
                    })
            },
        },
        props: [],
        created() {
            console.log(this.$route.query);
            this.doctorDetails = JSON.parse(sessionStorage.getItem("doctorDetails"));
            console.log(this.doctorDetails)
            this.reservationRecordId = this.$route.query.reservationRecordId
        },
        mounted() {
            this.reservationRecordsInfo()
        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    .goPay {
        .weui-msg {
            .time-color {
                color: #F83358;
            }
            .success-text {
                color: #31BAF7;
                margin-top: 7px;
            }
            .weui-msg__desc {
                color: #343434;
                font-size: 14px;
            }
            
        }
        
        .weui-icon-success {
            font-size: 50px;
        }
        .weui-icon-success, .weui-icon-checked:before {
            color: #31BAF7 !important;
        }
        .icon-sms {
            width: 40px;
            height: 40px;
        }
        .color-red {
            color: #F83358;
        }
        /*.icon-zhifubao {
            color: #31BAF7;
            font-size: 40px;
        }*/
        .weui-msg__opr-area {
            padding: 60px 43px;
            .weui-btn-area {
                .weui-btn {
                    width: 100%;
                    padding: 10.5px;
                }
                .btn-none {
                    border: 1px solid rgba(239, 239, 239, 1);
                    color: #343434;
                }
            }
        }
        
    }
</style>
