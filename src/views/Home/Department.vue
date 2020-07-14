<template>
    <div class="Department">
        <div class=" weui-search-bar weui-flex searchBar">
            <div class="top_title"> 选择科室</div>
            <div class="weui-flex__item">
                <form class="weui-search-bar__form"  action="javascript:void 0">
                    <div class="weui-search-bar__box">
                        <i class="weui-icon-search"></i>
                        <input type="text"
                               id="searchInput"
                               placeholder="请输入科室名称"
                               required="required"
                               v-model="departmentName"
                               @keyup.13="searchValue"
                               ref="refSearch"
                               class="weui-search-bar__input">
                        <a href="javascript:" @click="searchClear" class="weui-icon-clear"></a></div>
                </form>
                <a href="javascript:" id="searchCancel" class="weui-search-bar__cancel-btn">取消</a></div>
        </div>
        <div class="scroll-view">
            <pull-to :top-load-method="refresh" :bottom-load-method="infinite" :is-bottom-bounce="!isLoad">
            <div class="weui-cells">
                <a class="weui-cell selecty" v-for="(item,index) in departmentsData" :key="index" :href="'#/rday?departmentId='+item.departmentId+'&hospitalId='+hospitalId+'&departmentName='+item.departmentName" >
                    <div class="weui-cell__bd"><p>{{item.departmentName }}</p></div>
                </a>
            </div>
            </pull-to>
        </div>
        <Bottom />
    </div>

</template>
<script>
    import Bottom from './../../components/Bottom'
    export default {
        name: "Department",
        data() {
            return {
                departmentsData:[],//科室列表
                departmentName:"",//科室搜索
                hospitalId:"",
                pageIndex: 0,//当前页
                pageSize: 20,//每页显示条数
                num: 20,
                isLoad: false,
            }
        },
        methods: {
            //上拉刷新
            refresh(loaded) {
                this.paramsInit();
                this.getDepartmentsList(1, this.pageSize, loaded);
            },
            //下拉加载
            infinite(loaded) {
                    this.getDepartmentsList(this.pageIndex, this.pageSize, loaded);
            },
            //搜索单独处理
            searchValue(){
                this.$refs.refSearch.blur();
                this.paramsInit();
                this.getDepartmentsList(1,this.pageSize);
            },
            //根据医院获取科室列表
            getDepartmentsList(pageIndex, pageSize, loaded) {
                /*console.log(pageIndex)
                console.log(pageSize)*/
                this.hospitalId = this.$route.query.hospitalId
                let data={
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    hospitalId:  this.hospitalId
                }
                if (this.departmentName.trim()) {
                    data.departmentName  = this.departmentName.trim();
                }
                this.post('/departmentsList/', data)
                    .then((res) => {
                        // console.log(res)
                        if (res.length == this.num) {
                            this.pageIndex += 1
                            this.isLoad = false
                        } else {
                            this.isLoad = true
                        }
                        if (this.departmentsData.length) {
                            this.departmentsData = this.departmentsData.concat(res)
                        } else {
                            this.departmentsData = res
                        }
                        if(loaded)loaded('done');
                    })
                    .catch(()=>{
                        if(loaded)loaded('done');
                    })
            },
            //清空搜索框
            searchClear() {
                this.paramsInit();
                this.departmentName = '';
                
                this.getDepartmentsList(1,this.pageSize);
            },
            //参数初始化
            paramsInit(){
                this.pageIndex=0
                this.isLoad = false
                this.departmentsData=[]
            },
            // 监听历史记录点, 添加返回事件监听
            onpopstate () {
                // 给window添加一个popstate事件，拦截返回键，执行this.closeViews事件，addEventListener需要指向一个方法
                // window.addEventListener("popstate", this.closeViews, false);
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', this.closeViews, false);//false阻止默认事件
                }
            },
            closeViews () {
               console.log("已经返回医院列表")
                this.$router.replace({path: '/hospital',query:this.$store.state.hospital});
            }
        },
        props: [],
        components:{
            Bottom
        },
        created() {
            this.refresh()
            this.$store.state.department=this.$route.query
            console.log(this.$store)
        },
        mounted() {
            this.onpopstate()
        },
        watch: {},
        filter: {},
        destroyed () {
            // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
            console.log("destroyed")
            console.log("科室返回")
            window.removeEventListener("popstate", this.closeViews, false);

        }
    }
</script>

<style lang="less" scoped>
    @import "./../../assets/less/home";
</style>
