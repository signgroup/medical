const relType=(value)=>{
    // console.log(value)
    //亲情号类型转换
    var str = ""
    switch (parseInt(value)) {
        case 0:
            str = "本人";
            break;
        case 1:
            str = "父亲";
            break;
        case 2:
            str = "母亲";
            break;
        case 3:
            str = "配偶";
            break;
        case 4:
            str = "儿子";
            break;
        case 5:
            str = "女儿";
            break;
        default:
            str = "其他";
            break;
    }
    return str;
}
const payType=(value)=>{
    // console.log(value)
    //亲情号类型转换
    var str = ""
    switch (parseInt(value)) {
        case 0:
            str = "全部";
            break;
        case 1:
            str = "锁号成功";
            break;
        case 2:
            str = "正在支付";
            break;
        case 3:
            str = "待就诊";
            break;
        case 4:
            str = "已完成";
            break;
        case 5:
            str = "已退号";
            break;
        case 6:
            str = "支付失败";
            break;
        case 7:
            str = "支付成功";
            break;
        default:
            str = "未知状态";
            break;
    }
    return str;
}


const createPaymentOrder=(_this,reservationRecordId,personid)=>{
    //跳转支付宝支付
    const alipayOrder=(orderNum)=>{
        let data = {
            pay_num:orderNum,
            access_token: localStorage.getItem("accessToken"),
        }
        _this.post('/alipay/', data)
            .then((res) => {
                console.log(res)
                if(res.pay_url){
                    window.location.href=res.pay_url
                }else{
                    _this.$router.path({name: "payResult", query: {payStatus:'error'}})
                }
            })
    }

    _this.post('/createPaymentOrder/', {
        access_token: localStorage.getItem("accessToken"),
        reservationRecordId : reservationRecordId,
        payChannel:3009,
        memberId:personid
    })
        .then((res) => {
            if(res.orderNum){
                alipayOrder(res.orderNum)
            }
            //endPayPhone(res.orderNum)
        })
}

export default {
    relType,
    payType,
    createPaymentOrder
}
