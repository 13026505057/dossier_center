<template>
    <div class="allCaseInPage"> 
        <div class="allCaseInList">
            <div class="searchCaseInfo">
                <!-- 筛选 -->
                <a-row :gutter="24" justify="center" class="searchBtnInfo">
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入主办单位" @search="confirmSearch('organiza_org_name')" 
                            enterButton v-model="pagination.organiza_org_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件名称" @search="confirmSearch('case_name')" 
                            enterButton v-model="pagination.case_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件编号" @search="confirmSearch('case_police_nm')" 
                            enterButton v-model="pagination.case_police_nm" />
                    </a-col>
                     <a-col class="gutter-row" :span="5">
                        <a-input-search placeholder="请输入案件类型" @search="confirmSearch('case_type_name')" 
                            enterButton v-model="pagination.case_type_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="4">
                        <a-button type="primary" @click="stockExport">导出</a-button>
                    </a-col>
                </a-row>
            </div>
            <a-tabs :defaultActiveKey="1" tabPosition="top"
                style="margin-top: 20px;text-align: left;" @change="changeTabItem">
                <!-- 在库详情 -->
                <a-tab-pane v-for="(item) in tabListBtn" :tab="item.title" :key="item.label">
                    <a-table bordered :columns="columns_criminal" :pagination="pagination"
                        :loading="loading" :data-source="tableData_criminal" size="middle"
                        @change="handleTableChange" class="tableCaseData">
                        <template slot="operation" slot-scope="text,record">
                            <span class="editDate table-operation" @click="showCaseDetail(record)">详情</span>
                        </template>
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
                //tab标签
                tabListBtn: [
                    { label: 1, title: '全部' },
                    { label: 2, title: '刑事' },
                    { label: 3, title: '行政' },
                    { label: 4, title: '现场处罚' },
                ],
                //标题
                columns_criminal: [
                    { title: '案件名称', dataIndex: 'caseName', },
                    { title: '案件编号', dataIndex: 'caseNumber', },
                    { title: '案件来源', dataIndex: 'caseFrom', },
                    { title: '案件类型', dataIndex: 'typeCase', },
                    { title: '受案单位', dataIndex: 'acceptUnit', },
                    { title: '机构名称', dataIndex: 'cell_org', },
                    { title: '柜子类型', dataIndex: 'cell_case_type', },
                    { title: '主办单位', dataIndex: 'hostUnit', },
                    { title: '主办民警', dataIndex: 'hostPeo', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_criminal: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_type_name: '',
                    stock_status: 'ZK',
                    case_name: '',
                    organiza_org_name:'',
                    case_type_name:'',
                    case_police_nm: ''
                },
                loading: false,
            }
        },
        methods: {
            handleTableChange(pagination) {
                // console.log(pagination);
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
            // 切换tab标签
            changeTabItem(checkedItem){
                this.pagination['case_type_name'] = this.tabListBtn[checkedItem-1].title;
                if(checkedItem==1) this.pagination['case_type_name'] = '';
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
                        key: item.stock_id,
                        caseName: item.case_name,
                        typeCase: item.case_type_name,
                        caseNumber: item.case_police_nm,
                        caseFrom: item.case_from,
                        acceptUnit: item.sa_org_name,
                        listData: item.stockList,
                        hostUnit: item.organiza_org_name,
                        hostPeo: item.organiza_user_name,
                        cell_org:item.cell_org_name,
                        cell_case_type:item.cell_case_type
                    })
                })
                this.tableData_criminal = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 展示详情
            showCaseDetail(e){
                this.$router.push({ path: '/dossierDetail',query: { detailDom: e } })
            },
            //  导出查询条件execle
            stockExport() {
                let dataInfo = {
                    case_type_name: this.pagination['case_type_name'],
                    case_name: this.pagination['case_name'],
                    case_police_nm: this.pagination['case_police_nm'],
                };
                let arr = ['case_type_name','case_name','case_police_nm'];
                var url = sessionStorage.getItem('baseURL')+`/juanzong/export/stockExport?stock_status=ZK`
                arr.forEach((item)=>{
                    if(dataInfo[item]){
                        url = url+'&'+item+'='+dataInfo[item]
                    }
                })
                console.log(url)
                window.location.href = url;
            },
        },
        mounted() {
            this.getQueryListData(this.pagination);
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