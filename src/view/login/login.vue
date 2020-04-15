<template>
    <div class="loginPage">
        <h3 class="captionTitle">
            <img src="../../assets/images/logo.png" class="logoIcon"/>卷宗管理系统
        </h3>
        <div class="loginBox">
            <div class="logoIcon_box">
                <img src="../../assets/images/leftDataIcon.png" class="leftDataIcon"/>
            </div>
            <div class="loginDataInfo">
                <div class="loginInfo">
                    <p>登录</p>
                    <a-input placeholder="请输入账号" allowClear v-model="loginData.user_name" />
                    <a-input-password placeholder="请输入密码" v-model="loginData.pass_word" class="passWordBtn"/>
                    <span class="loginBtn" @click="login">登录</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { message } from 'ant-design-vue';
    export default {
        data(){
            return{
                loginData:{
                    user_name: '',
                    pass_word: ''
                }
            }
        },
        methods: {
            //登录
            async login(){
                // let passWordData = this.loginData.pass_word;
                // const tokenInfo = await this.$api.loginData({
                //     user_name: this.loginData.pass_word,
                //     pass_word: this.$md5(passWordData)
                // });
                const tokenInfo = await this.$api.loginData(this.loginData);
                if(tokenInfo.code == '0'){
                    sessionStorage.setItem('token',tokenInfo.data.token);
                    localStorage.setItem('userName',tokenInfo.data.user.user_true_name);
                    this.$router.push({ path: 'homeScreen' });
                    sessionStorage.removeItem('openKeys');
                    sessionStorage.setItem('checkedItem','homeScreen');
                    let roleList = ['none'];
                    if (tokenInfo.data.user.userRole.length>0)
                        roleList = [];
                        tokenInfo.data.user.userRole.forEach((item)=>{
                            roleList.push(item.role_id)
                        })
                    localStorage.setItem('roleList',JSON.stringify(roleList));
                }else{
                    message.error(tokenInfo.msg);
                }
            },
            //获取统计数据
            async getLesortData(){
                const returnData_lesort = await this.$api.getLesortDataInfo();
                // 入库
                let lesortData_in = [];
                let numTotal_in = 0;
                returnData_lesort.data.MonthWarnIn.forEach((item)=>{
                    numTotal_in+=Number(item.count);
                    lesortData_in.push({
                        time: ''+item.year+'/'+item.month+'',
                        total: numTotal_in,
                        month: Number(item.count),
                        type: '入库'
                    })
                });
                let setLosort_in = {
                    data: lesortData_in,
                    total: lesortData_in[lesortData_in.length-1].total
                };
                sessionStorage.setItem('setLosort_in',JSON.stringify(setLosort_in));
                // 出库
                let lesortData_out = [];
                let numTotal_out = 0;
                returnData_lesort.data.MonthWarnout.forEach((item)=>{
                    numTotal_out+=Number(item.count);
                    lesortData_out.push({
                        time: ''+item.year+'/'+item.month+'',
                        total: numTotal_out,
                        month: Number(item.count),
                        type: '出库'
                    })
                });
                let setLosort_out = {
                    data: lesortData_out,
                    total: lesortData_out[lesortData_out.length-1].total
                };
                sessionStorage.setItem('setLosort_out',JSON.stringify(setLosort_out));
                //出入库统计
                let setLosort_outIn = {
                    data: [
                        ...lesortData_in,
                        ...lesortData_out
                    ]
                };
                console.log(setLosort_outIn)
                sessionStorage.setItem('setLosort_outIn',JSON.stringify(setLosort_outIn));
                
                //办案民警统计数据
                let lesortData_police = [];
                let maxNum = 0;
                returnData_lesort.data.casePolices.forEach((item)=>{
                    if(maxNum < Number(item.zongshu)) maxNum = Number(item.zongshu)
                    lesortData_police.push({
                        name: item.user_name,
                        case: Number(item.zongshu),
                    })
                });
                console.log(maxNum)
                let setLosort_police = {
                    data: lesortData_police,
                    maxNum: maxNum
                }
                sessionStorage.setItem('setLosort_police',JSON.stringify(setLosort_police));
            },
            // 获取统计数据(案卷类型/案卷状态)
            async getLesortTypeInfo(){
                //案卷类型
                let returnData_type = await this.$api.getLesortTypeInfo();
                console.log(returnData_type)
                let lesortData_type = [];
                let typeTotal = 0;
                returnData_type.data.caseStatuses.forEach((item)=>{
                    typeTotal+=Number(item.zongshu);
                    lesortData_type.push({
                        item: item.case_type,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                let setLosort_type = {
                    data: lesortData_type,
                    maxNum: typeTotal
                }
                sessionStorage.setItem('setLosort_type',JSON.stringify(setLosort_type));
                //部门分布
                let lesortData_dept = [];
                let typeTotal_dept = 0;
                returnData_type.data.userDept.forEach((item)=>{
                    typeTotal_dept+=Number(item.zongshu)
                    lesortData_dept.push({
                        item: item.dept_name,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                let setLosort_dept = {
                    data: lesortData_dept,
                    maxNum: typeTotal_dept
                }
                sessionStorage.setItem('setLosort_dept',JSON.stringify(setLosort_dept));
                //告警消息
                let lesortData_alarm = [];
                let typeTotal_alarm = 0;
                let dataAlarm_cn = ['结案未归档','违规带出','最高温度','最低温度','最低湿度','最高湿度','结案未归档告警'];
                let dataAlarm_en = ['jawgd','wgdc','zgwd','zdwd','zdsd','zgsd','jawgdgj'];
                returnData_type.data.msgs.forEach((item)=>{
                    typeTotal_alarm+=Number(item.zongshu);
                    lesortData_alarm.push({
                        item: item.msg_type,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                lesortData_alarm.forEach((itemData)=>{
                    dataAlarm_en.forEach((item,index)=>{
                        if(itemData.item == item) 
                            itemData.item = dataAlarm_cn[index]
                    })
                })
                let setLosort_alarm = {
                    data: lesortData_alarm,
                    maxNum: typeTotal_alarm
                }
                sessionStorage.setItem('setLosort_alarm',JSON.stringify(setLosort_alarm));

                // 案卷类型_柱状图
                let lesortData_typeHis = [];
                let typeTotal_his = 0;
                returnData_type.data.caseStatuses.forEach((item)=>{
                    if(typeTotal_his < Number(item.zongshu)) typeTotal_his = Number(item.zongshu)
                    lesortData_typeHis.push({
                        type: item.case_type,
                        total: Number(item.zongshu)
                    });
                });
                let setLosort_typeHis = {
                    data: lesortData_typeHis,
                    maxNum: typeTotal_his
                }
                sessionStorage.setItem('setLosort_typeHis',JSON.stringify(setLosort_typeHis));
                // 告警消息_柱状图
                let lesortData_alarmHis = [];
                let typeTotal_alarmhis = 0;
                returnData_type.data.msgs.forEach((item)=>{
                    if(typeTotal_alarmhis < Number(item.zongshu)) typeTotal_alarmhis = Number(item.zongshu)
                    lesortData_alarmHis.push({
                        type: item.msg_type,
                        total: Number(item.zongshu)
                    });
                });
                lesortData_alarmHis.forEach((itemData)=>{
                    dataAlarm_en.forEach((item,index)=>{
                        if(itemData.type == item) 
                            itemData.type = dataAlarm_cn[index]
                    })
                })
                let setLosort_alarmHis = {
                    data: lesortData_alarmHis,
                    maxNum: typeTotal_alarmhis
                }
                sessionStorage.setItem('setLosort_alarmHis',JSON.stringify(setLosort_alarmHis));
                // 刑事案件类型统计
                let lesortData_criminal = [];
                let typeTotal_criminal = 0;
                returnData_type.data.caseCriminalStatuses.forEach((item)=>{
                    typeTotal_criminal+=Number(item.zongshu)
                    lesortData_criminal.push({
                        item: item.case_type,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                let setLosort_criminal = {
                    data: lesortData_criminal,
                    maxNum: typeTotal_criminal
                }
                sessionStorage.setItem('setLosort_criminal',JSON.stringify(setLosort_criminal));
                // 行政案件类型统计
                let lesortData_administra = [];
                let typeTotal_administra = 0;
                returnData_type.data.caseAdministrationStatus.forEach((item)=>{
                    typeTotal_administra+=Number(item.zongshu)
                    lesortData_administra.push({
                        item: item.case_type,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                let setLosort_administra = {
                    data: lesortData_administra,
                    maxNum: typeTotal_administra
                }
                sessionStorage.setItem('setLosort_administra',JSON.stringify(setLosort_administra));
                // 柜子使用资源统计
                let lesortData_cabinet = [];
                let typeTotal_cabinet = 0;
                let dataCabinet_cn = ['未使用','已使用'];
                let dataCabinet_en = ['0','1'];
                returnData_type.data.cellStatuses.forEach((item)=>{
                    typeTotal_cabinet+=Number(item.zongshu)
                    lesortData_cabinet.push({
                        item: item.cell_status,
                        count: Number(item.zongshu),
                        percent: Number(item.zongshu)
                    });
                });
                lesortData_cabinet.forEach((itemData)=>{
                    dataCabinet_en.forEach((item,index)=>{
                        if(itemData.item == item) 
                            itemData.item = dataCabinet_cn[index]
                    })
                })
                let setLosort_cabinet = {
                    data: lesortData_cabinet,
                    maxNum: typeTotal_cabinet
                }
                sessionStorage.setItem('setLosort_cabinet',JSON.stringify(setLosort_cabinet));
            },
        },
        mounted() {
            this.getLesortData();
            this.getLesortTypeInfo();
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .loginPage{
        width: 100%;
        height: 100vh;
        position: relative;
        background-color: @bgBtnColor;
        h3.captionTitle{
            color: white;
            font-size: 35px;
            font-weight: 600;
            padding: 5% 0;
            img.logoIcon{
                width: 50px;
                vertical-align: sub;
                margin-right: 10px;
            }
        }
        .loginBox{
            display: flex;
            transform: translate(-50%,-50%);
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            .loginDataInfo, .logoIcon_box{
                width: 50%;
                .leftDataIcon {
                    width: 80%;
                }
                .loginInfo{
                    width: 65%;
                }
            }
            .loginDataInfo{
                display: flex;
                align-items: center;
                justify-content: center;
                .loginInfo{
                    padding: 35px 20px;
                    background-color: white;
                    border-radius: 5px;
                    .passWordBtn{
                        margin: 15px 0;
                    }
                    span.loginBtn{
                        background-color: @bgBtnColor;
                        display: block;
                        border-radius: 5px;
                        padding: 5px;
                        text-align: center;
                        color: white;
                    }
                }
            }
        }
    }
</style>