<template>
    <div class="caseStatusPage"> 
        <div class="caseStatusList">
            <a-row :gutter="16" justify="center" class="searchBtnInfo">
                <a-col class="gutter-row" :span="5">
                    状态类型：
                    <a-select :defaultValue="checkedInfo.statusChecked" @change="handleChange_status">
                        <a-select-option :value="item.title" :key="item.itemId"
                            v-for="(item) in checkedInfo.statusList">
                            {{ item.title }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <!-- 借阅申请记录 -->
            <a-table :columns="columns_history" :dataSource="tableData_history" :pagination="pagination" 
                class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange" :loading="loading">
                <a-steps slot="expandedRowRender" slot-scope="record" >
                    <a-step :status="(item.is_approved==1 || (item.is_approved==2 && item.approve_result=='agree'))?'process':'wait'"
                        :title="item.title" v-for="item in record.listData" :key="item.key">
                        {{ item.is_approved }}
                        <a-icon :type="item.approve_result=='agree'?'check-circle':(item.approve_result=='disAgree'?'close-circle':'loading')" 
                            slot="icon"/>
                        <template slot="description">
                            <div>{{ item.approve_content }}</div>
                            <div>{{ item.approve_time }}</div>
                        </template>
                    </a-step>
                </a-steps>
            </a-table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                checkedInfo: {
                    statusChecked: '全部',
                    statusList: [
                        { title: '全部', itemId: '' },
                        { title: '未完成', itemId: '0' },
                        { title: '通过', itemId: '1' },
                        { title: '未通过', itemId: '2' },
                    ], 
                },
                showModel: {
                    modalCase: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                    stockDataList: [],  //所需盘点的存储设备列表
                    userDataList: [],  //人员调配列表
                },
                submitDataInfo: {
                    case_name: '',
                    stockDataList: [],
                    userDataList: []
                },
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    user_flow_status: ''
                },
                loading: false,
                //申请历史记录
                columns_history: [
                    { title: '案件名称', dataIndex: 'case_name' },
                    { title: '案件编号', dataIndex: 'case_number' },
                    { title: '操作类型', dataIndex: 'operate_type' },
                    { title: '申请日期', dataIndex: 'create_time' },
                ],
                tableData_history: [],
            }
        },
        mounted() {
            this.getApproveList(this.pagination);
        },
        methods: {
            //盘点状态筛选
            handleChange_status(e,state){
                console.log(e,state)
                this.pagination.user_flow_status = state.key;
                this.getApproveList({
                    ...this.pagination
                });
            },
            //分页
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.pageNum = pagination.current;
                pager.current = pagination.current;
                this.pagination = pager;
                this.getApproveList(this.pagination);
            },
            //获取个人审批记录列表
            async getApproveList(data){
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
                        case_name: item.userFlowDossierList[0].stockList[0].case_name,
                        case_number: item.userFlowDossierList[0].stockList[0].case_police_nm,
                        operate_type: item.flow_type_name,
                        create_time: item.create_time,
                        listData: return_listData
                    })
                })
                this.tableData_history = approveList;
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    @activeHading: #e6a23c;
    .caseStatusPage{
        padding: 20px 0;
        .caseStatusList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            overflow: auto;
            .addCaseInfo{
                text-align: left;
                padding-left: 20px;
                display: inline-block;
                color: white;
                span{
                    display: inline-block;
                    padding: 5px 20px;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                    i{
                        margin-right: 5px;
                    }
                }
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .editDate{
                    padding: 2px 6px;
                    color: white;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                    &.active01{
                        margin-right: 4px;
                    }
                }
                span.activeHanding{
                    color: @activeHading;
                }
                span.activeNotHad{
                    color: green;
                }
            }
        }
    }
</style>