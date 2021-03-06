/*
 * @Author: your name
 * @Date: 2020-04-15 19:09:06
 * @,@LastEditTime: ,: 2020-10-24 17:34:03
 * @,@LastEditors: ,: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dossier_center\src\assets\api\request.js
 */ 
import axios from "axios";
import qs from "qs";
import router from '@/router'
import { message } from 'ant-design-vue';

const service = axios.create({
    // baseURL: 'http://106.12.68.167:80',  // api的base_url 
//    baseURL: 'http://192.168.2.98:8888',
    baseURL: 'http://56.212.7.252:80',
    // baseURL: 'http://localhost:8080',
    timeout: 30000  // 请求超时时间.
})

service.interceptors.request.use(config => {
    sessionStorage.setItem('baseURL',config.baseURL)
    if (sessionStorage.getItem("token")) {
        config.headers['kf-token'] = sessionStorage.getItem("token");
    }
    config.method === 'post' 
        ? config.data = qs.stringify(config.data)
        : config.params = {...config.params};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return config;
}, error => {  //请求错误处理
    Promise.reject(error);
})
service.interceptors.response.use(
    response => {  //成功请求到数据
        //这里根据后端提供的数据进行对应的处理
        if (response.data.code == '0') {
            //请求成功
            return response.data;
        }else if(response.data.code == '402'){
            //登录超时
            setTimeout(()=>{
                message.info('登录超时, 请重新登录');
            },1000)
            setTimeout(()=>{
                router.push('./login')
            },3000)
            
        }else if(response.data.code == '500'){
            message.info('操作异常或信息填写错误，请重新再试一次');
        }else {
            message.info(response.data.msg);
        }
    },
    error => {  //响应错误处理
        return Promise.reject(error)
    }
)

export default service;
