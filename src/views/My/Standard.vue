<template>
    <div class="Standard">
        <div class="page__bd">
            <article class="weui-article">
                <h1>宁波市民通预约挂号用户服务规范</h1>
                <h2 class="title">用户注册</h2>
                <section>
                    <p>
                        平台实行实名制预约挂号，用户必须提供真实有效个 人身份信息（包括就诊卡号、姓名、身份证号、手机 号等）完成注册后才能使用预约挂号服务。
                    </p>
                    <h3 class="title">特殊情况</h3>
                    <p>
                        1.移动手机用户需要开通移动梦网功能才能接收平台 发送的短信，已完成预约挂号。
                    </p>
                    <p>
                        2.使用宁波外手机号注册无法正常预约
                    </p>
                </section>
                <h2 class="title">放号规则</h2>
                <section>
                    <p>
                        每天中午12:00时，平台提前8天开放预约号源
                    </p>
                </section>
            </article>
        </div>
    </div>

</template>
<script>
    export default {
        name: "Standard",
        data() {
            return {}
        },
        methods: {},
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
    
    .Standard {
        .weui-article {
            p {
                color: #999;
                margin: 0;
            }
            
        }
        .title {
            margin-top: 10px;
        }
        
    }
</style>
