<template>
    <div class="Hospital">
        <div class=" weui-search-bar weui-flex searchBar">
            <div class="top_title"> 选择医院</div>
            <div class="weui-flex__item">
                <form class="weui-search-bar__form" action="javascript:void 0">
                    <div class="weui-search-bar__box">
                        <i class="weui-icon-search"></i>
                        <input type="text"
                               id="searchInput"
                               required="required"
                               placeholder="请输入医院名称"
                               v-model="hospitalName"
                               ref="refSearch"
                               @keyup.13="searchValue"
                               class="weui-search-bar__input"
                        >
                        <!--@keyup.enter="searchValue"-->
                        <a href="javascript:" class="weui-icon-clear" @click="searchClear"></a></div>
                </form>
                <a href="javascript:" id="searchCancel" class="weui-search-bar__cancel-btn">取消</a>
            </div>
        </div>
        <div class="scroll-view">
            
            <pull-to :top-load-method="refresh" :bottom-load-method="infinite" :bottom-config="BOTTOM_DEFAULT_CONFIG"
                     :is-bottom-bounce="!isLoad">
                <div class="weui-cells">
                    <a v-for="(item,index) in hospitalsData" :href="'#/department?hospitalId='+item.hospitalId"
                       class="weui-cell selecty" :key="index">
                        <div class="weui-cell__bd"><p>
                            <span>{{item.hospitalName.length>20?item.hospitalName.substring(0,20)+"...":item.hospitalName}} </span>
                            <span v-if="item.hospitalLevel" class="weui-badge">{{item.hospitalLevel}}</span></p></div>
                    </a>
                </div>
            
            </pull-to>
        
        </div>
        
        <Bottom/>
    </div>

</template>
<script>
    import Bottom from './../../components/Bottom'
    import SmtApi from "smtapi";

    export default {
        name: "Hospital",
        data() {
            return {
                BOTTOM_DEFAULT_CONFIG: {
                    pullText: "加载中",
                    triggerText: "加载中",
                    loadingText: "加载中",
                    doneText: "加载中",
                    failText: "加载失败",
                    loadedStayTime: 300,
                    stayDistance: 50,
                    triggerDistance: 50,
                    list: ""
                },
                hospitalName: '',//医院名称搜索字段
                hospitalsData: [],//医院列表
                pageIndex: 0,//当前页
                pageSize: 20,//每页显示条数
                num: 20,
                isLoad: false,
                info: {},//接收url参数（市民通返回）
            }
        },
        methods: {
            //上拉刷新
            refresh(loaded) {
                this.paramsInit();
                console.log(loaded)
                this.getHospitalsList(0, this.pageSize, loaded);

            },
            //下拉加载
            infinite(loaded) {
                // console.log('loaded',loaded)
                this.getHospitalsList(this.pageIndex, this.pageSize, loaded);
            },
            //获取医院列表
            getHospitalsList(pageIndex, pageSize, loaded) {
                let data = {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                };
                if (this.hospitalName.trim()) {
                    data.hospitalName = this.hospitalName.trim();
                }
                this.post('/hospitalsList/', data)
                    .then((res) => {
                        /*
                        * 余姚 >=this.num
                        * 首次返回数据是this.num+5
                        * */
                        if (res.data.length >= this.num) {
                            this.pageIndex += 1
                            this.isLoad = false
                        } else {
                            this.isLoad = true
                        }
                        if (this.hospitalsData.length) {
                            this.hospitalsData = this.hospitalsData.concat(res.data)
                        } else {
                            this.hospitalsData = res.data
                        }
                        if (loaded) loaded('done');
                    })
                    .catch(() => {
                        if (loaded) loaded('done');
                    })
            },
            //清空搜索框
            searchClear() {
                this.paramsInit();
                this.hospitalName = '';
                this.getHospitalsList(1, this.pageSize);
            },
            //搜索单独处理
            searchValue() {
                this.$refs.refSearch.blur();
                this.paramsInit();
                this.getHospitalsList(1, this.pageSize);
            },
            //参数初始化
            paramsInit() {
                this.isLoad = false;
                this.pageIndex = 0;
                this.hospitalsData = [];
            },
            //免密登录
            avoidSecretLogin() {
                this.post('/avoidSecretLogin/', this.info)
                    .then((res) => {
                        if (res.accessToken) {
                            localStorage.setItem("accessToken", res.accessToken);
                            localStorage.setItem("refreshToken", res.refreshToken);
                            this.refresh();
                            getMembers(res.accessToken);
                        }
                        /*else {
                            this.$router.push({name: "register"});
                        }*/
                    })

                //获取用户信息
                const getMembers = access_token => {
                    this.post('/getMembers/', {
                        access_token: access_token
                    })
                        .then((res) => {
                            console.log(res)
                            /*if (!res.treatmentCard) {
                                this.$router.push({path: "/my/bindCard"});
                            }*/
                            localStorage.setItem("userInfo", JSON.stringify(res));
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            // 监听历史记录点, 添加返回事件监听
            onpopstate() {
                // 给window添加一个popstate事件，拦截返回键，执行this.closeViews事件，addEventListener需要指向一个方法
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', this.closeViews, false);//false阻止默认事件
                }
            },
            closeViews() {
                console.log("退出app");
                sessionStorage.clear();
                localStorage.clear();
                SmtApi.closeTheView();
                return false;
            }
        },
        props: [],
        components: {
            Bottom
        },
        created() {
            this.info = this.$route.query;
            console.log(this.info)
            this.$store.state.hospital = this.info
        },
        mounted() {
            //免密登录
            this.avoidSecretLogin();
            this.onpopstate()
        },
        watch: {},
        filter: {},
        destroyed() {
            // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
            console.log("destroyed")
            window.removeEventListener("popstate", this.closeViews, false);

        }
    }
</script>
<style lang="less" scoped>
    @import "./../../assets/less/home";
    
    .searchBar {
        z-index: 999;
    }
</style>


