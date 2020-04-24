<template>
    <div class="caseWaitingPage"> 
        <div class="caseWaitingList">
            <div class="searchCaseInfo">
                <!-- 筛选 -->
                <a-row :gutter="16" justify="center" class="searchBtnInfo">
                    <a-col class="gutter-row" :span="8">
                        <a-input-search placeholder="请输入案件名称" @search="confirmSearch('case_name')" 
                            enterButton v-model="pagination.case_name" />
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <a-input-search placeholder="请输入案件编号" @search="confirmSearch('case_police_nm')" 
                            enterButton v-model="pagination.case_police_nm" />
                    </a-col>
                </a-row>
            </div>
            <a-tabs :defaultActiveKey="1" tabPosition="top"
                style="margin-top: 20px;text-align: left;" @change="changeTabItem">
                <!-- 待入库列表详情 -->
                <a-tab-pane v-for="(item) in tabListBtn" :tab="item.title" :key="item.label">
                    <a-table bordered :columns="columns_criminal" :pagination="pagination"
                        :loading="loading" :data-source="tableData_criminal" size="middle"
                        @change="handleTableChange" class="tableCaseData" @expand="expandedRowItem">
                        <a-table slot="expandedRowRender" :columns="innerColumns" slot-scope="record"
                            :dataSource="record.listData" :pagination="false" size="middle">
                            <template slot="operation" slot-scope="text,record">
                                <span class="editDate table-operation" @click="getBarCodeInfo(text,record)" 
                                    v-print="'#printAreaInfo1'">打印条码</span>
                            </template>
                        </a-table>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div id="printAreaInfo">
            <img id="canvasCode"/>
            <img id="tipsContent"/>
        </div>
    </div>
</template>

<script>
    let JsBarcode = require('jsbarcode');
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
                    { title: '主办单位', dataIndex: 'hostUnit', },
                    { title: '主办民警', dataIndex: 'hostPeo', },
                ],
                tableData_criminal: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_type_name: '',
                    case_status: '210,115',
                    case_name: '',
                    case_police_nm: ''
                },
                loading: false,
                //案卷列表
                innerColumns:[
                    { title: '案卷名称', dataIndex: 'dossier_name' },
                    { title: '日期', dataIndex: 'dossier_create_time' },
                    { title: '案卷状态', dataIndex: 'result' },
                    { title: '办案民警', dataIndex: 'organize_user_name' },
                    {
                    title: '操作', dataIndex: 'operation', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
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
            //展开获取子集
            async expandedRowItem(state,data){
                console.log(state,data)
                delete this.pagination.total;
                if(state){
                    const returnData = await this.$api.getQueryCaseList_Page({
                        pageNum:1,
                        pageSize: 100,
                        case_id: data.key
                    })
                    const dataInfo = [];
                    returnData.data.list.forEach(dossierKey=>{
                        dossierKey.key = dossierKey.dossier_id;
                        dataInfo.push(dossierKey)
                    })
                    this.tableData_criminal[data.index].listData = dataInfo;
                }
            },
            //获取待入库案件列表
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getWaitCaseList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list;
                const queryData = [];
                queryCaseList.forEach((item,index)=>{
                    queryData.push({
                        key: item.case_id,
                        index: index,
                        caseName: item.case_name,
                        typeCase: item.case_type_name,
                        caseNumber: item.case_police_nm,
                        caseFrom: item.case_from,
                        acceptUnit: item.sa_org_name,
                        listData: [],
                        hostUnit: item.organiza_org_name,
                        hostPeo: item.organiza_user_name,
                    })
                })
                this.tableData_criminal = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取打印条码信息
            getBarCodeInfo(e,f){
                console.log(e,f)
                let content = f.dossier_name;
                if(content.length>11) content = content.slice(0,11) + '...';
                // this.printDeta('123456789012','123456789012',`卷宗名称：我的家里`);
                this.printDeta(f.dossier_id,f.dossier_id,content);
            },
            //打印条形码
            async printDeta(value,text,tipsContent){
                //生成条形码
                console.log(value,text,tipsContent)
                JsBarcode("#canvasCode", value, {
                    format: "CODE128",//选择要使用的条形码类型
                    width:2,//设置条之间的宽度
                    height:50,//高度
                    displayValue:true,//是否显示文字
                    text:text,//覆盖显示的文本
                    // fontOptions:"bold italic",//使文字加粗体或变斜体
                    font:"宋体",//设置文本的字体
                    textAlign:"center",//设置文本的水平对齐方式
                    textPosition:"bottom",//设置文本的垂直位置
                    textMargin:5,//设置条形码和文本之间的间距
                    fontSize:13,//设置文本的大小
                    background:"#fff",//设置条形码的背景
                    lineColor:"#000",//设置条和文本的颜色。
                    margin:0,//设置条形码周围的空白边距
                    marginBottom:5,
                    marginLeft:10,
                });
                //备注信息
                JsBarcode("#tipsContent", value, {
                    format: "CODE128",//选择要使用的条形码类型
                    width:2,//设置条之间的宽度
                    height:0,//高度
                    displayValue:true,//是否显示文字
                    text:tipsContent,//覆盖显示的文本
                    // fontOptions:"bold",//使文字加粗体或变斜体
                    font:"宋体",//设置文本的字体
                    textAlign:"center",//设置文本的水平对齐方式
                    textPosition:"bottom",//设置文本的垂直位置
                    textMargin:3,//设置条形码和文本之间的间距
                    fontSize:12,//设置文本的大小
                    background:"#fff",//设置条形码的背景
                    lineColor:"#000",//设置条和文本的颜色。
                    margin:0,//设置条形码周围的空白边距
                    marginBottom: 5,
                });
                //返给后台打印确认
                let sendBackStatus = await this.$api.sendBackStatus_print({dossier_id:value});
                console.log(sendBackStatus)
            },
        },
        mounted() {
            this.getQueryListData(this.pagination);
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .caseWaitingPage{
        padding: 20px 0;
        .caseWaitingList{
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
        #printAreaInfo{
            display: none
        }
    }
    #printAreaInfo{
        text-align: center;
        #canvasCode,#tipsContent{
            display: flex;
            margin: 0 auto;
        }
        .canvasImg{
            margin: 0 auto;
        }
    }
</style>