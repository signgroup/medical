/**
 * # 市民通正式
 # https://thirdparty.nbpitech.com/nbyl2/        市民通前端正式
 # https://thirdparty.nbpitech.com/ylgh2/        市民通后端正式

 # 市民通测试
 # https://thirdparty.nbpitech.com/nbyl2test/        市民通前端测试
 # https://thirdparty.nbpitech.com/ylgh2test/        市民通后端测试

 # 余姚正式
 # https://web.yy-smy.com/nbyl2/     余姚前端正式
 # https://web.yy-smy.com/ylgh2/     余姚后端正式

 # 余姚测试
 # https://web.yy-smy.com/nbyl2test/     余姚前端测试
 # https://web.yy-smy.com/ylgh2test/     余姚后端测试
 */
 /**新地址*
 * 访问地址
 * https://thirdparty.nbpitech.com/nbyl2_new/
 * https://thirdparty.nbpitech.com/nbyl2test_new/
 * https://web.yy-smy.com/nbyl2_new/
 * https://web.yy-smy.com/nbyl2test_new/
 * 打包地址
 * https://thirdparty.nbpitech.com/ylgh2_new/
 * https://thirdparty.nbpitech.com/ylgh2test_new/
 * https://web.yy-smy.com/ylgh2_new/
 * https://web.yy-smy.com/ylgh2test_new/
 *
 *
 *
 * */

// const url = 'https://thirdparty.nbpitech.com/ylgh2/v1/regv1'
console.log(process.env.NODE_ENV)

console.log(window.location)

const convertURL=href=>{
    // console.log(href)
    /*if(href.includes('/')){
        return 'https://thirdparty.nbpitech.com/ylgh2/v1/regv1'
    }*/
    if(href.includes('thirdparty.nbpitech.com/nbyl2_new/')){
        return 'https://thirdparty.nbpitech.com/ylgh2_new/v1/regv1'
    }
    if(href.includes('thirdparty.nbpitech.com/nbyl2test_new/')){
        return 'https://thirdparty.nbpitech.com/ylgh2test_new/v1/regv1'
    }
    if(href.includes('web.yy-smy.com/nbyl2_new/')){
        return 'https://web.yy-smy.com/ylgh2_new/v1/regv1'
    }
    if(href.includes('web.yy-smy.com/nbyl2test_new/')){
        return 'https://web.yy-smy.com/ylgh2test_new/v1/regv1'
    }
}

let url=convertURL(window.location.href)
// console.log(url)
/*
* 开发 development
* 生产 production
* */
// export const {apiUrl: process.env.NODE_ENV === 'production' ? url : '/api'}
export const apiUrl= process.env.NODE_ENV === 'production' ? url : '/api'


