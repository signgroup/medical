<template>
    <div class="OrderDetails">
        <div class="weui-cells__title flex-title">
            <span>订单详情</span>
            <span v-if="countDownTime">倒计时:{{countDownTime}}</span>
        </div>
        <div class="weui-cells weui-cells_form ">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">预约序号:</label></div>
                <div class="weui-cell__bd">{{orderInfo.num}}号</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label" style="color: #000;">预约状态:</label></div>
                <div class="weui-cell__bd" :style="{color:convertColor(orderInfo.lockNumberType,orderInfo.status,orderInfo.payStatus)}">{{convertPayType(orderInfo.status)}}</div>
            </div>
            <div class="weui-cell" v-if="orderInfo.payStatus==1">
                <div class="weui-cell__hd"><label class="weui-label">取号码:</label></div>
                <div class="weui-cell__bd"> <strong>{{orderInfo.verificationCode}}</strong></div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">预约费:</label></div>
                <div class="weui-cell__bd">1元</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">预约专家:</label></div>
                <div class="weui-cell__bd">{{orderInfo.doctorName?orderInfo.doctorName :"普通医生"}} {{orderInfo.doctorTitle}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊地点:</label></div>
                <div class="weui-cell__bd">{{orderInfo.hospitalName}} {{orderInfo.departmentName}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊日期:</label></div>
                <div class="weui-cell__bd">{{orderInfo.reservationTime}}</div>
            </div>
        </div>
        <div class="weui-cells__title">就诊人信息</div>
        <div class="weui-cells weui-cells_form ">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">姓名:</label></div>
                <div class="weui-cell__bd">{{orderInfo.patientName}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">关系:</label></div>
                <div class="weui-cell__bd">{{convertType(orderInfo.relType)}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">证件类型:</label></div>
                <div class="weui-cell__bd">身份证</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">证件号码:</label></div>
                <div class="weui-cell__bd">{{orderInfo.patientIDcrad}} </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">手机号:</label></div>
                <div class="weui-cell__bd">{{orderInfo.patientPhone}} </div>
            </div>
        </div>

        <div class="btn-group">
            <button v-if=" (!orderInfo.payStatus && orderInfo.lockNumberType==0 && orderInfo.status==1) || orderInfo.status==2" class="weui-btn btn-primary" :disabled="btnDisabled"  @click="btnPayment">立即支付</button>
            <button v-if="(!orderInfo.payStatus && orderInfo.lockNumberType==0 && orderInfo.status==1) || orderInfo.status==2 || orderInfo.status==3 "  class="weui-btn btn-primary " :disabled="btnDisabled"  @click="bntCancelOrder">取消预约</button>
            <!--<button  class="weui-btn btn-none btn-cancel" :disabled="btnDisabled" >取消支付</button>-->
        </div>
    </div>
</template>
<script>
    import utils from './../../assets/js/utils';
    const w = window.weui;

    export default {
        name: "OrderDetails",
        data() {
            return {
                btnDisabled:false,//按钮状态
                reservationRecordId:"",//订单id
                orderInfo:{},//订单信息
                countDownTime:"",//倒计时显示
            }
        },
        methods: {
            //获取订单详情 expireIn:锁号有效期，单位秒;列表页没有，倒计时的服务器时间
            reservationRecordsInfo(){
                this.post('/reservationRecordsInfo/', {
                    access_token:localStorage.getItem("accessToken"),
                    reservationRecordId:this.reservationRecordId
                })
                    .then((res) => {
                        this.orderInfo=res
                        console.log(res)
                        this.countDown(res.lockNumberType,res.status,res.payStatus)
                    })
            },
            //取消预约
            bntCancelOrder(){
                const cancelOrder=()=>{
                    this.post('/reservationRecordsDelete/', {
                        reservationRecordId : this.orderInfo.reservationRecordId,
                        access_token: localStorage.getItem("accessToken")
                    })
                        .then((res) => {
                            this.reservationRecordsInfo()
                            this.countDownTime = ""
                            this.clearTimer()
                            w.toast(res, 2000);
                        })
                }
                w.dialog({
                    content: '取消后你将不再拥有该挂号序号，且挂号费用将不退还，是否确定取消？',
                    className: 'custom-classname',
                    buttons: [{
                        label: '我再想想',
                        type: 'default',
                        onClick: function () {
                            console.log("我再想想")
                        }
                    }, {
                        label: '确定',
                        type: 'primary',
                        onClick: function () {
                            console.log("确定")
                            cancelOrder()
                        }
                    }]
                });
            },
            //确认支付
            btnPayment() {
                /*//发送手机支付
                const sendPayPhone=(orderNum)=>{
                    let data={
                        access_token:localStorage.getItem("accessToken"),
                        pkey:orderNum,
                        phone:this.orderInfo.patientPhone,
                        totalFee:1,
                        info:`用户${this.orderInfo.patientName}在${this.orderInfo.hospitalName}(${this.orderInfo.departmentName})预约了${this.orderInfo.treatmentTime}的${this.orderInfo.num}号`
                    }
                    this.post('/sendPayPhone/', data)
                        .then(() => {
                            // console.log(res)
                            this.$router.replace({name:"payResult",query:this.orderInfo})
                        })
                }
                 //创建支付订单
                const createPaymentOrder=()=>{
                    this.post('/createPaymentOrder/', {
                        access_token: localStorage.getItem("accessToken"),
                        reservationRecordId : this.orderInfo.reservationRecordId,
                        payChannel:3009,
                        memberId:this.orderInfo.personid
                    })
                        .then((res) => {
                            if(res.orderNum){
                                utils.alipayOrder(res.orderNum)
                            }
                            //endPayPhone(res.orderNum)
                        })
                }*/

                let _this=this
                w.confirm('是否确认支付', function () {
                        console.log('yes',_this.orderInfo)
                        utils.createPaymentOrder(_this,_this.reservationRecordId, _this.orderInfo.personid)
                        // this.$router.push({name:"payResult"})
                    },
                    function () {
                        console.log('no')
                    }
                );
            },
            //亲情号类型转换
            convertType(type){
                return utils.relType(type);
            },
            //颜色转换
            convertColor(lockNumberType,status,payStatus){
                //未支付
                if((!payStatus && lockNumberType==0 && status==1) || (payStatus==0 || status==2)){
                    return "#FF5157"
                }
                //已取消
                if(status==6){
                    return "#A1A1A1"
                }
                //支付成功
                if(payStatus==2 || status==7){
                    return "#56E52E"
                }
            },
            //亲情号类型转换
            convertPayType(type){
                console.log('type',type)
                return utils.payType(type);
            },
            //倒计时计算
            countDown(lockNumberType,status,payStatus){
                /**
                 * lockNumberType
                 * 锁号取消类别 0未知 1主动放弃 2支付超时'
                 * status
                 * 0 全部;1 锁号成功;2 正在支付; 3 待就诊;4 已完成;5 已退号;6 支付失败;7 支付成功;
                 * 未支付：126
                 * 已成功：347
                 * 已取消：5
                 * payStatus
                 * 支付状态 0未支付|1已支付|2支付失败|3已退款
                 * */
                console.log("lockNumberType",lockNumberType)
                console.log("status",status)
                console.log("payStatus",payStatus)
                
                //倒计时
                const countDownStart=()=>{
                    /*let timerEnd=new Date(this.orderInfo.lockNumTime).getTime() +  10* 60 * 1000;//倒计时结束时间
                    //如果倒计时结束时间大于当前时间
                    let time=parseInt((timerEnd-new Date().getTime())/1000);   //时间差的毫秒数
                    if(timerEnd>new Date().getTime()){
                        console.log("大于,结束")
                    }*/
                    let time=this.orderInfo.residueTime;
                    if(time<0)return;
                    let _this=this;
                    this.timer = setInterval(() => {
                        this.countDownTime = countDown(time--);
                        // console.log(this.countDownTime);
                        if(time < 0) {
                            console.log('count-down end');
                            _this.countDownTime = "";
                            _this.reservationRecordsInfo()
                            _this.clearTimer();
                        }
                    }, 1000);
                }
               //返回倒计时计算
                const countDown = (second) => {
                    const s = second % 60;
                    const m = Math.floor(second / 60);
                    return `${`00${m}`.slice(-2)}:${`00${s}`.slice(-2)}`;
                };
                if(!payStatus && lockNumberType==0 && status==1){
                    countDownStart()
                }else if(status==2){
                    countDownStart()
                }
            },
            //清空倒计时
            clearTimer(){
                clearInterval(this.timer)
            }
        },
        props: [],
        created() {
            console.log(this.$route.query)
        },
        mounted() {
            this.reservationRecordId= this.$route.query.reservationRecordId

            this.reservationRecordsInfo()
        },
        watch: {},
        filter: {},
        //页面销毁时
        destroyed(){
           this.clearTimer()
        },
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";
    .OrderDetails{
        height: 100%;
        overflow-y: scroll;
        .flex-title{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .weui-cell{
            padding: 13px;
            /*.weui-label{
                width: auto;
                margin-right: 20px;
            }*/
        }
        .btn-group{
            padding: 43px;
            .weui-btn{
                width: 100%;
                padding: 11.5px;
            }
            .btn-cancel{
                border: 1px solid #31BAF7;
                background: transparent;
                color: #31BAF7;
            }
            
        }
       
    }
</style>
