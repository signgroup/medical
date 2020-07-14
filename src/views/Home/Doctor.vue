<template>
    <div class="Doctor">
        <pull-to :top-load-method="refresh" :is-bottom-bounce="false">
        <div class="top">
            <div class="top-title">
                <p class="ellipsis-1">科室：{{doctorInfoData.departmentName}}</p>
                <p class="ellipsis-1" @click="getIntroduce">医生介绍</p>
            </div>
            <div class="top-body">
                <div class="introduce">
                    <img
                    :src="doctorInfoData.doctorAvatar?doctorInfoData.doctorAvatar:require('./../../assets/img/img-doctor-hand.png')"
                    alt="" class="avatar">
                </div>
                <p class="d-name">
                    {{doctorInfoData.doctorName?doctorInfoData.doctorName:"普通医生"}}
                    <small>{{doctorInfoData.doctorTitle}}</small>
                </p>
                <p :class="['text-detailed', ellipsis?'ellipsis-3':'']" @click="ellipsis=!ellipsis">
                    {{doctorInfoData.doctorIntroduction}}
                </p>
            </div>
        </div>
        <div class="doctor-content">
            <div class="weui-cells__title">看诊时间</div>
            <div class="time-list-box">
                <div class="weui-cells time-list">
                    <div class="weui-cell weui-flex">
                        <div class="weui-flex__item"><h4>
                            {{formatDateTime(doctorInfoData.scheduleDateTime,doctorInfoData.outTime)}}&nbsp;</h4>
                            <p>挂号费： <span class="txtRed">{{doctorInfoData.regFee?doctorInfoData.regFee:0}}元</span></p>
                            <p v-if="doctorInfoData.clinicFee">诊疗费：<span class="txtRed">{{doctorInfoData.clinicFee}}元</span></p>
                        </div>
                        <div class="flex-right">
                            <div class="ellipsis-1">剩余号源:<span class="txtRed">{{doctorInfoData.residualNums}}</span>
                            </div>
                            <div>
                                <button
                                :class="['weui-btn weui-btn_mini  ',colorSwitch(doctorInfoData.status)]"
                                :disabled="doctorInfoData.status=='预约'?false:true"
                                @click="btnSubmit(doctorInfoData)">
                                    {{doctorInfoData.status}}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </pull-to>
        <Bottom />
        <div class="mask animate-fade-in" v-if="introduceStatus"></div>
        <div class="dialog animate-fade-in" v-if="introduceStatus">
            <p class="dialog__hd">医生介绍</p>
            <div class="dialog__bd">
                {{doctorIntroduction}}
            </div>
            <div class="dialog__fd" @click="introduceStatus=false">
                确定
            </div>
        </div>
    </div>

