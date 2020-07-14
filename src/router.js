/* eslint-disable no-empty */
import Vue from 'vue'
import Router from 'vue-router'
// import store from './store'
//import Login from './views/Login/Login'
//import Forgot from './views/Login/Forgot'

import Hospital from './views/Home/Hospital'
// const Hospital = () => import(/* webpackChunkName: "16" */ './views/Home/Hospital')

import Register from './views/Login/Register'
// const Register = () => import(/* webpackChunkName: "0" */ './views/Login/Register')

import Department from './views/Home/Department'
// const Department = () => import(/* webpackChunkName: "1" */ './views/Home/Department')

import Rday from './views/Home/Rday'
// const Rday = () => import(/* webpackChunkName: "2" */ './views/Home/Rday')

import Doctor from './views/Home/Doctor'
// const Doctor = () => import(/* webpackChunkName: "3" */ './views/Home/Doctor')

import My from './views/My/My'
// const My = () => import(/* webpackChunkName: "4" */ './views/My/My')

import Profile from './views/My/Profile'
// const Profile = () => import(/* webpackChunkName: "5" */ './views/My/Profile')

import Standard from './views/My/Standard'
// const Standard = () => import(/* webpackChunkName: "6" */ './views/My/Standard')

import FamilyList from './views/My/FamilyList'
// const FamilyList = () => import(/* webpackChunkName: "7" */ './views/My/FamilyList')

import AddFamily from './views/My/AddFamily'
// const AddFamily = () => import(/* webpackChunkName: "8" */ './views/My/AddFamily')

import OrderList from './views/My/OrderList'
// const OrderList = () => import(/* webpackChunkName: "9" */ './views/My/OrderList')

import BindCard from './views/My/BindCard'
// const BindCard = () => import(/* webpackChunkName: "10" */ './views/My/BindCard')

import FamilyCode from './views/My/FamilyCode'
// const FamilyCode = () => import(/* webpackChunkName: "11" */ './views/My/FamilyCode')

import Order from './views/Order/Order'
// const Order = () => import(/* webpackChunkName: "12" */ './views/Order/Order')

import OrderDetails from './views/Order/OrderDetails'
// const OrderDetails = () => import(/* webpackChunkName: "13" */ './views/Order/OrderDetails')

import PayResult from './views/Order/PayResult'
// const PayResult = () => import(/* webpackChunkName: "14" */ './views/Order/PayResult')

import goPay from './views/Order/GoPay'
// const goPay = () => import(/* webpackChunkName: "15" */ './views/Order/GoPay')

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: 'hospital'
        },
        /*{
            path: '/login',
            name: 'login',
            component: Login
        },*/
        /*{
            path: '/forgot',
            name: 'forgot',
            component: Forgot
        },*/
        {
            path: '/register',
            name: 'register',
            component: Register
        },

        {
            path: '/hospital',
            name: 'hospital',
            component: Hospital
        },
        {
            path: '/department',
            name: 'department',
            meta: {
                requireAuth: true
            },
            component: Department
        },
        {
            path: '/rday',
            name: 'rday',
            // 需要登录才能进入的页面可以增加一个meta属性
            meta: {
                requireAuth: true
            },
            component: Rday
        },
        {
            path: '/doctor',
            name: 'doctor',
            meta: {
                requireAuth: true
            },
            component: Doctor
        },
        {
            path: '/my',
            name: 'my',
            meta: {
                requireAuth: true
            },
            component: My
        },
        {
            path: '/my/profile',
            name: 'profile',
            meta: {
                requireAuth: true
            },
            component: Profile
        },
        {
            path: '/my/standard',
            name: 'standard',
            meta: {
                requireAuth: true
            },
            component: Standard
        },
        {
            path: '/my/family',
            name: 'family',
            meta: {
                requireAuth: true
            },
            component: FamilyList
        },
        {
            path: '/my/orderList',
            name: 'orderList',
            meta: {
                requireAuth: true
            },
            component: OrderList
        },
        {
            path: '/my/bindCard',
            name: 'BindCard',
            meta: {
                requireAuth: true
            },
            component: BindCard
        }, {
            path: '/my/familyCode',
            name: 'FamilyCode',
            meta: {
                requireAuth: true
            },
            component: FamilyCode
        },
        {
            path: '/my/addFamily',
            name: 'addFamily',
            meta: {
                requireAuth: true
            },
            component: AddFamily
        },
        {
            path: '/order',
            name: 'order',
            meta: {
                requireAuth: true
            },
            component: Order
        },
        {
            path: '/orderDetails',
            name: 'orderDetails',
            meta: {
                requireAuth: true
            },
            component: OrderDetails
        },
        {
            path: '/payResult',
            name: 'payResult',
            meta: {
                requireAuth: true
            },
            component: PayResult
        },
        {
            path: '/gopay',
            name: 'gopay',
            meta: {
                requireAuth: true
            },
            component: goPay
        },

    ]
})
// mode: 'hash',
router.beforeEach((to, from, next) => {
    // 判断是否需要登录权限
    // console.log(store)
    let status = localStorage.getItem("accessToken") ? false : true
    // console.log(status)
    // !store.state.user
    if (to.matched.some(res => res.meta.requireAuth) && status) {
        next('/register')
    } else {
        next()
    }
})
export default router;

