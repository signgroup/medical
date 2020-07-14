<template>
    <div class="payResult">
        <div class="weui-msg">
            <div class="weui-msg__icon-area">
                <i :class="['weui-icon_msg',payStatus==='success'?'weui-icon-success':'weui-icon-warn']"></i>
                <p :class="payStatus==='success'?'success-text':'error-text'">
                    {{payStatus==='success'?"支付成功":"支付失败"}}
                </p>
            </div>
            <div class="weui-msg__text-area">
                <div class="weui-msg__desc">
                    <p>{{payStatus==='success'?"请在预约时间内前往医院进行取号就诊，过期则失效":"网络错误，请稍后再试"}}</p>
                </div>
            </div>
        </div>
        <div class="btn-group">
            <a :href="'#/orderDetails?reservationRecordId='+reservationRecordId" class="weui-btn btn-primary" v-if="payStatus">查看预约信息</a>
            <button class="weui-btn btn-primary" v-else>重新支付</button>
            <a href="#/my/orderList" class="weui-btn btn-none ">返回预约列表</a>
        </div>
       <!-- <section >
    
            &lt;!&ndash;【宁波市卫生健康委】[预约挂号]预约确认！#医院名称##科室##医生名#（#就诊时间#）， 请在十分钟内点击链接确认 http://iwei7.com/bKWUE5U3 如手机原因无法打开链接可将此短信转发亲友，由亲友代操作，客服电话 0574 55001200工作时间9-17点&ndash;&gt;
            
            <p class="text">本次挂号以短信形式支付，短信已发送至您的手机请注意查收，并在 <span class="color-red">10分钟</span> 内按短信要求进行操作。</p>
            
            <div class="sms-content" style="display: none">
                &lt;!&ndash;<img src="./../../assets/img/img-sms.png" alt="">&ndash;&gt;
                <p class="sms-time">
                    <span>短信/彩信</span>
                    <span>今天 16:10</span>
                </p>
                <p class="sms-content-text ">
                    &lt;!&ndash;【预约挂号】预约确认！{{orderInfo.hospitalName}}-{{orderInfo.departmentName}}{{orderInfo.doctorName?orderInfo.doctorName:"普通"}}医生（{{conversionDate(orderInfo.reservationTime,orderInfo.outTime)}}），手续费1元，请在10分钟内回复111完成本次预约。&ndash;&gt;
                    【宁波市卫生健康委】[预约挂号]预约确认！{{orderInfo.hospitalName}}{{orderInfo.hospitalName}}（{{orderInfo.doctorName?orderInfo.doctorName:"普通医生"}}）， 请在十分钟内点击链接确认 <a href="http://iwei7.com/bKWUE5U3">http://iwei7.com/bKWUE5U3</a> 如手机原因无法打开链接可将此短信转发亲友，由亲友代操作，客服电话 0574 55001200工作时间9-17点
                </p>
                <p class="sms-tip">*具体以实际短信内容为准</p>
            </div>
        </section>
        <div class="btn-group">
            &lt;!&ndash;<a href="#/my/orderList" class="weui-btn btn-primary" v-if="payStatus">查看预约信息</a>
            <button class="weui-btn btn-primary" v-else>重新支付</button>&ndash;&gt;
            <a href="#/my/orderList" class="weui-btn btn-none ">返回预约列表</a>
        </div>-->
    
        
    </div>

</template>
<script>
    export default {
        name: "payResult",
        data() {
            return {
                payStatus: this.$route.query.payStatus?this.$route.query.payStatus:"success",
                orderInfo: {},
                reservationRecordId:this.$route.query.reservationRecordId
            }
        },
        methods: {
            /*conversionDate(datetime, outTime) {
                let date = new Date(datetime)
                return `${date.getMonth() + 1}月${date.getDate()}日${outTime == "A" ? "上午" : "下午"}`
            }*/
        },
        props: [],
        created() {
        },
        mounted() {

        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    .payResult {
        padding: 43px;
        background: #F6FAFF;
        .weui-msg {
            background: transparent;
            .time-color {
                color: #F83358;
            }
            .weui-icon_msg {
                font-size: 50px;
                
            }
            .weui-icon-success {
                color: #31BAF7;
            }
            .success-text {
                color: #31BAF7;
                margin-top: 7px;
            }
            .error-text {
                color: #FF5157;
                margin-top: 7px;
            }
            .weui-msg__text-area {
                padding: 0;
                .weui-msg__desc {
                    color: #CACACA;
                    font-size: 14px;
                }
            }
            .weui-msg__icon-area {
                margin-bottom: 19px
            }
        }
        .weui-icon-success {
            font-size: 50px;
        }
        .btn-group {
            margin-top: 30px;
            .weui-btn {
                width: 100%;
                padding: 9px 24px;
                font-size: 16px;
            }
            .flex-bottom {
                margin-top: 40px;
            }
            .btn-none {
                color: #343434;
                border: 1px solid rgba(239, 239, 239, 1);
                background: #fff;
            }
        }
        
        section {
            font-size: 15px;
            .text {
                color: #434343;
                .color-red {
                    color: #F83358
                }
            }
            .sms-content {
                margin-top: 12px;
                position: relative;
                .sms-time {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #666;
                    font-size: 10px;
                    line-height: 16px;
                    transform: scale(.85);
                    /*width: 100%;
                    position: absolute;
                    top: 10px;*/
                }
                .sms-content-text {
                    /*position: absolute;
                    top: 54px;
                    left: 27px;
                    text-align: justify;
                    width: 252px;*/
                    color: #0F0F0F;
                    font-size: 12px;
                    background: rgba(232,232,232,1);
                    padding: 10px;
    
                }
                .sms-tip {
                    font-size: 13px;
                    color: #999;
                }
            }
        }
        .ellipsis-4 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-all;
            white-space: normal !important;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
        }
    }

</style>
