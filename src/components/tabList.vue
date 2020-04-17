<template>
    <div class="tabListPage">
        <a-menu @click="handleClick"
            :defaultSelectedKeys="checkedItem"
            :openKeys.sync="openKeys"
            mode="inline" class="tabListMenu">
            <template v-for="(item,index) in tabListData">
                <a-menu-item :key="item.captionsTitle.keyId" 
                    v-if="item.childrenList.length==0">
                    <i :class="item.captionsTitle.icon" class="iconfont"></i>
                    <span>{{ item.captionsTitle.title }}</span>
                </a-menu-item>
                <a-sub-menu :key="item.captionsTitle.keyId" 
                    v-else-if="item.childrenList.length>0 && (index<tabListData.length-1) || roleData.includes('1')&&(index==tabListData.length-1)">
                    <span slot="title">
                        <i :class="item.captionsTitle.icon" class="iconfont"></i>
                        <span>{{ item.captionsTitle.title }}</span>
                    </span>
                    <a-menu-item :key="itemChildren.keyId" v-for="itemChildren in item.childrenList">
                        <i :class="itemChildren.icon" class="iconfont"></i>
                        <span>{{ itemChildren.title }}</span>
                    </a-menu-item>
                </a-sub-menu>
            </template>
        </a-menu>
    </div>
</template>

