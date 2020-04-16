<template>
    <div class="dossierPages">
        <div class="dossierList">
            <!-- 筛选 -->
            <a-row :gutter="16" justify="center" class="searchBtnInfo">
                <a-col class="gutter-row" :span="8">
                    <a-range-picker @change="confirmData" separator="至" :placeholder="['开始时间','结束时间']">
                        <i class="iconfont icon-yemian" slot="suffixIcon"></i>
                    </a-range-picker>
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <a-input-search placeholder="请输入案件名称" @search="confirmSearch('case_name')" 
                        enterButton v-model="searchDataInfo.case_name" />
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <a-input-search placeholder="请输入案件编号" @search="confirmSearch('case_police_nm')" 
                        enterButton v-model="searchDataInfo.case_police_nm" />
                </a-col>
            </a-row>
            <!-- tab标签 -->
            <a-tabs :defaultActiveKey="1" tabPosition="top"
                style="margin-top: 20px;text-align: left;" @change="changeTabItem">
                <a-tab-pane v-for="(item) in tabListBtn" :tab="item.title" :key="item.label">
                    <!-- tab表格 -->
                    <a-table :columns="columns_dossier" :dataSource="tableData_dossier" :pagination="pagination" :loading="loading"
                        class="components-table-demo-nested tableCaseData" size="middle" @change="handleTableChange"
                        @expand="expandedRowItem">
                        <template slot="operation" slot-scope="text,record">
                            <span class="detailData" @click="showCaseDetail(record)">案卡</span>
                        </template>
                        <a-table slot="expandedRowRender" :columns="innerColumns" slot-scope="record"
                            :dataSource="record.listData" :pagination="false" size="middle">
                            <template slot="operation" slot-scope="text,record">
                                <span class="printQr table-operation" @click="getBarCodeInfo(text,record)" 
                                    v-print="'#printAreaInfo'">打印条码</span>
                            </template>
                        </a-table>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
            <!-- 案卷详情tab -->
            <a-modal title="案件案卡" @ok="showModel.showCaseDetail = false"
                centered v-model="showModel.showCaseDetail" style="width: 50%;">
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
        <div id="printAreaInfo"> 
            <canvas id="canvasCode"></canvas>
            <canvas id="tipsContent"></canvas>
            <!--<img id="canvasCode"/>
            <img id="tipsContent"/>-->
        </div>
    </div>
</template>

<script>
    let JsBarcode = require('jsbarcode');
    export default {
        data(){
            return{
                searchDataInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    case_type_name: '',
                    begin_la_time: '',
                    end_la_time: '',
                    case_name: '',
                    case_police_nm: ''
                },
                //tab标签
                tabListBtn: [
                    { label: 1, title: '全部' },
                    { label: 2, title: '刑事' },
                    { label: 3, title: '行政' },
                    { label: 4, title: '现场处罚' },
                ],
                columns_dossier: [
                    { title: '序号', dataIndex: 'index', },
                    { title: '案件名称', dataIndex: 'caseName', },
                    { title: '案件编号', dataIndex: 'caseNumber', },
                    { title: '案件来源', dataIndex: 'caseFrom', },
                    { title: '案件类型', dataIndex: 'typeCase', },
                    { title: '案件状态', dataIndex: 'stateCase', },
                    { title: '受案单位', dataIndex: 'acceptUnit', },
                    { title: '主办单位', dataIndex: 'hostUnit', },
                    { title: '主办民警', dataIndex: 'hostPeo', },
                    {
                        title: '操作', dataIndex: 'operation', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_dossier: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
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
                //显示信息
                showModel: {
                    showCaseDetail: false,  //案件案卡
                    tableDataCase: [],  
                }
            }
        },
        mounted() {
            this.getQueryListData(this.searchDataInfo);
        },
        methods: {
            // 获取打印条码信息
            getBarCodeInfo(e,f){
                console.log(e,f)
                let content = f.dossier_name;
                if(content.length>11) content = content.slice(0,11) + '...';
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
                    fontSize:15,//设置文本的大小
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
                    fontSize:16,//设置文本的大小
                    background:"#fff",//设置条形码的背景
                    lineColor:"#000",//设置条和文本的颜色。
                    margin:0,//设置条形码周围的空白边距
                    marginBottom: 5,
                });
                //返给后台打印确认
                let sendBackStatus = await this.$api.sendBackStatus_print({dossier_id:value});
                console.log(sendBackStatus)
            },
            confirmData(date, dateString) {
                this.searchDataInfo['begin_la_time'] = dateString[0];
                this.searchDataInfo['end_la_time'] = dateString[1];
                this.getQueryListData(this.searchDataInfo);
            },
            confirmSearch(dom){
                console.log(this.searchDataInfo[dom]);
                this.searchDataInfo.pageNum = 1,
                this.pagination.current = 1;
                this.searchDataInfo.pageSize = 10,
                this.getQueryListData(this.searchDataInfo);
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.searchDataInfo['pageNum'] = pager.current;
                this.getQueryListData(this.searchDataInfo);
            },
            //展开获取子集
            async expandedRowItem(state,data){
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
                    this.tableData_dossier[data.index-1].listData = dataInfo;
                }
            },
            // 切换tab标签
            changeTabItem(checkedItem){
                this.searchDataInfo['case_type_name'] = this.tabListBtn[checkedItem-1].title;
                if(checkedItem == 1) this.searchDataInfo['case_type_name'] = '';
                this.getQueryListData(this.searchDataInfo);
            },
            //获取案件信息
            async getQueryListData(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.getCaseList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list;
                const queryData = [];
                queryCaseList.forEach((item,index)=>{
                    queryData.push({
                        key: item.case_id,
                        index: index+1,
                        caseName: item.case_name,
                        caseNumber: item.case_police_nm,
                        caseFrom: item.case_from,
                        typeCase: item.case_type_name,
                        stateCase: item.case_status_name,
                        acceptUnit: item.sa_org_name,
                        receivedTime: item.sa_time,
                        hostUnit: item.organiza_org_name,
                        hostPeo: item.organiza_user_name,
                        listData: [],
                    })
                });
                this.tableData_dossier = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            //显示案件案卡信息
            showCaseDetail(data){
                console.log(data)
                this.showModel.showCaseDetail = true;
                let dataDomArr = [
                    { dom: 'caseNumber',title: '案件编号' },
                    { dom: 'caseName',title: '案件名称' },
                    { dom: 'caseFrom',title: '案件来源' },
                    { dom: 'typeCase',title: '案件类型' },
                    { dom: 'acceptUnit',title: '受案单位' },
                    { dom: 'stateCase',title: '案件状态' },
                    { dom: 'hostUnit',title: '主办单位' },
                    { dom: 'hostPeo',title: '主办民警' },
                ];
                let dataDom = [];
                dataDomArr.forEach((item,index)=>{
                    dataDom.push({
                        title: dataDomArr[index].title,
                        value: data[dataDomArr[index].dom]
                    })
                })
                this.showModel.tableDataCase = dataDom;
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    @detailBtn: #e6a23c;
    .dossierPages{
        padding: 20px 0;
        .dossierList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            .searchBtnInfo{
                padding: 0 10px;
            }
            .tableCaseData{
                margin-top: 20px;
                overflow: hidden;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .detailData,.printQr{
                    display: inline-block;
                    padding: 0 5px;
                    color: white;
                    border-radius: 5px;
                }
                .detailData{
                    background-color: @detailBtn;
                }
                .printQr{
                    background-color: @bgBtnColor;
                }
            }
        }
        #printAreaInfo{
            display: none;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            font-family:"fantasy";
            #canvasCode,#tipsContent{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>