<template>
    <div class="caseBorrowingPage"> 
        <div class="caseBorrowingList">
            <div class="searchCaseInfo">
                <a-tabs :defaultActiveKey="tabCheckeTab" tabPosition="top" 
                    style="margin-top: 20px;text-align: left;" @change="tabListChecked">
                    <a-tab-pane v-for="(itemP) in tabTabList" :key="itemP.label">
                        <template slot="tab">
                            {{ itemP.title }} <a-badge :count="itemP.num" />
                        </template>
                        <!-- tab标签 -->
                        <a-tabs :defaultActiveKey="1" tabPosition="top" v-if="tabCheckeTab==1"
                            style="margin-top: 20px;text-align: left;" @change="changeTabItem">
                            <a-tab-pane v-for="(item) in tabListBtn" :tab="item.title" :key="item.label">
                                <!-- tab表格 -->
                                <a-table :columns="columns_caseBorrow" :dataSource="tableData_caseBorrow" :pagination="pagination" :loading="loading"
                                    class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange">
                                    <template slot="operation" slot-scope="text,record">
                                        <span class="editDate table-operation" @click="borrowApplica(record)">申请借阅</span>
                                    </template>
                                </a-table>
                            </a-tab-pane>
                        </a-tabs>
                        <!-- 借阅申请记录 -->
                        <a-table :columns="columns_history" :dataSource="tableData_history" :pagination="pagination_approve" 
                            class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange"
                            v-if="tabCheckeTab==2" :loading="loading">
                            <a-steps slot="expandedRowRender" slot-scope="record" >
                                <a-step :status="(item.is_approved==1 || item.is_approved==0)?'process':(item.is_approved==2?'finish':'wait')"
                                    :title="item.title" v-for="item in record.listData" :key="item.key">
                                    {{ item.is_approved }}
                                    <a-icon :type="item.approve_result=='agree'?'check-circle':(item.is_approved=='disAgree'?'close-circle':'loading')" 
                                        slot="icon"/>
                                    <template slot="description">
                                        <div>{{ item.approve_content }}</div>
                                        <div>{{ item.approve_time }}</div>
                                    </template>
                                </a-step>
                            </a-steps>
                        </a-table>
                        <!-- 申请待操作 -->
                        <div v-if="tabCheckeTab==3">
                            状态类型：
                            <a-select :defaultValue="checkedInfo.statusChecked" @change="handleChange_status">
                                <a-select-option :value="item.title" :key="item.itemId"
                                    v-for="(item) in checkedInfo.statusList">
                                    {{ item.title }}
                                </a-select-option>
                            </a-select>
                            <a-table :columns="columns_setting" :dataSource="tableData_setting" :pagination="pagination_approve" :loading="loading"
                                class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange">
                                <template slot="operation" slot-scope="text,record">
                                    <span class="editDate table-operation" @click="getApproveDetail(record)"
                                        v-if="record.is_approved==1">详情</span>
                                </template>
                            </a-table>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
            
            <!-- 提交借阅申请 -->
            <a-modal title="提交借阅申请"
                centered v-model="showModel.modalAppreciate" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in caseDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-select showSearch :placeholder="item.placeholder" optionFilterProp="children" v-if="index==0"
                        style="margin-top: 10px;width: 100%" @change="checkedPro" :filterOption="filterOption"
                        :value="submitDataInfo[item.dom]">
                        <a-select-option :value="item.key" :label="item.name"  
                            v-for="item in showModel[item.dom]" :key="item.key">{{ item.name }}
                        </a-select-option>
                    </a-select>
                    <a-date-picker showTime :placeholder="item.placeholder"
                        @change="onChange" v-else/>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data(){
            return{
                tabCheckeTab: 0,
                showModel: {
                    modalAppreciate: false,
                    org_flow_id: [],
                },
                caseDataInfoList: [
                    { captionTitle: '借阅类型',placeholder: '请选择借阅类型',dom:'org_flow_id' },
                    { captionTitle: '归还时间',placeholder: '请选择归还时间',dom:'borrow_time' },
                ],
                tabTabList: [
                    { icon: 'icon-yemian', title: '案件列表',label:1, num:0 },
                    { icon: 'icon-yemian', title: '申请记录',label:2, num:0 },
                    { icon: 'icon-yemian', title: '申请待操作',label:3, num:0 },
                ],
                //提交借阅申请
                submitDataInfo: {
                    case_id: 0,
                    org_flow_id: '',
                    borrow_time: {}
                },
                //案件列表_可借阅
                columns_caseBorrow: [
                    { title: '案件编号', dataIndex: 'number', },
                    { title: '案卷名称', dataIndex: 'name', },
                    { title: '案卷类型', dataIndex: 'type', },
                    { title: '主办单位', dataIndex: 'mainOff', },
                    { title: '所在楼宇', dataIndex: 'location', },
                    {
                        title: '操作', dataIndex: 'operation', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_caseBorrow: [],

                //tab标签
                tabListBtn: [
                    { label: 1, title: '全部' },
                    { label: 2, title: '刑事' },
                    { label: 3, title: '行政' },
                    { label: 4, title: '现场处罚' },
                ],
                //申请历史记录
                columns_history: [
                    { title: '案件名称', dataIndex: 'case_name' },
                    { title: '案件编号', dataIndex: 'case_number' },
                    { title: '操作类型', dataIndex: 'operate_type' },
                    { title: '申请日期', dataIndex: 'create_time' },
                ],
                //申请待操作记录
                columns_setting: [
                    { title: '案件名称', dataIndex: 'case_name' },
                    { title: '案件编号', dataIndex: 'case_police_nm' },
                    { title: '案件来源', dataIndex: 'case_from' },
                    { title: '案件类型', dataIndex: 'case_type_name' },
                    { title: '申请日期', dataIndex: 'create_time' },
                    { title: '申请人', dataIndex: 'create_user_name' },
                    {
                        title: '操作', dataIndex: 'operation', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                // 申请记录_借阅
                tableData_history: [],
                // 申请记录_待操作
                tableData_setting: [],
                checkedInfo: { 
                    statusChecked: '全部',
                    statusList: [
                        { title: '全部', itemId: '1,2' },
                        { title: '审批中', itemId: '1' },
                        { title: '审批完成', itemId: '2' },
                    ], 
                },
                pagination: {
                    pageNum: 1,
                    pageSize: 5,
                    case_type_name: '',
                    stock_status: 'ZK'
                },
                pagination_approve: {
                    pageNum: 1,
                    pageSize: 5,
                },
                loading: false,
            }
        },
        computed: {
            //权限认证
            ...mapState(['roleData']),
        },
        mounted() {
            this.tabListChecked(1);
            //获取统计数据
            this.getTotalNumData();
            this.getOperatorList();
            // 权限认证
            if(!this.roleData.includes('4'))
                this.tabTabList.splice(2,1)
        },
        methods: {
            onChange(value, dateString) {
                this.submitDataInfo['borrow_time'] = dateString;
            },
            //盘点状态筛选
            handleChange_status(e,state){
                console.log(e,state)
                // this.checkedInfo.statusChecked = state.key;
                this.getApproveData({
                    ...this.pagination_approve,
                    is_approved: state.key
                });
            },
            //获取统计数据
            async getTotalNumData(){
                let returnData_app = await this.$api.getApproveDataInfo({
                    ...this.pagination_approve,
                    user_flow_status: 0, //未通过
                });
                this.tabTabList[1].num = Number(returnData_app.data.total);
                let returnData_appList = await this.$api.getApproveList_Page({
                    ...this.pagination_approve,
                    is_approved: '1'
                });
                this.tabTabList[2].num = Number(returnData_appList.data.total);
            },
            //选项框
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            //申请选择借阅类型
            checkedPro(e){
                this.submitDataInfo['org_flow_id'] = e;
            },
            //确认提交借阅申请
            confirmBtn(){
                this.$api.addAppOutData(this.submitDataInfo).then((returnData_out)=>{
                    console.log(returnData_out);
                    this.showModel.modalAppreciate = false;
                    this.resetSubmitInfo();
                    this.getQueryListData(this.pagination)
                })
            },
            // 切换tab标签
            changeTabItem(checkedItem){
                console.log(checkedItem)
                this.resetSubmitInfo();
                this.pagination['case_type_name'] = this.tabListBtn[checkedItem-1].title;
                if(checkedItem==1) this.pagination['case_type_name'] = '';
                this.getQueryListData(this.pagination);
            },
            tabListChecked(index){
                this.tabCheckeTab = index;
                console.log(this.tabCheckeTab)
                this.resetSubmitData();
                if(index==1) this.getQueryListData(this.pagination);
                    else if(index==2) this.getApproveList(this.pagination_approve);
                    else if(index==3) 
                        this.getApproveData({
                            ...this.pagination_approve,
                            is_approved: '1,2'
                        });
            },
            //点击申请借阅
            borrowApplica(e){
                this.showModel.modalAppreciate = true;
                this.submitDataInfo.case_id = e.case_id;
            },
            //获取个人审批记录列表
            async getApproveList(data){
                const pagination = { ...this.pagination };
                let returnData_appList = await this.$api.getApproveDataInfo(data);
                let approveList = [];
                returnData_appList.data.list.forEach((item,index)=>{
                    let return_listData = [];
                    item.userFlowApproveList.forEach((itemChildren,index)=>{
                        return_listData.push({
                            key: index,
                            title: itemChildren.user_approve_name,
                            is_last: itemChildren.is_last,
                            is_approved: itemChildren.is_approved,
                            approve_result: itemChildren.approve_result,
                            approve_content: itemChildren.approve_content,
                            approve_time: itemChildren.approve_time
                        })
                    })
                    approveList.push({
                        key: index,
                        case_name: item.userFlowDossierList[0].casesList[0].case_name,
                        case_number: item.userFlowDossierList[0].casesList[0].case_police_nm,
                        operate_type: item.flow_type_name,
                        create_time: item.create_time,
                        listData: return_listData
                    })
                })
                pagination.total = Number(returnData_appList.data.total);
                this.pagination = pagination;
                this.tableData_history = approveList;
                console.log(this.tableData_history)
            },
            // 获取需审批列表
            async getApproveData(data){
                this.loading = true;
                const pagination = { ...this.pagination };
                let returnData_appList = await this.$api.getApproveList_Page(data);
                console.log(returnData_appList)
                let returnData_app = [];
                returnData_appList.data.list.forEach((item)=>{
                    returnData_app.key = item.user_approve_user_id,
                    returnData_app.push({
                        key: item.user_approve_user_id,
                        case_name: item.userFlowDossierList[0].casesList[0].case_name,
                        case_police_nm: item.userFlowDossierList[0].casesList[0].case_police_nm,
                        case_from: item.userFlowDossierList[0].casesList[0].case_from,
                        case_type_name: item.userFlowDossierList[0].casesList[0].case_type_name,
                        create_time: item.create_time,
                        create_user_name: item.create_user_name,
                        sa_org_name: item.userFlowDossierList[0].casesList[0].sa_org_name,
                        case_status_name: item.userFlowDossierList[0].casesList[0].case_status_name,
                        location: ``+item.userFlowDossierList[0].stockList[0].location_name+` - 
                            `+item.userFlowDossierList[0].stockList[0].floor_name+` - 
                            `+item.userFlowDossierList[0].stockList[0].room_name+` - 
                            `+item.userFlowDossierList[0].stockList[0].shale_name+``,
                        borrow_time: item.userFlowDossierList[0].stockList[0].borrow_time,
                        flow_type_name: item.userFlowList[0].flow_type_name,
                        is_approved: item.is_approved
                    })
                })
                this.tableData_setting = returnData_app;
                pagination.total = Number(returnData_appList.data.total);
                this.pagination = pagination;
                this.loading = false;
            },
            //分页切换
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.pageNum = pagination.current;
                pager.current = pagination.current;
                this.pagination = pager;
                console.log(this.pagination)
                if(this.tabCheckeTab == 1) this.getQueryListData(this.pagination);
                    else if(this.tabCheckeTab == 2) this.getApproveList(this.pagination_approve);
                    else if(this.tabCheckeTab == 3) 
                        this.getApproveData({
                            ...this.pagination_approve,
                            is_approved: this.checkedInfo.statusChecke
                        });
            },
            //获取在库案件列表
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getStockCaseList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list;
                const queryData = [];
                queryCaseList.forEach(item=>{
                    queryData.push({
                        key: item.stock_id,
                        case_id: item.case_id,
                        number: item.case_police_nm,
                        name: item.case_name,
                        type: item.case_type_name,
                        mainOff: item.sa_org_name,
                        location: ''+item.location_name+' - '+item.floor_name+' - '+item.room_name,
                    })
                })
                this.tableData_caseBorrow = queryData;
                pagination.total = Number(queryListData.data.total);
                this.pagination = pagination;
                this.loading = false;
            },
            //重置选择项
            resetSubmitData(){
                this.pagination['pageNum'] = 1;
                this.pagination['pageSize'] = 5;
                this.pagination['case_type_name'] = '';
                this.pagination['stock_status'] = 'ZK';
                this.pagination_approve['pageNum'] = 1;
                this.pagination_approve['pageSize'] = 5;
                delete this.pagination.total;
                delete this.pagination.current;
                delete this.pagination_approve.total;
                delete this.pagination_approve.current;
            },
            // 重置提交信息
            resetSubmitInfo(){
                this.submitDataInfo['case_id'] = 0;
                this.submitDataInfo['org_flow_id'] = '';
            },
            //查看申请待操作详情
            getApproveDetail(e){
                console.log(e)
                this.$router.push({path:'/caseAppDetail',query:{itemDetail: JSON.stringify(e)}});
            },
            // 获取申批类型列表
            async getOperatorList(){
                const operatortList = await this.$api.getApproveTypeData();
                // console.log(departmentList);
                const queryCaseList = operatortList.data;
                const operatortData = [];
                queryCaseList.forEach(item=>{
                    operatortData.push({
                        key: item.flow_type_id,
                        name: item.flow_type_name,
                    })
                })
                this.showModel.org_flow_id = operatortData;
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .caseBorrowingPage{
        padding: 20px 0;
        .caseBorrowingList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            .searchCaseInfo{
                text-align: left;
                padding-left: 20px;
                .itemTab{
                    display: inline-block;
                    margin-right: 10px;
                    &.active{
                        color: @bgBtnColor;
                    }
                }
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .editDate{
                    display: inline-block;
                    padding: 0 5px;
                    background-color: @bgBtnColor;
                    color: white;
                    border-radius: 5px;
                }
            }
        }
    }
</style>