<script>
    import { mapState,mapActions } from 'vuex'
    export default {
        data(){
            return{
                openKeys: [],
                checkedItem: ['homeScreen'],
                tabListData: [
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-index',title: '首页',keyId: 'homeScreen' },
                        childrenList: []
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-liebiao2',title: '案件/卷宗列表',keyId: 'tab_status' },
                        childrenList: [
                            { icon: 'icon-ziyuan',title: '全部',keyId: 'dossierScreen' },
                            { icon: 'icon-dairuku1',title: '待入库',keyId: 'caseWaiting' },
                            { icon: 'icon-ruku',title: '应入库',keyId: 'caseReceived' },
                        ]
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-cangkuguanli',title: '在库管理',keyId: 'tab_case' },
                        childrenList: [
                            { icon: 'icon-ziyuan',title: '全部',keyId: 'allCaseIn' },
                            { icon: 'icon-dairuku1',title: '暂存区',keyId: 'temporaryCaseIn' },
                            { icon: 'icon-ruku',title: '封存区',keyId: 'sealUpCaseIn' },
                        ]
                    },
                    // {
                    //     downIcon: ['1'],
                    //     captionsTitle: { icon: 'icon-jifang',title: '资料新增',keyId: 'addCaseInfo' },
                    //     childrenList: []
                    // },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-chuku',title: '出库管理',keyId: 'tab_out' },
                        childrenList: [
                            { icon: 'icon-pifu',title: '批复状态',keyId: 'caseStatus' },
                            { icon: 'icon-file-management-borrowed-record',title: '案卷借阅',keyId: 'caseBorrowing' },
                            { icon: 'icon-guihuan',title: '案卷归还',keyId: 'caseReturn' },
                        ]
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-pandianguanli',title: '盘点管理',keyId: 'stockControl' },
                        childrenList: []
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-cuiban',title: '预警催办',keyId: 'tab_Urge' },
                        childrenList: [
                            { icon: 'icon-cuiban1',title: '我的催办',keyId: 'myReminder' },
                            { icon: 'icon-cuibanjilu',title: '催办记录',keyId: 'reminderList' },
                        ]
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-shujutongji',title: '数据统计',keyId: 'tab_total' },
                        childrenList: [ 
                            { icon: 'icon-tongji',title: '案卷类型状态',keyId: 'statusUseCoil' },
                            { icon: 'icon-tongji',title: '案卷出入库统计',keyId: 'statusOurIn' },
                            { icon: 'icon-tongji',title: '告警类型统计',keyId: 'statisticsAlarm' },
                            { icon: 'icon-tongji',title: '案卷状态统计',keyId: 'statisticsCase' },
                            { icon: 'icon-tongji',title: '存储资源统计',keyId: 'statisticsStorage' },
                            { icon: 'icon-tongji',title: '办案民警归属',keyId: 'policeMan' },
                        ]
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-zonghechaxun',title: '综合查询',keyId: 'tab_compre' },
                        childrenList: [
                            { icon: 'icon-chaxunrenwu',title: '卷宗查询',keyId: 'queryCase' },
                            { icon: 'icon-anjuanchaxun',title: '操作记录查询',keyId: 'querySetting' },
                            // { icon: 'icon-chaxun',title: '办案人查询',keyId: 'queryInvestigators' },
                        ]
                    },
                    {
                        downIcon: ['1'],
                        captionsTitle: { icon: 'icon-xitongweihu',title: '系统维护',keyId: 'tab_system' },
                        childrenList: [
                            { icon: 'icon-bumenshezhi',title: '部门设置',keyId: 'setDepartment' },
                            { icon: 'icon-quanxianshezhi',title: '权限设置',keyId: 'setJurisdiction' },
                            { icon: 'icon-xinzeng',title: '添加操作员',keyId: 'setOperator' },
                            // { icon: 'icon-jifang',title: '物品处理方式设置',keyId: 'setProcessMode' },
                            { icon: 'icon-loupan',title: '楼宇设置',keyId: 'setBuilding' },
                            { icon: 'icon-louceng-copy',title: '楼层设置',keyId: 'setFloor' },
                            { icon: 'icon-shebeishezhi',title: '物品保全室设置',keyId: 'setPreservation' },
                            { icon: 'icon-shebeishezhi',title: '区域设置',keyId: 'setAreaLine' },
                            { icon: 'icon-shebeishezhi',title: '智能存储设备设置',keyId: 'setStorageDevice' },
                            // { icon: 'icon-qushi',title: '一体机设置',keyId: 'setAIO' },
                            { icon: 'icon-shexiangtoushezhi',title: '摄像头设置',keyId: 'setCamera' },
                            { icon: 'icon-shineiwenshiduchuanganqi-ditu',title: '温湿度计设置',keyId: 'setTHCALC' },
                            { icon: 'icon-gaojingshezhi',title: '告警设置',keyId: 'setWarning' },
                            { icon: 'icon-shenpishezhi',title: '审批流设置',keyId: 'setApprovalLine' },
                        ]
                    }
                ]
            }
        },
        computed: {
            //权限列表
            ...mapState(['roleData'])
        },
        methods: {
            handleClick(e) {
                this.$router.push({ path:e.key })
                sessionStorage.setItem('checkedItem',e.key);
            },
            ...mapActions({
                setRoleData: 'setOpenKeysTab',
                setLosort_in:'setLosort_in',
                setLosort_out:'setLosort_out',
                setLosort_police: 'setLosort_police',
                setLosort_type: 'setLosort_type',
                setLosort_typeHis: 'setLosort_typeHis',
                setLosort_outIn: 'setLosort_outIn',
                setLosort_criminal: 'setLosort_criminal',
                setLosort_administra: 'setLosort_administra',
                setLosort_alarm: 'setLosort_alarm',
                setLosort_alarmHis: 'setLosort_alarmHis',
                setLosort_cabinet: 'setLosort_cabinet',
                setLosort_dept: 'setLosort_dept'
            }),
            //初始化统计数据
            resetLosortData(){
                let setLosort_in = JSON.parse(sessionStorage.getItem('setLosort_in'));
                this.setLosort_in(setLosort_in);
                let setLosort_out = JSON.parse(sessionStorage.getItem('setLosort_out'));
                this.setLosort_out(setLosort_out);
                let setLosort_outIn = JSON.parse(sessionStorage.getItem('setLosort_outIn'));
                this.setLosort_outIn(setLosort_outIn);
                let setLosort_police = JSON.parse(sessionStorage.getItem('setLosort_police'));
                this.setLosort_police(setLosort_police);
                let setLosort_type = JSON.parse(sessionStorage.getItem('setLosort_type'));
                this.setLosort_type(setLosort_type);
                let setLosort_typeHis = JSON.parse(sessionStorage.getItem('setLosort_typeHis'));
                this.setLosort_typeHis(setLosort_typeHis);
                let setLosort_criminal = JSON.parse(sessionStorage.getItem('setLosort_criminal'));
                this.setLosort_criminal(setLosort_criminal);
                let setLosort_administra = JSON.parse(sessionStorage.getItem('setLosort_administra'));
                this.setLosort_administra(setLosort_administra);
                let setLosort_alarm = JSON.parse(sessionStorage.getItem('setLosort_alarm'));
                this.setLosort_alarm(setLosort_alarm);
                let setLosort_alarmHis = JSON.parse(sessionStorage.getItem('setLosort_alarmHis'));
                this.setLosort_alarmHis(setLosort_alarmHis);
                let setLosort_cabinet = JSON.parse(sessionStorage.getItem('setLosort_cabinet'));
                this.setLosort_cabinet(setLosort_cabinet);
                let setLosort_dept = JSON.parse(sessionStorage.getItem('setLosort_dept'));
                this.setLosort_dept(setLosort_dept);
            }
        },
        watch: {
            openKeys(val) {
                sessionStorage.setItem('openKeys',JSON.stringify(val));
            },
        },
        mounted() {
            const openKeys = JSON.parse(sessionStorage.getItem('openKeys'));
            if(openKeys) this.openKeys = openKeys;
            const checkedItem = sessionStorage.getItem('checkedItem');
            if(checkedItem) this.checkedItem[0] = checkedItem;
            // 权限认证
            let roleData = JSON.parse(localStorage.getItem('roleList'));
            this.setRoleData(roleData);
            //统计数据(出入库/主办民警)
            this.resetLosortData();
        },
    }
</script>

<style lang="less" scope>
    .tabListPage{
        width: 180px;
        height: 100%;
        .ant-menu-inline{
            border: 0;
        }
        .tabListMenu{
            text-align: left;
            .iconfont{
                margin-right: 10px;
            }
        }
    }
</style>