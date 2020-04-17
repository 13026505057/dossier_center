import Vue from 'vue'
import Router from 'vue-router'

import login from './view/login/login'
import tabIndex from './view/home/index'
import homeScreen from './view/home/homeScreen'
import dossierScreen from './view/home/dossierScreen'
import myReminder from './view/home/myReminder'
import reminderList from './view/home/reminderList'
import addCaseInfo from './view/home/addCaseInfo'
import queryCase from './view/home/queryCase'
// 在库管理_全部
import allCaseIn from './view/managementIn/allCaseIn'
// 在库管理_暂存区 
import temporaryCaseIn from './view/managementIn/temporaryCaseIn'
// 在库管理_永久保存区
import sealUpCaseIn from './view/managementIn/sealUpCaseIn'
import querySetting from './view/home/querySetting'
// 盘点管理
import stockControl from './view/home/stockControl'
// 温湿度传感器_系统设置
import setTHCALC from './view/system/setTHCALC'
// 楼宇设置_系统设置
import setBuilding from './view/system/setBuilding'
// 楼宇设置_系统设置
import setFloor from './view/system/setFloor'
// 批复状态_出库管理
import caseStatus from './view/managementOut/caseStatus'
// 案卷借阅_出库管理
import caseBorrowing from './view/managementOut/caseBorrowing'
// 出库管理_案卷归还
import caseReturn from './view/managementOut/caseReturn'
// 案卷借阅详情_出库管理
import caseAppDetail from './view/managementOut/caseAppDetail'
// 案件列表_待入库信息
import caseWaiting from './view/home/caseWaiting'
// 案件列表_应入库信息
import caseReceived from './view/home/caseReceived'
// 主办民警_图表统计
import policeMan from './view/chartCensus/policeMan'
// 柜使用状态_图表统计
import statusUseCoil from './view/chartCensus/statusUseCoil'
// 案卷状态_图表统计
import statisticsCase from './view/chartCensus/statisticsCase'
// 案卷出入库_图表统计
import statusOurIn from './view/chartCensus/statusOurIn'
// 告警类型_图表统计
import statisticsAlarm from './view/chartCensus/statisticsAlarm'
// 存储资源_图表统计
import statisticsStorage from './view/chartCensus/statisticsStorage'

// 区域设置_系统设置
import setAreaLine from './view/system/setAreaLine'
import setDepartment from './view/system/setDepartment'
import setOperator from './view/system/setOperator'
import setProcessMode from './view/system/setProcessMode'
import setCamera from './view/system/setCamera'
import setAIO from './view/system/setAIO'
import setPreservation from './view/system/setPreservation'
import setJurisdiction from './view/system/setJurisdiction'
import setStorageDevice from './view/system/setStorageDevice'
import setApprovalLine from './view/system/setApprovalLine'
// 告警设置
import setWarning from './view/system/setWarning'

Vue.use(Router)

