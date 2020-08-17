<template>
    <div class="queryCasePage"> 
        <div class="queryCaseList">
            <div class="searchCaseInfo">
                按案卷名称查询： 
                <a-input placeholder="请输入案卷名称" allowClear v-model="searchValue" class="enterInputData"/>
                <a-input placeholder="请输入案卷编号" allowClear v-model="searchValue2" class="enterInputData"/>
                <a-button class="comfirmAdd" @click="confirmSearch">查询</a-button>
                <a-button type="primary" ghost class="refreshBtn" @click="refreshBtn()">刷新</a-button>
            </div>
            <a-table bordered :columns="columns_dossier" :pagination="pagination"
                :loading="loading" :data-source="tableData_dossier" size="middle"
                @change="handleTableChange" class="tableCaseData" >
                <template slot="operation" slot-scope="record">
                    <span class="editDate" @click='showDetail(record)'>详情</span>
                </template>
            </a-table>
            <!-- 卷宗详情 -->
            <a-modal title="卷宗详情"
                centered v-model="showModel.modalDetail" @ok="showModel.modalDetail = false">
                <a-row :gutter="0">
                    <a-col class="gutter-row itemData" :span="12" v-for="(item,index) in showModel.tableDataCase" 
                        :key="index" style="margin-bottom: 10px;">
                        <div class="gutter-box">
                            <span style="color: #666;margin-right: 10px">{{ item.title }}: </span>
                            <span>{{ item.value }}</span>
                        </div>
                    </a-col>
                </a-row>
            </a-modal>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                searchValue: '',
                searchValue2:'',
                //标题
                columns_dossier: [
                    { title: '案件/事件编号', dataIndex: 'number', },
                    { title: '案卷名称', dataIndex: 'name', },
                    { title: '涉案人员', dataIndex: 'personnelInvolved', },
                    { title: '案卷类型', dataIndex: 'type', },
                    { title: '创建日期', dataIndex: 'creatDate', },
                    { title: '主办民警', dataIndex: 'main', },
                    { title: '协办民警', dataIndex: 'operativeCivilian', },
                    { title: '主办单位', dataIndex: 'mainOff', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_dossier: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    dossier_name: '',
                    case_police_nm:''
                },
                loading: false,
                //详情信息
                showModel: {
                    modalDetail: false,
                    itemDetail: {},
                    comfirmBtn: false,
                    tableDataCase: []
                }
            }
        },
        mounted() {
            this.getQueryListData(this.pagination);
        },
        methods: {
            //查看详情
            showDetail(e){
                console.log(e)
                this.showModel.modalDetail = true;
                let dataDomArr = [
                    { dom: 'case_police_bh',title: '案件编号' },
                    { dom: 'dossier_name',title: '案卷名称' },
                    { dom: 'dossier_type_name',title: '案卷类型' },
                    { dom: 'dossier_create_time',title: '创建时间' },
                    { dom: 'organize_user_name',title: '主办单位' },
                ];
                let dataDom = [];
                dataDomArr.forEach((item,index)=>{
                    dataDom.push({
                        title: dataDomArr[index].title,
                        value: e[dataDomArr[index].dom]
                    })
                })
                this.showModel.tableDataCase = dataDom;
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getQueryListData(this.pagination);
            },
            confirmSearch(dom){
                console.log(this.pagination[dom]);
                this.pagination.pageNum = 1,
                this.pagination.current = 1;
                this.pagination.pageSize = 10,
                this.pagination.dossier_name = this.searchValue;
                this.pagination.case_police_nm = this.searchValue2;
                this.getQueryListData(this.pagination);
            },
            //
            refreshBtn(){
                this.pagination.dossier_name = '';
                this.getQueryListData({
                    pageNum: 1,
                    pageSize: 10,
                })
            },
            // 获取卷宗列表信息
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getQueryCaseList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                if(queryListData){
                    if(queryListData.code == '0'){
                        const queryCaseList = queryListData.data.list;
                        const queryData = [];
                        queryCaseList.forEach(item=>{
                            queryData.push({
                                key: item.dossier_id,
                                number: item.case_police_bh,
                                name: item.dossier_name,
                                personnelInvolved: item.involved_user_name,
                                type: item.dossier_type_name,
                                creatDate: item.dossier_create_time,
                                main: item.organize_user_name,
                                operativeCivilian: item.join_user_name,
                                ...item
                            })
                        })
                        this.tableData_dossier = queryData;
                        pagination.total = queryListData.data.total;
                        this.pagination = pagination;
                        this.loading = false;
                    }
                }
                
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .queryCasePage{
        padding: 20px 0;
        .queryCaseList{
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