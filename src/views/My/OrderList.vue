<template>
    <div class="OrderList">
        <pull-to :top-load-method="refresh" :bottom-load-method="infinite" :is-bottom-bounce="!isLoad">
            <ul class="preview" v-if="preview.length">
                <li v-for="(item,index) in preview" :key="index" @click="orderDetails(item)">
                    <div class="preview__hd">
                        <label>
                            <span class="name">{{item.patientName}} </span>
                            <small>{{convertType(item.relType)}}</small>
                        </label>
                        <label>
                            挂号序号：{{item.num}}号
                        </label>
                    </div>
                    <div class="preview__bd">
                        <div class="preview-text">
                            <p class="ellipsis-1">科室：{{item.departmentName}}</p>
                            <p class="ellipsis-1">医院：{{item.hospitalName}}</p>
                            <p class="ellipsis-1">预约时间：{{item.scheduleDate}}</p>
                        </div>
                        <div class="icon-status"
                             :style="'align-items: '+orderStatus(item.lockNumberType,item.status,item.payStatus)">
                            <img src="https://static1.nbpitech.com/nbyl/src/assets/image/ytype.png"/>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-else class="noting">
                <div class="nodata">
                    <img src="https://static1.nbpitech.com/nbyl/src/assets/image/nodata.png" alt="">
                </div>
                <div>亲，您没有预约记录~</div>
            </div>
        </pull-to>
    </div>

</template>
<script>
    import utils from './../../assets/js/utils'

    export default {
        name: "OrderList",
        data() {
            return {
                preview: [],//订单列表
                pageIndex: 1,//当前页
                pageSize: 20,//每页显示条数
                num: 20,
                isLoad: false,
            }
        },
        methods: {
            //上拉刷新
            refresh(loaded) {
                console.log(loaded)
                this.pageIndex = 1
                this.isLoad = false
                this.preview = []
                this.getOrderList(1, this.pageSize, loaded);
            },
            //下拉加载
            infinite(loaded) {
                this.getOrderList(this.pageIndex, this.pageSize, loaded);
            },
            //跳转订单详情
            orderDetails(item) {
                // console.log(item)
                this.$router.push({name: "orderDetails", query: {reservationRecordId: item.reservationRecordId}})
            },
            //获取订单列表
            getOrderList(pageIndex, pageSize, loaded) {
                let data = {
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    access_token: localStorage.getItem("accessToken"),
                    status: 0
                }
                this.post('/reservationRecordsList/', data)
                    .then((res) => {
                        // console.log(res.data)
                        if (res.data.length == this.num) {
                            this.pageIndex += 1
                            this.isLoad = false
                        } else {
                            this.isLoad = true
                        }
                        if (this.preview.length) {
                            this.preview = this.preview.concat(res.data)
                        } else {
                            this.preview = res.data
                        }
                        if (loaded) loaded('done');
                    })
                    .catch(() => {
                        if (loaded) loaded('done');
                    })
            },
            //亲情号类型转换
            convertType(type) {
                return utils.relType(type);
            },
            //订单状态
            orderStatus(lockNumberType, status, payStatus) {
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
                /*console.log("lockNumberType",lockNumberType)
                console.log("status",status)
                console.log("payStatus",payStatus)*/
                
                var str = ""
                /*
                * flex-start 已成功
                * center 未支付
                * flex-end 已取消
                * */
                //未支付状态
                const unpaid = lockNumberType => {
                    if (lockNumberType == 1 || lockNumberType == 2) {
                        //已取消
                        str = "flex-end";
                    } else if (lockNumberType == 0) {
                        //未支付
                        str = "center";
                    }
                }

                if (payStatus == 1 && (status==3 || status==4 || status==7)) {
                    //成功
                    str = "flex-start";
                } else if (payStatus == 0 || payStatus == 2) {
                    //未支付
                    unpaid(lockNumberType)
                } else if (payStatus == 3 || (payStatus == 1 && status==5)) {
                    //失败
                    str = "flex-end";
                } else {
                    //没有支付状态
                    unpaid(lockNumberType)
                }
                console.log(str)
                return str;
            }
        },
        props: [],
        created() {

        },
        mounted() {
            let mask = document.getElementsByClassName("weui-mask")[0];
            let picker = document.getElementsByClassName("weui-dialog")[0];
            console.log(mask)
            console.log(picker)
            if (mask && picker) {
                // this.$router.go(0);
                var a = document.getElementsByClassName('weui-dialog__btn_default')[0]
                a.click(function (e) {
                    console.log(e)
                })
            }
            this.refresh()
        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";
    
    .OrderList {
        overflow-y: scroll;
        height: 100%;
        padding: 10px 15px;
        .preview {
            li {
                background: #fff;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                margin-bottom: 13px;
                font-size: 13px;
                color: #343434;
                padding: 10px;
                overflow: hidden;
                .preview__hd {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #EFEFEF;
                    height: 40px;
                    .name {
                        margin-right: 10px;
                    }
                }
                .preview__bd {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    height: 93px;
                    .preview-text {
                        padding: 10px 0;
                        flex: 1;
                        p {
                            margin-top: 5px;
                        }
                    }
                    .icon-status {
                        width: 55px;
                        height: 55px;
                        overflow: hidden;
                        display: flex;
                        img {
                            width: 100%;
                        }
                    }
                }
            }
        }
        
    }
</style>
