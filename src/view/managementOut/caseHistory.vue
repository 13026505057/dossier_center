<template>
    <div class="allCaseInPage"> 
        <div class="allCaseInList">
            <div class="searchCaseInfo">
                <!-- 筛选 -->
                <a-row :gutter="24" justify="center" class="searchBtnInfo">
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入主办单位" @search="confirmSearch('org_name')" 
                            enterButton v-model="pagination.org_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件名称" @search="confirmSearch('dossier_name')" 
                            enterButton v-model="pagination.dossier_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件编号" @search="confirmSearch('case_police_bh')" 
                            enterButton v-model="pagination.case_police_bh" />
                    </a-col>
                     <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件类型" @search="confirmSearch('dossier_type_name')" 
                            enterButton v-model="pagination.dossier_type_name" />
                    </a-col>
                </a-row>
            </div>
            <!-- 表格 -->
            <a-table bordered :columns="columns_criminal" :pagination="pagination"
                        :loading="loading" :data-source="tableData_criminal" size="middle"
                        @change="handleTableChange" class="tableCaseData">
            </a-table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                //标题
                columns_criminal: [
                    { title: '案件名称', dataIndex: 'dossier_name', },
                    { title: '案件编号', dataIndex: 'case_police_bh', },
                    { title: '案件类型', dataIndex: 'dossier_type_name', },
                    { title: '主办单位', dataIndex: 'org_name', },
                    { title: '格子位置', dataIndex:'cell_name'},
                    { title: '在库状态', dataIndex:'stock_status'},
                    { title: '时间',     dataIndex:'create_time'}
                ],
                tableData_criminal: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    dossier_type_name: '',
                    dossier_name: '',
                    org_name:'',
                    case_police_bh: ''
                },
                loading: false,
            }
        },
        methods: {
            handleTableChange(pagination) {
                const pager = { ...this.pagination };
                pager.pageNum = pagination.current;
                pager.current = pagination.current;
                this.pagination = pager;
                this.getQueryListData(this.pagination);
            },
            confirmSearch(dom){
                console.log(this.pagination[dom]);
                this.pagination.pageNum = 1,
                this.pagination.current = 1;
                this.pagination.pageSize = 10,
                this.getQueryListData(this.pagination);
            },
            //获取在库案件列表
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getHistoryList_Page(dataInfo);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list;
                const queryData = [];              
                queryCaseList.forEach(item=>{
                           if(item.stock_status == 'RK'){
                                item.stock_status = '入库'
                           }else if(item.stock_status == 'CK'){
                                item.stock_status = '出库'
                           }
                       console.log( item.stock_status)
                   
                })
                this.tableData_criminal = queryCaseList;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
   
        },
        mounted() {
            this.getQueryListData(this.pagination)
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .allCaseInPage{
        padding: 20px 0;
        .allCaseInList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            .searchCaseInfo{
                text-align: left;
                padding-left: 20px;
                .enterInputData{
                    width: auto;
                }
                .comfirmAdd{
                    margin: 0 10px;
                    color: white;
                    background-color: @bgBtnColor;
                }
                .refreshBtn{
                    margin-right: 10px;
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