// 防止点击同一页面报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'tabIndex',
      component: tabIndex,
      redirect: '/homeScreen',
      children: [
        {
          path: 'homeScreen',
          component: homeScreen,
          meta: {
            navigationBarTitleText: '首页'
          }
        },
        {
          path: 'dossierScreen',
          component: dossierScreen,
          meta: {
            navigationBarTitleText: '卷宗概况'
          }
        },
        {
          path: 'myReminder',
          component: myReminder,
          meta: {
            navigationBarTitleText: '我的催办'
          }
        },
        {
          path: 'reminderList',
          component: reminderList,
          meta: {
            navigationBarTitleText: '催办记录'
          }
        },
        {
          path: 'addCaseInfo',
          component: addCaseInfo,
          meta: {
            navigationBarTitleText: '资料新增'
          }
        },
        {
          path: 'queryCase',
          component: queryCase,
          meta: {
            navigationBarTitleText: '卷宗查询'
          }
        },
        {
          path: 'allCaseIn',
          component: allCaseIn,
          meta: {
            navigationBarTitleText: '在库管理_全部'
          }
        },
        {
          path: 'temporaryCaseIn',
          component: temporaryCaseIn,
          meta: {
            navigationBarTitleText: '在库管理_暂存'
          }
        },
        {
          path: 'sealUpCaseIn',
          component: sealUpCaseIn,
          meta: {
            navigationBarTitleText: '在库管理_封存'
          }
        },
        {
          path: 'querySetting',
          component: querySetting,
          meta: {
            navigationBarTitleText: '操作记录'
          }
        },
        {
          path: 'caseBorrowing',
          component: caseBorrowing,
          meta: {
            navigationBarTitleText: '案卷借阅'
          }
        },
        {
          path: 'statusUseCoil',
          component: statusUseCoil,
          meta: {
            navigationBarTitleText: '卷柜使用状态'
          }
        },
        {
          path: 'setDepartment',
          component: setDepartment,
          meta: {
            navigationBarTitleText: '部门设置'
          }
        },
        {
          path: 'setOperator',
          component: setOperator,
          meta: {
            navigationBarTitleText: '添加操作员'
          }
        },
        {
          path: 'setProcessMode',
          component: setProcessMode,
          meta: {
            navigationBarTitleText: '物品处理方式'
          }
        },
        {
          path: 'setCamera',
          component: setCamera,
          meta: {
            navigationBarTitleText: '摄像头设置'
          }
        },
        {
          path: 'setAIO',
          component: setAIO,
          meta: {
            navigationBarTitleText: '一体机设置'
          }
        },
        {
          path: 'setPreservation',
          component: setPreservation,
          meta: {
            navigationBarTitleText: '物品保全室设置'
          }
        },
        {
          path: 'setJurisdiction',
          component: setJurisdiction,
          meta: {
            navigationBarTitleText: '权限设置'
          }
        },
        {
          path: 'setStorageDevice',
          component: setStorageDevice,
          meta: {
            navigationBarTitleText: '智能存储设备设置'
          }
        },
        {
          path: 'setApprovalLine',
          component: setApprovalLine,
          meta: {
            navigationBarTitleText: '审批流设置'
          }
        },
        {
          path: 'setWarning',
          component: setWarning,
          meta: {
            navigationBarTitleText: '警告设置'
          }
        },
        {
          path: 'stockControl',
          component: stockControl,
          meta: {
            navigationBarTitleText: '盘点设置'
          }
        },
        {
          path: 'setTHCALC',
          component: setTHCALC,
          meta: {
            navigationBarTitleText: '温湿度传感器设置'
          }
        },
        {
          path: 'caseStatus',
          component: caseStatus,
          meta: {
            navigationBarTitleText: '批复状态'
          }
        },
        {
          path: 'caseWaiting',
          component: caseWaiting,
          meta: {
            navigationBarTitleText: '待入库信息'
          }
        },
        {
          path: 'caseReceived',
          component: caseReceived,
          meta: {
            navigationBarTitleText: '应入库信息'
          }
        },
        {
          path: 'setBuilding',
          component: setBuilding,
          meta: {
            navigationBarTitleText: '楼宇设置'
          }
        },
        {
          path: 'setFloor',
          component: setFloor,
          meta: {
            navigationBarTitleText: '楼层设置'
          }
        },
        {
          path: 'caseReturn',
          component: caseReturn,
          meta: {
            navigationBarTitleText: '案卷归还'
          }
        },
        {
          path: 'policeMan',
          component: policeMan,
          meta: {
            navigationBarTitleText: '办案民警统计'
          }
        },
        {
          path: 'statisticsCase',
          component: statisticsCase,
          meta: {
            navigationBarTitleText: '案卷状态统计'
          }
        },
        {
          path: 'statusOurIn',
          component: statusOurIn,
          meta: {
            navigationBarTitleText: '案卷出入库统计'
          }
        },
        {
          path: 'statisticsAlarm',
          component: statisticsAlarm,
          meta: {
            navigationBarTitleText: '告警类型统计'
          }
        },
        {
          path: 'statisticsStorage',
          component: statisticsStorage,
          meta: {
            navigationBarTitleText: '存储资源统计'
          }
        },
        {
          path: 'caseAppDetail',
          component: caseAppDetail,
          meta: {
            navigationBarTitleText: '借阅申请详情'
          }
        },
        {
          path: 'setAreaLine',
          component: setAreaLine,
          meta: {
            navigationBarTitleText: '区域设置'
          }
        }
      ]
    }
  ],
  // mode:'history',
  base: __dirname
})
