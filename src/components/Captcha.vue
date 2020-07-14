<template>
    <div class="Captcha">
        <!--弹出层-->
        <div class="mask" v-if="imgData">
            <div class="plate-box">
                <img :src="imgData" alt="" @click="clickImage">
                <div id="clickPoints" style="height:0;width:0;float:left;" ref="plate"></div>
            </div>
            <div class="button-sparea">
                <a href="javascript:;" @click="closeMask" class="weui-btn weui-btn_mini weui-btn_warn">取消</a>
                <a href="javascript:;" @click="refreshImg" class="weui-btn weui-btn_mini weui-btn_default">刷新</a>
                <a href="javascript:;" @click="imgSubmit" class="weui-btn weui-btn_mini weui-btn_primary">提交</a>
            </div>
        </div>
    </div>
    
</template>
<script>
    /* eslint-disable no-undef */

    export default {
        name: "Captcha",
        data() {
            return {
                captchaValue:"",
            }
        },
        methods: {
            //刷新
            refreshImg(){
                this.captchaValue="";
                this.$emit("sendRefresh",true);
            },
            //点击图片验证码获取位置
            clickImage(e) {
                if (this.captchaValue) this.captchaValue += ";";
                this.captchaValue += e.offsetX + "," + e.offsetY;
                let point = e.offsetX + "," + e.offsetY;
                let {x, y} = {x: e.offsetX - 10, y: e.offsetY - 10};
                let _this = this;
                $(`<div style="width:20px;height:20px;line-height:20px;position:absolute; left:${x}px; top:${y}px; color:red;  cursor:grabbing;"><img src="https://static1.nbpitech.com/nbyl/src/assets/image/logo.png" alt=""></div>`)
                    .click(function () {
                        $(this).remove();
                        console.log(_this.captchaValue)
                        _this.captchaValue = _this.captchaValue.replace(point, "").replace(/(^\;)|(\;$)|\s/g, "").replace(/\;{2,}/g, ",");
                    })
                    .appendTo("#clickPoints");
                // console.log(this.captchaValue)

            },
            //关闭弹框
            closeMask() {
                this.captchaValue="";
                $("#clickPoints").html("");
                this.$emit("sendCaptchaClose",this.captchaValue);
            },
            //图片确认
            imgSubmit(){
                if(!this.captchaValue){
                    weui.topTips('请点击选择验证码');
                    return;
                }
                this.$emit("sendCaptchaValue",this.captchaValue);
            }
        },
        props: ["imgData","captchaKey"],
        created() {
            // console.log(this.$props)

        },
        mounted() {
        },
        watch: {
            imgData() {
                this.captchaValue=""
            }
        },
        filter: {}
    }
</script>

<style lang="less" scoped>
    .Captcha{
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .6);
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            .plate-box {
                width: 290px;
                height: 180px;
                position: relative;
                .plate-click {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                }
            }
            .button-sparea {
                .weui-btn {
                    margin-right: 10px;
                }
            }
        
        }
    
    }
</style>
