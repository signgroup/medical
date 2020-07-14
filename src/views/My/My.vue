<template>
    <div class="My">
        <div class="top">
            <div class="img-head"><img src="https://static1.nbpitech.com/nbyl/src/assets/image/avatar.jpg" alt=""></div>
            <p>{{userInfo.name}}</p>
        </div>
        <div class="weui-cells menus"><a href="#/my/profile" class="weui-cell weui-cell_access">
            <div class="weui-cell__hd"><i class="iconfont icon-yonghuxinxi"></i></div>
            <div class="weui-cell__bd"><p>个人资料</p></div>
            <div class="weui-cell__ft"></div>
        </a> <a href="#/my/family?disable=true" class="weui-cell weui-cell_access">
            <div class="weui-cell__hd"><i class="iconfont icon-qinqinghao" style="margin-right: 8px;"></i></div>
            <div class="weui-cell__bd"><p>我的亲情号</p></div>
            <div class="weui-cell__ft"></div>
        </a> <a href="#/my/orderList" class="weui-cell weui-cell_access">
            <div class="weui-cell__hd"><i class="iconfont icon-yuyuejilu1"></i></div>
            <div class="weui-cell__bd"><p>预约记录</p></div>
            <div class="weui-cell__ft"></div>
        </a> <a href="#/my/standard" class="weui-cell weui-cell_access">
            <div class="weui-cell__hd"><i class="iconfont icon-wenhao"></i></div>
            <div class="weui-cell__bd"><p>挂号规范</p></div>
            <div class="weui-cell__ft"></div>
        </a></div>
    </div>

</template>
<script>
    export default {
        name: "My",
        data() {
            return {
                userInfo: {}
            }
        },
        methods: {},
        props: [],
        created() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"))

        },
        mounted() {

        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    .My {
        .top {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fff;
            height: 134px;
            box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.1);
            .img-head {
                width: 70px;
                height: 70px;
                img {
                    border-radius: 50%;
                }
            }
            p {
                margin-top: 11px;
                color: #444;
            }
        }
        .menus {
            margin-top: 20px;
            .weui-cell {
                font-size: 15px;
                color: #444;
                .iconfont {
                    font-size: 24px;
                    color: #3CBBF5;
                    margin-right: 10px;
                }
                .icon-yonghuxinxi {
                    font-size: 16px;
                }
            }
        }
        
    }
</style>
