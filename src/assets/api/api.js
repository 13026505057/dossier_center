import service from './request'

export default {
    //登录 
    loginData(data){
        return service({
            url: '/juanzong/user/user/login',
            method: 'post',
            data
        })
    },
    //修改个人信息
    upUserDataInfo(data){
        return service({
            url: '/juanzong/user/user/updatePassWord',
            method: 'post',
            data
        })
    },
    //卷宗操作记录
    getCaseLogList_Page(data){
        return service({
            url: '/juanzong/dossier/dossier-log/getByPage',
            method: 'post',
            data
        })
    },
    //删除操作日志
    deleteLogData(data){
        return service({
            url: '/juanzong/dossier/dossier-log/del',
            method: 'post',
            data
        }) 
    },
    //获取需审批列表_分页
    getApproveList_Page(data){
        return service({
            url: '/juanzong/user/user-flow-approve-user/getMyApproveByPage',
            method: 'post',
            data
        }) 
    }, 
    //操作审批(是否同意)
    setApproveData(data){
        return service({
            url: '/juanzong/user/user-flow-approve-user/approve',
            method: 'post',
            data
        }) 
    },
    //提交借阅申请
    addAppOutData(data){
        return service({
            url: '/juanzong/user/user-flow-dossier/add',
            method: 'post',
            data
        }) 
    },
    //案件分页查询
    getCaseList_Page(data){
        return service({
            url: '/juanzong/cases/cases/getByPage',
            method: 'post',
            data
        })
    },  
    //库存卷宗分页查询
    getStockCaseList_Page(data){
        return service({
            url: '/juanzong/stock/stock/getByCaseByPage',
            method: 'post',
            data
        })
    },
    //卷宗分页查询
    getQueryCaseList_Page(data){
        return service({
            url: '/juanzong/juanzong/juanzong/getByPage',
            method: 'post',
            data
        })
    },
    //卷宗全部查询
    getQueryCaseList(data){
        return service({
            url: '/juanzong/juanzong/juanzong/get',
            method: 'post',
            data
        })
    },
    //获取条形码code
    getBarCodeInfo(data){
        return service({
            url: '/juanzong/juanzong/juanzong/get_code',
            method: 'post',
            data
        })
    },
    //留存视频查询
    getVideoList_Page(data){
        return service({
            url: '/juanzong/video/video/get',
            method: 'post',
            data
        })
    }, 
    //部门设置查询_分页
    getDepartmentList_Page(data){
        return service({
            url: '/juanzong/dept/dept/getByPage',
            method: 'post',
            data
        }) 
    },
    //部门列表_所有
    getDepartmentList(data){
        return service({
            url: '/juanzong/dept/dept/get',
            method: 'post',
            data
        }) 
    },
    //移除部门
    deleteDepartment_Page(data){
        return service({
            url: '/juanzong/dept/dept/del',
            method: 'post',
            data
        })
    },
    //新增部门
    addDepartment_Page(data){
        return service({
            url: '/juanzong/dept/dept/add',
            method: 'post',
            data
        }) 
    },
    //机构列表_所有
    getOrganList(data){
        return service({
            url: '/juanzong/org/org/get',
            method: 'post',
            data
        }) 
    },
    //获取操作员列表
    getOperatorList_Page(data){
        return service({
            url: '/juanzong/user/user/getByPage',
            method: 'post',
            data
        }) 
    },
    //获取操作员列表(全部)
    getOperatorListData(data){
        return service({
            url: '/juanzong/user/user/get',
            method: 'post',
            data
        }) 
    },
    //新增操作员
    addOperatorData(data){
        return service({
            url: '/juanzong/user/user/add',
            method: 'post',
            data
        })
    },
    //修改操作员
    editOperatorData(data){
        return service({
            url: '/juanzong/user/user/update',
            method: 'post',
            data
        })
    },
    //删除操作员
    deleteOperator_Page(data){
        return service({
            url: '/juanzong/user/user/del',
            method: 'post',
            data
        })
    },  
    //获取角色列表
    getRoleList(data){
        return service({
            url: '/juanzong/role/role/getByPage',
            method: 'post',
            data
        })
    },
    //新增角色列表
    addRoleData(data){
        return service({
            url: '/juanzong/role/role/add',
            method: 'post',
            data
        }) 
    },
    //修改角色
    editRoleData(data){
        return service({
            url: '/juanzong/role/role/update',
            method: 'post',
            data
        }) 
    },
    //删除角色
    deleteRoleData(data){
        return service({
            url: '/juanzong/role/role/del',
            method: 'post',
            data
        }) 
    },
    //获取所有审批流类型列表
    getApproveTypeData(data){
        return service({
            url: '/juanzong/flowType/get',
            method: 'post',
            data
        }) 
    },
    //获取所有审批流程类型列表
    getApproveLineTypeData(data){
        return service({
            url: '/juanzong/flowApproveType/get',
            method: 'post',
            data
        })
    }, 
    //获取审批流列表
    getApproveFlowList_Page(data){
        return service({
            url: '/juanzong/org/org-flow/getByPage',
            method: 'post',
            data
        })
    }, 
    //删除审批流
    deleteApproveFlowData(data){
        return service({
            url: '/juanzong/org/org-flow/del',
            method: 'post',
            data
        }) 
    }, 
    //增加审批流
    addApproveFlowData(data){
        return service({
            url: '/juanzong/org/org-flow/add',
            method: 'post',
            data
        }) 
    },
    //修改审批流
    editApproveFlowData(data){
        return service({
            url: '/juanzong/org/org-flow/update',
            method: 'post',
            data
        }) 
    },
    //获取审批流程列表
    getApproveList(data){
        return service({
            url: '/juanzong/org/org-flow-approve/get',
            method: 'post',
            data
        })
    },
    //删除审批流程
    deleteApproveData(data){
        return service({
            url: '/juanzong/org/org-flow-approve/del',
            method: 'post',
            data
        }) 
    },
    //增加审批流程
    addApproveData(data){
        return service({
            url: '/juanzong/org/org-flow-approve/add',
            method: 'post',
            data
        }) 
    },
    //修改审批流程
    editApproveData(data){
        return service({
            url: '/juanzong/org/org-flow-approve/update',
            method: 'post',
            data
        }) 
    },
    //获取审批人列表
    getApproveSelfList(data){
        return service({
            url: '/juanzong/org/org-flow-approve-user/get',
            method: 'post',
            data
        })
    }, 
    //新增审批人
    addApproveManData(data){
        return service({
            url: '/juanzong/org/org-flow-approve-user/add',
            method: 'post',
            data
        })
    },
    //修改审批人
    editApproveManData(data){
        return service({
            url: '/juanzong/org/org-flow-approve-user/update',
            method: 'post',
            data
        })
    },
    //获取权限组列表
    getPowerList(data){
        return service({
            url: '/juanzong/group/getByPage',
            method: 'post',
            data
        })
    },
    //获取楼列表_分页
    getLocationList_Page(data){
        return service({
            url: '/juanzong/location/location/getByPage',
            method: 'post',
            data
        }) 
    },
    //添加楼宇信息
    addLocationData(data){
        return service({
            url: '/juanzong/location/location/add',
            method: 'post',
            data
        }) 
    },
    //添加楼宇信息
    editLocationData(data){
        return service({
            url: '/juanzong/location/location/update',
            method: 'post',
            data
        }) 
    },
    //删除楼宇信息
    deleteLocationData(data){
        return service({
            url: '/juanzong/location/location/del',
            method: 'post',
            data
        }) 
    },
    //获取保全室列表
    getRoomList_Page(data){
        return service({
            url: '/juanzong/room/room/getByPage',
            method: 'post',
            data
        }) 
    },
    //获取全部保全室列表
    getRoomListData(data){
        return service({
            url: '/juanzong/room/room/get',
            method: 'post',
            data
        }) 
    },
    //新增保全室列表
    addRoomData(data){
        return service({
            url: '/juanzong/room/room/add',
            method: 'post',
            data
        })
    },
    //修改保全室列表
    editRoomData(data){
        return service({
            url: '/juanzong/room/room/update',
            method: 'post',
            data
        }) 
    },
    //删除保全室列表
    deleteRoomData(data){
        return service({
            url: '/juanzong/room/room/del',
            method: 'post',
            data
        }) 
    }, 
    //获取区域列表
    getAreaLineData_Page(data){
        return service({
            url: '/juanzong/line/line/getByPage',
            method: 'post',
            data
        }) 
    },
    //获取区域列表
    getAreaLineData(data){
        return service({
            url: '/juanzong/line/line/get',
            method: 'post',
            data
        }) 
    },
    //新增区域
    addAreaLineData(data){
        return service({
            url: '/juanzong/line/line/add',
            method: 'post',
            data
        }) 
    },
    //新增区域
    editAreaLineData(data){
        return service({
            url: '/juanzong/line/line/update',
            method: 'post',
            data
        }) 
    },
    //删除区域
    deleteAreaLineData(data){
        return service({
            url: '/juanzong/line/line/del',
            method: 'post',
            data
        }) 
    },
    //获取存储设备列表
    getDeviceList_Page(data){
        return service({
            url: '/juanzong/shale/shale/getByPage',
            method: 'post',
            data
        }) 
    },
    //获取所有存储设备列表
    getDeviceList(data){
        return service({
            url: '/juanzong/shale/shale/get',
            method: 'post',
            data
        }) 
    },
    // 查询全部楼宇 
    getBuildAllData(data){
        return service({
            url: '/juanzong/location/location/get',
            method: 'post',
            data
        })
    },
    // 查询楼层信息
    getFloorData_Page(data){
        return service({
            url: '/juanzong/floor/floor/getByPage',
            method: 'post',
            data
        })
    }, 
    // 查询楼层信息
    editFloorData(data){
        return service({
            url: '/juanzong/floor/floor/update',
            method: 'post',
            data
        })
    },
    // 新增楼层信息
    addFloorData(data){
        return service({
            url: '/juanzong/floor/floor/add',
            method: 'post',
            data
        })
    },
    // 查询楼层信息
    deleteFloorData(data){
        return service({
            url: '/juanzong/floor/floor/del',
            method: 'post',
            data
        })
    },
    //获取摄像头列表
    getCameraList_Page(data){
        return service({
            url: '/juanzong/camera/camera/getByPage',
            method: 'post',
            data
        })
    },
    //获取全部摄像头列表
    getCameraListData(data){
        return service({
            url: '/juanzong/camera/camera/get',
            method: 'post',
            data
        })
    },
    //新增摄像头列表
    addCameraData(data){
        return service({
            url: '/juanzong/camera/camera/add',
            method: 'post',
            data
        })
    },
    //修改摄像头列表
    editCameraData(data){
        return service({
            url: '/juanzong/camera/camera/update',
            method: 'post',
            data
        }) 
    },
    //移除摄像头列表
    deleteCameraData(data){
        return service({
            url: '/juanzong/camera/camera/del',
            method: 'post',
            data
        })
    }, 
    //移除摄像头列表
    systemLogList_Page(data){
        return service({
            url: '/juanzong/sys/sys-operate-log/getByPage',
            method: 'post',
            data
        })
    },
    //告警设置列表
    getWarnList_Page(data){
        return service({
            url: '/juanzong//warnGuize/getByPage',
            method: 'post',
            data
        })
    },
    //告警设置列表
    editWarnDataInfo(data){
        return service({
            url: '/juanzong//warnGuize/update',
            method: 'post',
            data
        })
    },
    //告警信息列表_分页
    getAlarmTipList_Page(data){
        return service({
            url: '/juanzong/msg/getByPage',
            method: 'post',
            data
        })
    },
    //告警信息列表
    getAlarmTipList(data){
        return service({
            url: '/juanzong/msg/get',
            method: 'post',
            data
        })
    },
    //更新信息
    editAlarmTipData(data){
        return service({
            url: '/juanzong/msg/msg/update',
            method: 'post',
            data
        }) 
    },
    //获取储物柜类型列表
    getShaleTypeListData(data){
        return service({
            url: '/juanzong/shaleType/get',
            method: 'post',
            data
        })
    }, 
    //增加智能储物柜
    addShaleData(data){
        return service({
            url: '/juanzong/shale/shale/add',
            method: 'post',
            data
        })
    }, 
    //修改智能储物柜
    editShaleData(data){
        return service({
            url: '/juanzong/shale/shale/update',
            method: 'post',
            data
        })
    },
    //移除智能储物柜
    deteleShaleData(data){
        return service({
            url: '/juanzong/shale/shale/del',
            method: 'post',
            data
        })
    }, 
    //获取盘点列表_分页
    getStockList_Page(data){
        return service({
            url: '/juanzong/checkHead/getByPage',
            method: 'post',
            data
        })
    }, 
    //获取盘点详情列表_分页
    getStockDetailList_Page(data){
        return service({
            url: '/juanzong/checkLine/getByPage',
            method: 'post',
            data
        })
    },
    //新增盘点任务
    addCaseDataInfo(data){
        return service({
            url: '/juanzong/checkHead/add',
            method: 'post',
            data
        })
    },  
    //移除盘点任务
    deleteCaseDataInfo(data){
        return service({
            url: '/juanzong/checkHead/del',
            method: 'post',
            data
        })
    }, 
    //处理异常状态
    editStockDetai(data){
        return service({
            url: '/juanzong//checkLine/update',
            method: 'post',
            data
        })
    }, 
    //获取温湿度传感器列表_分页
    getThcalcList_Page(data){
        return service({
            url: '/juanzong/tephum/getTepHum',
            method: 'post',
            data
        })
    },
    //添加温湿度传感器
    addThcalcDataInfo(data){
        return service({
            url: '/juanzong/tephum/add',
            method: 'post',
            data
        })
    },  
    //删除温湿度传感器
    deleteThcalcDataInfo(data){
        return service({
            url: '/juanzong/tephum/del',
            method: 'post',
            data
        })
    }, 
    //获取统计数据(出入库/主办民警)
    getLesortDataInfo(data){
        return service({
            url: '/juanzong/tablesort/stock',
            method: 'post',
            data
        })
    }, 
    //获取统计数据(案卷类型/案件状态)
    getLesortTypeInfo(data){
        return service({
            url: '/juanzong/tablesort/table',
            method: 'post',
            data
        })
    }, 
    //获取个人申请列表记录
    getApproveDataInfo(data){
        return service({
            url: '/juanzong/user/user-flow/getByPage',
            method: 'post',
            data
        })
    },
    //获取首页头部统计数据
    getShowDataInfo(data){
        return service({
            url: '/juanzong/tablesort/msg_warn',
            method: 'post',
            data
        })
    },
}
