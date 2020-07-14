<template>
    <div class="Forgot">
        <div class="card-pwd" v-if="type==1">
            <ul class="input-box-content">
                <li class="input-box">
                    <label>帐&nbsp;&nbsp;&nbsp;&nbsp;号：</label>
                    <input class="weui-input" type="text" v-model="form.loginName" placeholder="" maxlength="20">
                </li>
                <li class="input-box">
                    <label>手机号：</label>
                    <input class="weui-input" type="number"  v-model="form.phone" pattern="[0-9]*"
                           placeholder="" oninput="value=value.replace(/[^\d]/g,'');if(value.length>11)value=value.slice(0,11)" maxlength="11">
                </li>
            </ul>
            <p class="link-text" style="opacity: 0"><a href="#">忘记密码？</a></p>
            <div class="btn-group">
                <button href="javascript:;" class="weui-btn btn-primary" :disabled="btnDisabled" @click="retrievePassword">找回密码</button>
            </div>
            <p class="link-text link-bottom"><a href="javascript:;"  @click="handelType(2)">使用身份证找回密码</a></p>
        </div>
        <div class="card-pwd" v-else-if="type==2">
            <ul class="input-box-content">
                <li class="input-box">
                    <label>身份证号：</label>
                    <input class="weui-input" v-model="form.cardNum" type="text" placeholder="" maxlength="18"
                           oninput="(this.v=function(){this.value=this.value.replace(/^[a-zA-Z]+\D*|^\d{0,16}[a-zA-Z]+|[^0-9X]/g,'');}).call(this)">
                </li>
                <li class="input-box">
                    <label>姓&nbsp;&nbsp;&nbsp;&nbsp;名：</label>
                    <input class="weui-input" type="text" v-model="form.name" placeholder="">
                </li>
            </ul>
            <p class="link-text" style="opacity: 0"><a href="#">忘记密码？</a></p>
            <div class="btn-group">
                <button href="javascript:;" class="weui-btn btn-primary" :disabled="btnDisabled" @click="retrievePassword">找回密码</button>
            
            </div>
            <p class="link-text link-bottom"><a href="javascript:;" @click="handelType(1)">使用手机号找回密码</a></p>
        
        </div>
    </div>

</template>
<script>
    const w=window.weui;
    export default {
        name: "Forgot",
        data() {
            return {
                type: 1,//登录类型
                btnDisabled: false,//按钮状态
                form:{
                
                }
            }
        },
        methods: {
            //验证文本框
            getVerification() {
                if(this.type===1){
                    if (!this.form.loginName) {
                        w.topTips('请输入注册帐号');
                        this.btnDisabled = false;
                        return;
                    }
                    if (!this.form.phone) {
                        w.topTips('请输入手机号');
                        this.btnDisabled = false;
                        return;
                    }
                    if (this.form.phone.length != 11  || !(/^1[3|5|6|7|8|9][0-9]\d{4,8}$/.test(this.form.phone))) {
                        w.topTips('请输入正确的手机号');
                        this.btnDisabled = false;
                        return;
                    }
                }else if(this.type===2){
                    if (!this.form.cardNum) {
                        w.topTips('请输入身份证号');
                        this.btnDisabled = false;
                        return;
                    }
                    if (!this.form.name) {
                        w.topTips('请输入姓名');
                        this.btnDisabled = false;
                        return;
                    }
                }
               
            },
            //找回密码
            retrievePassword() {
                this.btnDisabled=true;
                this.getVerification();
                if(this.btnDisabled){
                    let data={
                        findType:this.type,
                        ...this.form
                    };
                   if(this.type===2) data.cardType=1
                    
                    this.post('/retrievePassword/',data)
                        .then((res) => {
                            this.btnDisabled=false;
                            if(!res){
                                w.alert('您的手机将会收到新的密码， 请注意查收！');
                                this.form={}
                                this.$router.push({name:'login'})
                            }else{
                                w.topTips(res.message);
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
               
            },
            /*
            * 切换登录
            * type
            * 1 手机号找回
            * 2 身份证找回
            * */
            handelType(type) {
                this.type = type
                this.form={}
            }
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
    @import "./../../assets/less/login";
    
    .Forgot {
        width: 100%;
        padding: 15px;
        position: relative;
        height: 100%;
        .card-login {
            margin-top: 18px;
        }
    }
</style>
