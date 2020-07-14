<!--绑定医保卡号-->
<template>
    <div class="BindCard">
        <div class="weui-cells weui-cells_form ">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">姓名:</label></div>
                <div class="weui-cell__bd">{{userInfo.name}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">身份证号:</label></div>
                <div class="weui-cell__bd">{{userInfo.cardNum}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">手机号:</label></div>
                <div class="weui-cell__bd">{{userInfo.phone}}</div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">就诊卡号:</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" v-model="treatmentCard" type="text" placeholder="请输入就诊卡号">
                </div>
            </div>
        </div>
        <div class="btn-group">
            <a href="javascript:;" class="weui-btn btn-primary" :disabled="btnCodeStatus" @click="btnSubmit">立即绑定</a>
        </div>

    </div>

</template>
<script>
    const w = window.weui;
    export default {
        name: "BindCard",
        data() {
            return {
                userInfo: {},
                treatmentCard: "",
                btnCodeStatus: false,//按钮状态

            }
        },
        methods: {
            //修改用户信息
            btnSubmit() {
                this.btnCodeStatus = true
                let data = {
                    access_token: localStorage.getItem("accessToken"),
                    treatmentCard: this.treatmentCard
                }
                this.post('/updateMembers/', data)
                    .then(res => {
                        console.log(res)
                        if (!res) {
                            this.edit = false
                            w.toast('绑定成功', 2000);
                            this.btnCodeStatus = false;
                            this.$router.push({name: "hospital"});

                        } else {
                            w.topTips(res.message);
                            this.btnCodeStatus = false;
                        }
                    })

            }
        },
        props: [],
        created() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
        },
        mounted() {

        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/public";

    .BindCard {
        .btn-group {
            width: 100%;
            padding: 20px;

            .weui-btn {
                width: 100%;
                padding: 12px 24px;
            }

            .flex-bottom {
                margin-top: 40px;
            }
        }
    }

</style>
