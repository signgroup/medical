<template>
    <div class="Rday">
        <div class="top">
            <div class="top-title">
                <p class="ellipsis-1">科室：{{departmentName}}</p>
                <p class="ellipsis-1">{{dateFormat}} {{week}}</p>
            </div>
            <!--<div class="weui-flex">
                <div v-for="(item,index) in weekData" :key="item.day" @click="handelDate(item.startDate,index)"
                     :class="['weui-flex__item ',weekIndex==index ? 'top_day' :'']">
                    <div>{{item.weekStr}}</div>
                    <div class="today">{{item.day}}</div>
                </div>
            </div>-->
            
            <div class="scroll-box" >
                <div class="date-body">
                    <div v-for="(item,index) in weekData" :key="item.day" @click="handelDate(item.startDate,index)"
                         :class="['day-card',weekIndex==index ? 'top_day' :'']">
                        <div>{{item.weekStr}}</div>
                        <div class="today">{{item.day}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="doctor-list" v-if="doctorsDayList.length">
            <div class="weui-cells">
                <a class="weui-cell weui-cell_access" v-for="(item,index) in doctorsDayList" :key="index" :href="'#/doctor/?scheduleId='+item.scheduleId+'&doctorId='+item.doctorId" >
                    <div class="weui-cell__hd icon-head">
                            <img :src="item.doctorAvatar" alt="">
                    </div>
                    <div class="weui-cell__bd des">
                        <div class="title">
                            {{item.doctorName?item.doctorName:"普通医生"}}
                            <small>{{item.doctorTitle}}</small>
                        </div>
                        <p>{{item.departmentName}}&nbsp;&nbsp;{{item.doctorTitle}}</p></div>
                    <div class="weui-cell__ft">
                        {{item.outTime==="A"?'上午':'下午'}}
                    </div>
                </a>
            </div>
        </div>
        <div class="noting" v-else>
            <img src="./../../assets/img/img-rday-not.png" alt="">
            <p>亲，今天暂无医生坐诊</p>
        </div>
        <Bottom />
    </div>
</template>
<script>
    import Bottom from './../../components/Bottom'

    export default {
        name: "Rday",
        data() {
            return {
                doctorsData: [],//医生列表
                doctorsDayList:[],//获取今日医生
                weekData: [],//日期时间
                schedule: {},//开始日期结束日期
                weekIndex: 0,//日期索引
                departmentName: "",//科室名称
                dateFormat: "",//年月日
                week: "",//星期几
            }
        },
        methods: {
            //更新数组星期
            getWeekDateStr(dayCount) {
                if (null == dayCount) {
                    dayCount = 0;
                }
                //更新数组星期
                //更新数组星期
                let currDateTime = new Date(new Date().setDate(new Date().getDate() + dayCount))
                let cm=(currDateTime.getMonth() + 1)<10?'0'+(currDateTime.getMonth() + 1):(currDateTime.getMonth() + 1)
                let cd=(currDateTime.getDate() + 1)<10?'0'+(currDateTime.getDate() + 1):(currDateTime.getDate() + 1)
                let currDate = `${currDateTime.getFullYear()}-${cm}-${cd}`
                // console.log(new Date(currDateTime.toLocaleDateString()));
                // console.log(currDateTime.toLocaleDateString())
                return {
                    weekStr: "日一二三四五六日一二三四五六日一二三四五六".charAt(new Date().getDay() + dayCount),
                    currDate: currDate,
                    startDate: new Date(currDateTime.toLocaleDateString()),//（n+1）0点标准时间
                    day: currDateTime.getDate()
                };
            },
            //获取日期时间
            getDate() {
                for (let i = 0; i < 14; i++) {
                    this.weekData.push(this.getWeekDateStr(i))
                }
                this.schedule = {
                    startTime: this.getWeekDateStr(0).currDate,
                    endTime: this.getWeekDateStr(13).currDate,
                }
                let date = new Date();
                this.dateFormat = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
                this.week = "星期" + "日一二三四五六日一二三四五六".charAt(new Date().getDay())//每周下标
            },
            //获取医生列表
            async getDoctorsList() {
                let departmentId = this.$route.query.departmentId;
                let hospitalId = this.$route.query.hospitalId;
                await this.post('/schedulesGroupbyDoctor/', {
                    fromDate: this.schedule.startTime,
                    toDate: this.schedule.endTime,
                    departmentId: departmentId,
                    hospitalId: hospitalId,
                    pageIndex:0,
                    pageSize:100
                })
                    .then((res) => {
                        this.doctorsData = res.data;
                        this.handelDate(new Date(this.getWeekDateStr(0).startDate),0)
                        // this.doctorsDayList= this.doctorsData.filter(item => new Date(item.scheduleDate).toString()===row.startDate.toString())
                        // this.doctorsDayList=res.data
                    })
                    
            },
            //点击时间日期
            handelDate(startDate, index) {
                // console.log(startDate,index)
                this.weekIndex = index
                /*this.schedule = {
                    startTime: this.getWeekDateStr(index).currDate,
                    endTime: this.getWeekDateStr(index).currDate,
                }
                 this.getDoctorsList()
                */
               this.doctorsDayList= this.doctorsData.filter(item =>item.scheduleDateTime.toString()===new Date(startDate).getTime().toString())
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
                console.log( this.$store.state)
                console.log("back")
                this.$router.replace({path: '/department',query:this.$store.state.department});

            }
        },
        props: [],
        components:{
            Bottom
        },
        created() {
            //科室名称
            this.departmentName = this.$route.query.departmentName;
            // console.log(this.$route.query)
            this.$store.state.rday=this.$route.query;
        },
        mounted() {
            //获取日期
            this.getDate();
            //获取医生列表
            this.getDoctorsList();
            this.onpopstate()
        },
        watch: {},
        filter: {},
        //页面销毁时，取消监听。否则其他vue路由页面也会被监听
        destroyed(){
            window.removeEventListener("popstate", this.closeViews, false);
        },
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";
    
    .Rday {
        .top {
            .top-title {
                color: #31BAF7;
                font-size: 15px;
                padding: 13px 15px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 2px solid rgba(239, 239, 239, 1);;
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
            .weui-flex {
                text-align: center;
                padding: 5px;
                color: #444;
                .weui-flex__item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    div:first-child {
                        font-size: 13px;
                        margin-bottom: 5px;
                    }
                    div:last-child {
                        font-size: 15px;
                        &.today {
                            width: 29px;
                            height: 29px;
                            line-height: 29px;
                            border-radius: 8px;
                            transition: all .2s;
                            border: 1px solid #fff;
                            
                        }
                    }
                    
                }
                .top_day {
                    div:last-child {
                        &.today {
                            border: 1px solid rgba(248, 51, 88, 1);
                        }
                    }
                }
            }
            
            .scroll-box{
                width: 100%;
                overflow-x: scroll;
                text-align: center;
                padding: 5px;
                color: #444;
                .date-body{
                    width: 200%;
                    .day-card{
                        width: 52px;
                        height: 53px;
                        float: left;
                        .today {
                            width: 29px;
                            height: 29px;
                            line-height: 29px;
                            border-radius: 8px;
                            transition: all .2s;
                            border: 1px solid #fff;
                            margin: 0 auto;
                        }
                    }
                    .top_day{
                        .today {
                            border: 1px solid #f83358;
                        }
                    }
                   
                    &:after{
                        content: '';
                        display: block;
                        clear: both;
                    }
                }
    
                &::-webkit-scrollbar-track-piece {
                    background-color: #31BAF7;
                    border: 1px solid #ccc;
                }
                &::-webkit-scrollbar {
                    -webkit-border-radius: 5px;
                    -moz-border-radius: 5px;
                    border-radius: 5px;
                    height: 1px;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: #31BAF7;
                    background-clip: padding-box;
                }
                &::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 0, 0, 0.5);
                }
            }
        }
        
        .doctor-list {
            height: 100vh;
            overflow-y: scroll;
            padding-bottom: 174px;
            .weui-cells {
                .icon-head {
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    display: flex;
                    justify-items: center;
                    align-items: center;
                    border-radius: 4px;
                }
                .des {
                    padding-left: 10px;
                    .title {
                        color: #444;
                        font-size: 15px;
                    }
                    p {
                        color: #999;
                        font-size: 12px;
                    }
                }
            }
        }
        .noting {
            width: 100%;
            padding: 73px 56px;
            text-align: center;
            > p {
                margin-top: 33px;
                color: #CACACA;
            }
        }
    }
</style>
