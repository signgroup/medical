<template>

    <div class="Kinship">
        <div v-if="familyList.length">
            <div class="weui-panel border-radius" v-for="(item,index) in familyList" :key="index">
                <div class="weui-panel__hd ">
                    <p>{{item.name}}
                        <small>{{convertType(item.relType)}}</small>
                    </p>
                    <div class="icon-del" v-if="!edit" @click="deleteFamily(item)">
                        <i class="iconfont icon-shanchu" style="color: #B3B3B3;"></i>
                    </div>
                </div>
                <div class="weui-panel__bd">
                    <div class="weui-media-box weui-media-box_small-appmsg">
                        <div class="weui-cells">
                            <div class="weui-cell weui-cell_access weui-cell_example" @click="jumpFamily(item)">
                                <div class="weui-cell__bd weui-cell_primary">
                                    <p><span>手机号：</span><span>{{item.phone}}</span></p>
                                    <p><span>身份证号：</span><span>{{item.cardNum}}</span></p>
                                    <p><span>病案号：</span><span>{{item.treatmentCard}}</span></p>
                                </div>
                                <span class="weui-cell__ft" v-if="!edit"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="noting">
            <div class="nodata">
                <img src="./../../assets/img/img-family-not.png" alt="">
            </div>
            <div>暂无亲情号，赶紧添加吧~</div>
        </div>
        <div class="weui-flex btn-primary bottombar">
            <a :href="'#/my/addFamily?disable='+disable" class="weui-flex__item a">
                添加亲情号
            </a>
        </div>
    </div>

</template>
<script>
    import utils from './../../assets/js/utils'

    const w = window.weui;
    export default {
        name: "Kinship",
        data() {
            return {
                edit: true,//是否可修改
                disable: false,
                familyList: [],//亲情号列表
            }
        },
        methods: {
            //获取亲情号
            getFamily() {
                let data = {
                    access_token: localStorage.getItem("accessToken"),
                    containSelf: this.edit
                }
                this.post('/getFamilyMembers/', data)
                    .then((res) => {
                        if (res.length) {
                            this.familyList = res
                        }else{
                            this.familyList =[]

                        }
                    })
            },
            //解绑亲情号
            deleteFamily(item) {
                let _this = this
                w.confirm('是否删除此条亲情号', function () {
                    let data = {
                        access_token: localStorage.getItem("accessToken"),
                        memberId: item.memberId
                    }
                    console.log(_this.post)
                    _this.post('/deleteFamilyMembers/', data)
                        .then((res) => {
                            if (!res) {
                                w.toast('删除成功', 2000);
                                _this.getFamily()
                            }
                        })
                });
            },
            //亲情号类型转换*
            convertType(type) {
                return utils.relType(type);
            },
            //修改亲情号
            jumpFamily(item) {
                console.log(item)
                console.log(typeof this.disable)
                if (this.edit) {
                    this.$router.push({name: "order", query: item});
                } else {
                    this.$router.push({name: "addFamily", query: item});
                }
            },
        },
        props: [],
        created() {
            this.disable = this.$route.query.disable
            console.log(this.disable)
            // console.log(typeof this.$route.query.disable)
            if (this.$route.query.disable === "true") {
                this.edit = false
            } else {
                //无脑测试需要加
                this.edit = true
            }
            // console.log(this.edit)
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
            this.getFamily()
        },
        watch: {},
        filter: {}
    }
</script>

<style lang="less" scoped>
    .Kinship {
        height: 100%;
        overflow-y: scroll;
        padding: 10px 15px 55px;

        .border-radius {
            border-radius: 8px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        }

        .weui-panel__hd {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            height: 41px;

            &:after {
                left: 10px;
                right: 10px;
            }
        }

        .bottombar {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            height: 45px;

            > a {
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .noting {
            display: flex;
            align-items: center;
            flex-direction: column;
            color: #CACACA;
            height: 100%;
            justify-content: center;
            font-size: 16px;

            .nodata {
                width: 246px;
                margin-bottom: 33px;
            }
        }
    }
</style>
