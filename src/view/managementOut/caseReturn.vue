<template>
    <div class="caseReturnPage"> 
        <div class="caseReturnList">
            <!-- tab标签 -->
            <a-tabs :defaultActiveKey="pagination.case_physical_type_id" tabPosition="top" v-if="tabCheckeTab==0"
                style="margin-top: 20px;text-align: left;" @change="changeTabItem">
                <a-tab-pane v-for="(item) in tabListBtn" :tab="item.title" :key="item.label">
                    <!-- tab表格 -->
                    <a-table :columns="columns_caseBorrow" :dataSource="tableData_caseBorrow" :pagination="pagination" :loading="loading"
                        class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange">
                        <a-table slot="expandedRowRender" :columns="innerColumns" slot-scope="record"
                            :dataSource="record.listData" :pagination="false" size="middle">
                            <template slot="operation" slot-scope="text,record">
                                <span class="editDate table-operation" @click="getBarCodeInfo(text,record)" 
                                    v-print="'#printAreaInfo'">打印条码</span>
                            </template>
                        </a-table>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                tabCheckeTab: 0,
                //案件列表_可借阅
                columns_caseBorrow: [
                    { title: '案件编号', dataIndex: 'number', },
                    { title: '案卷名称', dataIndex: 'name', },
                    { title: '案卷类型', dataIndex: 'type', },
                    { title: '主办单位', dataIndex: 'mainOff', },
                    { title: '所在楼宇', dataIndex: 'location', },
                ],
                tableData_caseBorrow: [],
                //案卷列表
                innerColumns:[
                    { title: '案卷名称', dataIndex: 'dossier_name' },
                    { title: '日期', dataIndex: 'dossier_create_time' },
                    { title: '案卷状态', dataIndex: 'result' },
                    { title: '办案民警', dataIndex: 'organize_user_name' },
                ],
                //tab标签
                tabListBtn: [
                    { label: 1, title: '全部' },
                    { label: 2, title: '刑事' },
                    { label: 3, title: '行政' },
                    { label: 4, title: '现场处罚' },
                ],
                pagination: {
                    pageNum: 1,
                    pageSize: 5,
                    case_type_name: '',
                    stock_status: ''
                },
                loading: false,
            }
        },
        mounted() {
            this.getQueryListData(this.pagination);
            this.getOperatorList();
        },
        methods: {
            // 切换tab标签
            changeTabItem(checkedItem){
                this.pagination['case_type_name'] = this.tabListBtn[checkedItem-1].title;
                if(checkedItem==1) this.pagination['case_type_name'] = '';
                this.getQueryListData(this.pagination);
            },
            //分页切换
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.pageNum = pagination.current;
                pager.current = pagination.current;
                this.pagination = pager;
                this.getQueryListData(this.pagination);
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
                        key: item.case_id,
                        number: item.case_police_nm,
                        name: item.case_name,
                        type: item.case_type_name,
                        mainOff: item.sa_org_name,
                        location: ''+item.location_name+' - '+item.floor_name+' - '+item.room_name,
                        listData: item.stockList,
                    })
                })
                this.tableData_caseBorrow = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .caseReturnPage{
        padding: 20px 0;
        .caseReturnList{
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