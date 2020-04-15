import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        roleData: [],
        //数据统计
        lesortData_in: {},  //入库卷宗
        lesortData_out: {},  //出库卷宗
        lesortData_outIn: {}, //出入库统计
        lesortData_dept: {},  //部门
        lesortData_police: {}, //办案民警
        lesortData_type: {},  //案件类型统计_扇形
        lesortData_typeHis: {},  //案件类型统计_柱状图
        lesortData_criminal: {},  //刑事案件
        lesortData_administra: {},  //行政案件

        lesortData_alarm: {},  //警告类型统计_扇形
        lesortData_alarmHis: {},  //警告类型统计_柱状图
        lesortData_cabinet: {},  //柜子使用资源统计
    },
    mutations: {
        setOpenKeysTab(state,newValue){
            state.roleData = newValue;
        },
        // 入库统计
        setLosort_in(state,newValue){
            state.lesortData_in = newValue;
        },
        // 出库统计
        setLosort_out(state,newValue){
            state.lesortData_out = newValue;
        },
        // 出入库统计
        setLosort_outIn(state,newValue){
            state.lesortData_outIn = newValue;
        },
        //部门人员_饼状图
        setLosort_dept(state,newValue){
            state.lesortData_dept = newValue;
        },
        setLosort_police(state,newValue){
            state.lesortData_police = newValue;
        },
        setLosort_type(state,newValue){
            state.lesortData_type = newValue;
        },
        setLosort_typeHis(state,newValue){
            state.lesortData_typeHis = newValue;
        },
        // 刑事类型统计
        setLosort_criminal(state,newValue){
            state.lesortData_criminal = newValue;
        },
        // 行政类型统计
        setLosort_administra(state,newValue){
            state.lesortData_administra = newValue;
        }, 
        // 警告类型统计_扇形
        setLosort_alarm(state,newValue){
            state.lesortData_alarm = newValue;
        },
        //警告类型统计_柱状图
        setLosort_alarmHis(state,newValue){
            state.lesortData_alarmHis = newValue;
        },
        //柜子使用统计_柱状图
        setLosort_cabinet(state,newValue){
            state.lesortData_cabinet = newValue;
        },
    },
    actions: {
        setOpenKeysTab(data,newValue){
            data.commit('setOpenKeysTab',newValue)
        },
        // 入库统计
        setLosort_in(data,newValue){
            data.commit('setLosort_in',newValue);
        },
        // 出库统计
        setLosort_out(data,newValue){
            data.commit('setLosort_out',newValue);
        },
        setLosort_outIn(data,newValue){
            data.commit('setLosort_outIn',newValue);
        },
        //部门人员_饼状图
        setLosort_dept(data,newValue){
            data.commit('setLosort_dept',newValue);
        },
        setLosort_police(data,newValue){
            data.commit('setLosort_police',newValue);
        },
        setLosort_type(data,newValue){
            data.commit('setLosort_type',newValue);
        },
        setLosort_typeHis(data,newValue){
            data.commit('setLosort_typeHis',newValue);
        },
        // 刑事类型统计
        setLosort_criminal(data,newValue){
            data.commit('setLosort_criminal',newValue);
        },
        // 行政类型统计
        setLosort_administra(data,newValue){
            data.commit('setLosort_administra',newValue);
        },
        // 警告类型统计_扇形
        setLosort_alarm(data,newValue){
            data.commit('setLosort_alarm',newValue);
        },
        //警告类型统计_柱状图
        setLosort_alarmHis(data,newValue){
            data.commit('setLosort_alarmHis',newValue);
        },
        //柜子使用统计_柱状图
        setLosort_cabinet(data,newValue){
            data.commit('setLosort_cabinet',newValue);
        },
    }
})