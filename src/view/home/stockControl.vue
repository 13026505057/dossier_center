<template>
    <div class="stockControlPage"> 
        <div class="stockControlList">
            <a-row :gutter="16" justify="center" class="searchBtnInfo">
                <a-col class="gutter-row" :span="5">
                    状态类型：
                    <a-select :defaultValue="checkedInfo.statusChecked" @change="handleChange_status" style="width: 120px">
                        <a-select-option :value="item.title" :key="item.itemId"
                            v-for="(item) in checkedInfo.statusList">
                            {{ item.title }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <div class="addCaseInfo">
                        <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
                    </div>
                </a-col>
            </a-row>
            <a-table bordered :columns="columns_stock" :pagination="pagination"
                :data-source="tableData_stock" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading" >
                <span slot="case_status" slot-scope="text"
                    :class="text==0?'activeNotHad':text==1?'activeHanding':''">
                    {{ text == 0?'未开始':text==1?'进行中':'已结束'}} 
                    
                </span>
                <template slot="operation" slot-scope="text,record">
                    <a-button class="editDate active01" @click="detailItem(record)" size="small">详情</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(1,record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增盘点任务 -->
            <a-modal title="新增盘点任务"
                centered v-model="showModel.modalCase" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in caseDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index==0"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-select style="margin-top: 10px;width: 100%;" @change="checkedDepartment" mode="multiple"
                        :placeholder="item.placeholder" v-model="submitDataInfo[item.dom]" optionLabelProp="label" v-else>
                        <a-select-option v-for="item in showModel[item.dom]"
                            :value="item.key" :label="item.name" 
                            :key="item.key"> 
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </div>
            </a-modal>
            <!-- 盘点任务物品详情 -->
            <a-modal title="盘点任务物品详情"
                centered v-model="showModel.modalDetail" @ok="()=> showModel.modalDetail = false">
                <a-table bordered :columns="columns_detail" class="tableCaseData" size="middle" 
                    @change="handleTableChange" :pagination="pagination_detail"
                    :data-source="tableData_detail" :loading="loading" >
                    <span slot="detail_status" slot-scope="text"
                        :style="{color:text==0?'#e6a23c':text==1?'green':'red'}">
                        {{ text == 0?'未开始':text==1?'正常':'异常', }}
                    </span>
                    <template slot="operation" slot-scope="text,record">
                        <a-button class="editDate" @click="editItem(record)" 
                            size="small" v-if="record.detail_status==2">处理异常
                        </a-button>
                        <a-modal title="处理异常状态" centered 
                            v-model="showModel.modalDetailInfo" 
                                @ok="confirmBtn"
                                @cancel="resetStatusInfo"
                                :maskStyle="{opacity: 0.2}" :width="400">
                            <a-input placeholder="请输入异常状态信息" v-model="statusInfo.err_deal"/>
                        </a-modal>
                    </template>
                </a-table>
            </a-modal>
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
                        { title: '全部', itemId: -99 },
                        { title: '未开始', itemId: 0 },
                        { title: '进行中', itemId: 1 },
                        { title: '已结束', itemId: 2 },
                    ], 
                },
                showModel: {
                    modalCase: false,
                    confirmType: false, //提交方式：true：新增 false：修改
                    stockDataList: [],  //所需盘点的存储设备列表
                    userDataList: [],  //人员调配列表

                    //物品盘点详情
                    modalDetail: false,
                    modalDetailInfo: false,
                },
                statusInfo:{
                    check_line_id: '',
                    err_deal: ''
                },
                submitDataInfo: {
                    case_name: '',
                    stockDataList: [],
                    userDataList: []
                },
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                pagination_detail: {
                    pageNum: 1,
                    pageSize: 10,
                    check_head_id: 0
                },
                loading: false,
                columns_stock: [
                    { title: '#', dataIndex: 'index', },
                    { title: '盘点任务名称', dataIndex: 'case_name', },
                    { title: '创建时间', dataIndex: 'case_time', },
                    { title: '发起人', dataIndex: 'case_Pname', },
                    {
                        title: '任务状态', dataIndex: 'case_status',
                        scopedSlots: { customRender: 'case_status' },
                    },
                    { title: '负责人', dataIndex: 'case_head', },
                    {
                        title: '操作', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_stock: [],
                //新增盘点任务
                caseDataInfoList: [
                    { captionTitle: '任务名称',placeholder: '请输入任务名称',dom:'case_name' },
                    { captionTitle: '所需盘点的存储设备',placeholder: '请选择所需盘点的存储设备',dom:'stockDataList' },
                    { captionTitle: '指定盘点人',placeholder: '请选择指定盘点人',dom:'userDataList' },
                ],
                //盘点任务详情
                columns_detail: [
                    { title: '#', dataIndex: 'index', },
                    { title: '卷宗名称', dataIndex: 'detail_name', },
                    { title: '存储位置', dataIndex: 'detail_local', },
                    {
                        title: '盘点状态', dataIndex: 'detail_status',
                        scopedSlots: { customRender: 'detail_status' },
                    },
                    { title: '盘点结果', dataIndex: 'detail_result', },
                    {
                        title: '操作', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_detail: [],
            }
        },
        mounted() {
            this.getStockListList(this.pagination);
            this.getDataListInfo();
        },
        methods: {
            //选择
            checkedDepartment(value){
                console.log(value)
            },
            //盘点状态筛选
            handleChange_status(e,state){
                console.log(e,state)
                if(state.key == -99) state.key = ''
                this.getStockListList({
                    ...this.pagination,
                    check_status: state.key
                });
            },
            //分页
            handleTableChange(pagination) {
                console.log(pagination)
                if(!this.showModel.modalDetail){
                    const pager = { ...this.pagination };
                    pager.current = pagination.current;
                    pager.pageNum = pagination.current;
                    this.pagination = pager;
                    this.getStockListList(this.pagination);
                }else{
                    const pager = { ...this.pagination_detail };
                    pager.current = pagination.current;
                    pager.pageNum = pagination.current;
                    this.pagination_detail = pager;
                    this.getStockDetailList(this.pagination_detail.check_head_id);
                }   
            },
            detailItem(e){
                console.log(e)
                this.showModel.modalDetail = true;
                this.getStockDetailList(e.key);
            },
            editItem(e){
                console.log(e)
                this.showModel.modalDetailInfo = true;
                this.statusInfo.check_line_id = e.key
            },
            //获取盘点列表
            async getStockListList(dataInfo){
                this.loading = true;
                const stockList = await this.$api.getStockList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = stockList.data.list;
                const stockData = [];
                queryCaseList.forEach((item,index)=>{
                    stockData.push({
                        key: item.check_head_id,
                        index: index+1,
                        case_name: item.check_name,
                        case_time: item.create_time,
                        case_Pname: item.create_user_name,
                        case_status: item.check_status,
                        case_head: item.case_head,
                    })
                })
                this.tableData_stock= stockData;
                pagination.total = stockList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            //获取盘点任务详情列表
            async getStockDetailList(headId){
                this.loading = true;
                this.pagination_detail.check_head_id = headId;
                const detailList = await this.$api.getStockDetailList_Page(this.pagination_detail);
                // console.log(departmentList);
                const pagination = { ...this.pagination_detail };
                const queryCaseList = detailList.data.list;
                const detailData = [];
                queryCaseList.forEach((item,index)=>{
                    detailData.push({
                        key: item.check_line_id,
                        index: index+1,
                        detail_name: item.dossier_name,
                        detail_local: ''+item.room_name+'-'+item.shale_name+'-'+item.cell_name+'',
                        detail_status: item.check_status,
                        detail_result: item.err_deal,
                    })
                })
                this.tableData_detail= detailData;
                pagination.total = detailList.data.total;
                this.pagination_detail = pagination;
                this.loading = false;
            },
            // 获取所需设备信息列表
            async getDataListInfo(){
                let returnData_stock = await this.$api.getDeviceList();
                let stockDataList = [];
                returnData_stock.data.forEach(item=>{
                    stockDataList.push({
                        key: item.shale_id,
                        name: item.shale_name
                    })
                })
                this.showModel.stockDataList = stockDataList;
                let returnData_user = await this.$api.getOperatorListData();
                let userDataList = [];
                returnData_user.data.forEach(item=>{
                    userDataList.push({
                        key: item.user_id,
                        name: item.user_name
                    })
                })
                this.showModel.userDataList = userDataList;
            },
            confirmBtn(){
                console.log(1232131)
                if(this.showModel.confirmType){
                    this.addItem();
                }else if(this.showModel.modalDetailInfo){
                    
                    this.addStatusChecked();
                }
            },
            addStatusChecked(){
                this.$api.editStockDetai(this.statusInfo).then(()=>{
                    this.getStockDetailList(this.pagination_detail.check_head_id);
                    this.showModel.modalDetailInfo = false;
                })
            },
            //重置表单
            resetSubmitInfo(){
                this.showModel.confirmType = false;
                this.submitDataInfo['userDataList'] = [];
                this.submitDataInfo['stockDataList'] = [];
                this.submitDataInfo['case_name'] = '';
            },
            //重置提交处理异常
            resetStatusInfo(){
                this.statusInfo.check_line_id = '',
                this.statusInfo.err_deal = '';
                this.showModel.modalDetailInfo = false;
            },
            //添加盘点任务
            addInfo(){
                this.showModel.confirmType = true;
                this.showModel.modalCase = true;
            },
            async addItem(){
                const returnData = await this.$api.addCaseDataInfo({
                    check_name: this.submitDataInfo['case_name'],
                    shale_ids: this.submitDataInfo['stockDataList'].join(),
                    user_ids: this.submitDataInfo['userDataList'].join(),
                });
                this.showModel.modalCase = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getStockListList(this.pagination);
                    }
                }
            },
            // 移除盘点任务
            async deleteItem(e,f){
                console.log(e,f)
                const returnData = await this.$api.deleteCaseDataInfo({ check_head_id: f.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getStockListList(this.pagination);
                    }
                }
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    @activeHading: #e6a23c;
    .stockControlPage{
        padding: 20px 0;
        .stockControlList{
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
                span{
                    &.activeNotHad{
                        color: green;
                    }
                    &.activeHanding{
                        color: @activeHading;
                    }
                }
            }
        }
    }
</style>