</template>
<script>
    import Bottom from './../../components/Bottom'
    export default {
        name: "Doctor",
        data() {
            return {
                introduceStatus: false,//医生介绍
                scheduleId: "",//排班唯一标识
                doctorInfoData: {},//医生详细
                doctorIntroduction:"",//医生介绍内容
                ellipsis:true,//医生简介文字
            }
        },
        methods: {
            //上拉刷新
            refresh(loaded) {
                this.getDoctorInfo(loaded);
            },
            //医生介绍弹框
            getIntroduce() {
            this.post('/doctorInfo/', {
                doctorId : this.$route.query.doctorId
                })
                    .then((res) => {
                        this.introduceStatus = true;
                        this.doctorIntroduction=res.doctorIntroduction
                    })
            },
            //获取医生详情
           getDoctorInfo(loaded) {
                 this.post('/getSchedulesbyInfo/', {
                    scheduleId: this.scheduleId,
                    memberId: JSON.parse(localStorage.getItem("userInfo")).memberId,
                    access_token: localStorage.getItem("accessToken"),
                })
                    .then((res) => {
                        this.doctorInfoData = res;
                        if(loaded)loaded('done');
                    })
                     .catch(()=>{
                         if(loaded)loaded('done');
                     })
            },
            //格式化日期时间拼接
            formatDateTime(date, time) {
                // console.log(date)
                if(!date)return
                let d = new Date(date);
                let currDate = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
                let weekStr = "周" + "日一二三四五六日一二三四五六".charAt(d.getDay());
                let t = time === "A" ? "上午" : "下午"
                return currDate + " " + weekStr + " " + t
            },
            //按钮颜色转换
            colorSwitch(str) {
                // console.log(str)
                let color = ""
                switch (str) {
                    case "预约":
                        color = "btn-primary"
                        break;
                    case "已预约":
                        color = "btn-default"
                        break;
                    case "已满":
                        color = "btn-error"
                        break;
                    default:
                        color = "btn-error"
                }
                return color
            },
            //预约提交
            btnSubmit(data) {
                //console.log(data)
                sessionStorage.setItem("doctorDetails",JSON.stringify({scheduleId:this.scheduleId,doctorId:this.$route.query.doctorId, ...data}))
                this.$router.push({name: 'order',query:{init:true}});
            },
            // 监听历史记录点, 添加返回事件监听
            onpopstate () {
                // 给window添加一个popstate事件，拦截返回键，执行this.closeViews事件，addEventListener需要指向一个方法
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', this.closeViews, false);//false阻止默认事件
                }
            },
            closeViews () {
                console.log("back")
                this.$router.replace({path: '/rday',query:this.$store.state.rday});
            }
        },
        components:{
            Bottom
        },
        props: [],
        created() {
            // let mask = document.getElementsByClassName("weui-mask")[0];
            // let picker = document.getElementsByClassName("weui-picker")[0];
            // if (mask && picker) {
            //     this.$router.go(0);
            // }
            this.scheduleId = this.$route.query.scheduleId;
            //console.log()
            this.$store.state.doctor=this.$route.query
        },
        mounted() {
            let mask = document.getElementsByClassName("weui-mask")[0];
            let picker = document.getElementsByClassName("weui-picker")[0];
            console.log(mask)
            console.log(picker)
            if (mask && picker) {
                // this.$router.go(0);
                var a = document.getElementsByClassName('weui-icon-btn_close')[0]
                a.click(function (e) {
                    console.log(e)
                })
            }
            this.getDoctorInfo();
            this.onpopstate()
        },
        watch: {},
        filter: {},
        //页面销毁时，取消监听。否则其他vue路由页面也会被监听
        destroyed(){

            window.removeEventListener('popstate', this.closeViews, false);
        },
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";

    .Doctor {
        height: 100%;
        overflow-y: scroll;
        .top {
            padding-bottom: 10px;
            .top-title {
                color: #31BAF7;
                font-size: 15px;
                padding: 13px 15px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                p {
                    flex: 1;
                    &:first-child {
                        text-align: left;
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
            .top-body {
                padding: 0 15px;
                text-align: center;
                .introduce {
                    img {
                        border-radius: 50%;
                        width: 70px;
                        height: 70px;
                        display: inline-block;
                    }

                }
                .d-name {
                    color: #444;
                    font-size: 15px;
                    margin-top: 10px;
                }
                .text-detailed {
                    margin-top: 10px;
                    font-size: 11px;
                    color: #999;
                    text-align: left;
                }
            }
        }
        .doctor-content {
            .time-list-box {
                overflow-y: scroll;
            }
            .time-list {
                margin-bottom: 50px;
                .weui-cell {
                    padding: 10px 15px;
                    font-size: 13px;
                    p {
                        margin-top: 6px;
                    }
                    .txtRed {
                        color: #F83358;
                    }
                    .flex-right {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        justify-content: space-between;
                        width: 91px;
                        div:last-child {
                            width: 100%;
                        }
                        .weui-btn {
                            width: 100%;
                            margin-top: 10px;
                        }
                    }
                }
            }
        }
        .mask {
            background: rgba(0, 0, 0, .6);
            position: fixed;
            z-index: 1000;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
        }
        .dialog {
            position: fixed;
            z-index: 5000;
            top: 50%;
            left: 16px;
            right: 16px;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            background-color: #fff;
            text-align: center;
            border-radius: 3px;
            overflow: hidden;
            font-size: 14px;
            .dialog__hd {
                color: #343434;
                font-weight: 800;
                font-size: 18px;
                padding: 15px;
            }
            .dialog__bd {
                max-height: 60vh;
                overflow-y: scroll;
                padding: 20px;
            }
            .dialog__fd {
                color: #31BAF7;
                font-size: 18px;
                padding: 11px;
                border-top: 1px solid rgba(239, 239, 239, 1);;
            }
        }
        .animate-fade-in {
            -webkit-animation: c ease .3s forwards;
            animation: c ease .3s forwards;
        }

        .ellipsis-3 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            word-break: break-all;
            white-space: normal !important;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }
</style>
