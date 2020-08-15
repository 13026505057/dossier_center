<template>
    <div class="setApprovalPage"> 
        <div class="setApprovalList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_approval" :pagination="pagination"
                :data-source="tableData_approval" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItemFlow(record,1)" size="small">修改</a-button>
                    <a-button class="editDate" @click="addItemFlow(record,3)" size="small">新增</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
                <a-table slot="expandedRowRender" :columns="innerColumns" slot-scope="record"
                    :dataSource="record.listData" :pagination="false" size="middle">
                    <template slot="approve_list" slot-scope="text">
                        <span v-for="(item,index) in text" :key="index">
                            {{ item.name }}
                            <span v-if="text.length>0 && index+1<text.length">&</span>
                        </span>
                    </template>
                    <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItemApp(record,2)" size="small">修改</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteDetailItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
                </a-table>
            </a-table>
            <!-- 新增批流信息 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalInput" @ok="confirmBtn(submitDataInfo['org_flow_step'])" @cancel="resetSubmitInfo">
                <div style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 23%;padding-right: 20px">
                        定义审批流： 
                    </span>
                    <a-input placeholder="审批流名称" allowClear v-model="submitDataInfo['org_flow_name']"
                        style="display:table-cell;width: 35%;padding-right: 3%" :disabled="!submitDataInfo['approveDisBtn']"/>
                    <a-select style="width: 100px" :disabled="!submitDataInfo['approveDisBtn']"
                        placeholder="请选择类型" v-model="submitDataInfo.org_flow_type">
                        <a-select-option v-for="item in addOperatorItem.departmentList" 
                            :value="item.flow_type_id" :key="item.flow_type_id"> {{ item.flow_type_name }}
                        </a-select-option>
                    </a-select>
                    <a-button type="link" :disabled="!submitDataInfo['approveDisBtn']" 
                        @click="addApprovalInfo" v-if="submitDataInfo['org_flow_step']==0">确认
                    </a-button>
                </div>
                <div style="margin-bottom: 10px">
                    <span>
                        定义审批流程： 
                    </span>
                    <a-button type="link" @click="addApprovalItem" :disabled="submitDataInfo['approveDisBtn']"
                        v-if="submitDataInfo['org_flow_step']==0">添加流程</a-button>
                </div>
                <a-timeline mode="alternate">
                    <a-timeline-item v-for="(item,index) in submitDataInfo.approveList" :key="index">
                        <div style="margin-bottom: 10px;display:table;width:100%;">
                            <span style="display:table-cell;">流程{{index+1}}: </span>
                            <a-button type="link" :disabled="submitDataInfo['approveDisBtn']" 
                                @click="removeByList(index)">移除</a-button>
                        </div>
                        <div>
                            <!--审批流程名称-->
                            <a-input :placeholder="'请输入审批流程'+(index+1) +'名称'" allowClear 
                                :disabled="submitDataInfo['approveDisBtn']" v-model="item.approve_name" 
                                style="width: 55%;"/>
                            <!--审批流程类型-->
                            <a-select style="width: 40%;" @change="checkedDepartmentLine($event,index)" placeholder="请选择类型"
                                v-model="item.approve_type" :disabled="submitDataInfo['approveDisBtn']">
                                <a-select-option v-for="item in addOperatorItem.departmentLineList"
                                    :value="item.flow_approve_type_code" :key="item.flow_approve_type_id">
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                            <!--审批人名称-->
                            <a-select style="margin-top: 10px;width: 150px;" mode="multiple"
                                placeholder="请选择审批人名称" v-model="item.approve_userId" optionLabelProp="label"
                                :disabled="submitDataInfo['approveDisBtn']">
                                <a-select-option v-for="item in item.approve_userDepartment"
                                    :value="item.flow_approve_type_id" :label="item.flow_approve_type_name" 
                                    :key="item.flow_approve_type_id"> 
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </a-modal>
            <!-- 新增审批流程(单) -->
            <a-modal :title="showModel.captionsTitle" centered v-model="showModel.modalAdd_single" 
                @ok="confirmBtn(submitDataInfo['org_flow_step'])" @cancel="resetSubmitInfo_single">
                <div style="margin-bottom: 10px">
                    <span>定义审批流程：</span>
                </div>
                <a-timeline>
                    <a-timeline-item>
                        <div style="margin-bottom: 10px;display:table;width:100%;">
                            <span style="display:table-cell;">{{ approveData_single['approve_name'] }}: </span>
                        </div>
                        <div>
                            <!--审批流程名称-->
                            <a-input :placeholder="'请输入审批流程'+approveData_single['approve_name']+'名称'" allowClear 
                                v-model="approveData_single['approve_name']" style="width: 55%"/>
                            <!--审批流程类型-->
                            <a-select style="width: 40%;" @change="checkedDepartmentLine_single($event)" placeholder="请选择类型"
                                v-model="approveData_single.approve_type">
                                <a-select-option v-for="item in addOperatorItem.departmentLineList"
                                    :value="item.flow_approve_type_code" :key="item.flow_approve_type_id">
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                            <!--审批人名称-->
                            <a-select style="margin-top: 10px;width: 150px;" mode="multiple"
                                placeholder="请选择审批人名称" v-model="approveData_single.approve_userId" optionLabelProp="label">
                                <a-select-option v-for="item in approveData_single.approve_userDepartment"
                                    :value="item.flow_approve_type_id" :label="item.flow_approve_type_name" 
                                    :key="item.flow_approve_type_id"> 
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </a-modal>
            <!-- 修改审批流程(单) -->
            <a-modal :title="showModel.captionsTitle" centered v-model="showModel.modalInput_single" 
                @ok="confirmBtn(submitDataInfo['org_flow_step'])" @cancel="resetSubmitInfo_single">
                <div style="margin-bottom: 10px">
                    <span>定义审批流程：</span>
                </div>
                <a-timeline>
                    <a-timeline-item>
                        <div style="margin-bottom: 10px;display:table;width:100%;">
                            <span style="display:table-cell;">{{ approveData_single['approve_name'] }}: </span>
                        </div>
                        <div>
                            <!--审批流程名称-->
                            <a-input :placeholder="'请输入审批流程'+approveData_single['approve_name']+'名称'" allowClear 
                                v-model="approveData_single['approve_name']" style="width: 55%"/>
                            <!--审批流程类型-->
                            <a-select style="width: 40%;" @change="checkedDepartmentLine_single($event)" placeholder="请选择类型"
                                v-model="approveData_single.approve_type">
                                <a-select-option v-for="item in addOperatorItem.departmentLineList"
                                    :value="item.flow_approve_type_code" :key="item.flow_approve_type_id">
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                            <!--审批人名称-->
                            <a-select style="margin-top: 10px;width: 150px;" mode="multiple" v-if="shownow"
                                placeholder="请选择审批人名称" v-model="approveData_single.approve_userId" optionLabelProp="label">
                                <a-select-option v-for="item in approveData_single.approve_userDepartment"
                                    :value="item.flow_approve_type_id" :label="item.flow_approve_type_name" 
                                    :key="item.flow_approve_type_id"> 
                                    {{ item.flow_approve_type_name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </a-modal>
        </div>
    </div>
</template>

<script>
    const initSubmitInfo = ()=>{
        let dataInfo = {
            org_flow_step: 0,
            org_flow_id: '',
            org_flow_name: '',
            org_flow_type: '',
            approveDisBtn: true,
            approveList: [{
                approve_name: '',
                approve_type: '',
                approve_userDepartment: [],
                approve_list: [],
                approve_userId: [],
                attribute_order: 1
            }],
        }
        return dataInfo
    }
    export default {
        watch:{
           'approveData_single.approve_type':function(val,old){
               console.log(val)
               if(val == 'ZBBMFZR'){
                    this.shownow = false
               }else{
                   this.shownow = true
               }
           }
        },
        data(){
            return{
                shownow:true,
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                showModel: {
                    captionsTitle: '',
                    modalInput: false,
                    //单项修改
                    modalInput_single: false,
                    modalAdd_single: false
                },
                //提交信息 
                submitDataInfo: initSubmitInfo(),
                contentNum: 0, //提交流程下标
                //单项修改
                approveData_single: {
                    approve_name: '',
                    approve_type: '',
                    approve_list: [],
                    approve_userId: [],
                    approve_userDepartment: [],
                    attribute_order: 1
                },
                // 下拉类型选项  
                addOperatorItem: {
                    departmentList: [], //审批流类型
                    departmentLineList: [], //审批流程类型
                    departmentList_opera: [], //部门列表
                    departmentList_organ: [],   //机构列表
                    departmentList_man: [],   //审批人列表
                },
                columns_approval: [
                    { title: '审批名称', dataIndex: 'name', },
                    { title: '审批类型', dataIndex: 'type', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_approval: [],
                innerColumns: [
                    { title: '审批流程名称', dataIndex: 'approve_name', },
                    { title: '审批人', dataIndex: 'approve_list', scopedSlots: { customRender: 'approve_list' } },
                    { title: '审批流程类型', dataIndex: 'approve_type', },
                    { title: '操作流程', key: 'operation', scopedSlots: { customRender: 'operation' }, }, 
                ]
            }
        },
        mounted() {
            this.getApprovalList(this.pagination);
            this.getTypeListData();
        },
        methods: {
            //选择审批流程类型
            checkedDepartmentLine(value,index_o){
                this.submitDataInfo.approve_type = value;
                const listData_type = ['ZDR','ZDBM','ZDJG'];
                const listData_list = ['departmentList_man','departmentList_opera','departmentList_organ'];
                listData_type.forEach((item,index)=>{
                    if(item == value) this.submitDataInfo.approveList[index_o].approve_userDepartment = this.addOperatorItem[listData_list[index]];
                })
            },
            //审批流程类型(单)
            checkedDepartmentLine_single(value){
                this.approveData_single.approve_list = [];
                this.approveData_single.approve_userId = [];
                this.approveData_single.approve_type = value;
                const listData_type = ['ZDR','ZDBM','ZDJG'];
                const listData_list = ['departmentList_man','departmentList_opera','departmentList_organ'];
                listData_type.forEach((item,index)=>{
                    if(item == value) this.approveData_single.approve_userDepartment = this.addOperatorItem[listData_list[index]];
                })
            },
            //分页
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getApprovalList(this.pagination);
            },
            //获取审批流程列表
            async getApprovalList(dataInfo){
                this.loading = true;
                const deviceList = await this.$api.getApproveFlowList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = deviceList.data.list;
                const deviceData = [];
                queryCaseList.forEach(item_org=>{
                    const data_flowLine = [];
                    item_org.orgFlowApprove.forEach(item_app=>{
                        let approve_userList = [];
                        let approve_userId = [];
                        item_app.orgFlowApproveUser.forEach(item_user=>{
                            approve_userList.push({
                                key: item_user.approve_user_id,
                                id: item_user.approve_user_id,
                                name: item_user.user_true_name
                            })
                            approve_userId.push(item_user.user_id)
                        })
                        data_flowLine.push({
                            key: item_app.approve_id,
                            approve_name: item_app.approve_name,
                            approve_type: item_app.flow_approve_type_name,
                            approve_list: approve_userList,
                            approve_userId: approve_userId,
                            approve_typeCode: item_app.approve_type,
                            approve_userDepartment: []
                        })
                    })
                    deviceData.push({
                        key: item_org.org_flow_id,
                        name: item_org.org_flow_name,
                        type: item_org.flow_type_name,
                        listData: data_flowLine
                    })
                })
                this.tableData_approval = deviceData;
                pagination.total = deviceList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取所需参数(审批流类型/)
            async getTypeListData(){
                //审批流类型列表
                const returnData_type = await this.$api.getApproveTypeData();
                this.addOperatorItem['departmentList'] = returnData_type.data;
                const returnData_lineData = await this.$api.getApproveLineTypeData();
                this.addOperatorItem['departmentLineList'] = returnData_lineData.data;
                //部门列表
                const returnData_dep = await this.$api.getDepartmentList();
                const reutrnData_depList = [];
                returnData_dep.data.forEach(item=>{
                    reutrnData_depList.push({
                        flow_approve_type_id: item.dept_id,
                        flow_approve_type_name: item.dept_name
                    })
                }) 
                this.addOperatorItem['departmentList_opera'] = reutrnData_depList;
                //机构列表
                const returnData_organ = await this.$api.getOrganList();
                const reutrnData_organList = [];
                returnData_organ.data.forEach(item=>{
                    reutrnData_organList.push({
                        flow_approve_type_id: item.org_id,
                        flow_approve_type_name: item.org_name
                    })
                })
                this.addOperatorItem['departmentList_organ'] = reutrnData_organList;
                //审批人列表
                const returnData_man = await this.$api.getOperatorListData();
                const reutrnData_manList = [];
                returnData_man.data.forEach(item=>{
                    reutrnData_manList.push({
                        flow_approve_type_id: item.user_id,
                        flow_approve_type_name: item.user_name
                    })
                })
                this.addOperatorItem['departmentList_man'] = reutrnData_manList;
            },
            //添加审批流
            async addApprovalInfo(){
                const returnData = await this.$api.addApproveFlowData({
                    org_flow_name: this.submitDataInfo['org_flow_name'],
                    org_flow_type: this.submitDataInfo['org_flow_type'],
                })
                if(returnData){
                    if(returnData.code == '0'){
                        this.submitDataInfo.approveDisBtn = false;
                        this.submitDataInfo.org_flow_id = returnData.data.org_flow_id
                    }
                }
            },
            //添加审批流程
            addApprovalItem(){
                this.submitDataInfo['approveList'].push({
                    approve_name: '',
                    approve_list: [],
                    approve_userDepartment: [],
                    approve_type: '',
                    attribute_order: this.submitDataInfo['approveList'].length+1
                })
            },
            //从新增审批流程中移除
            removeByList(index){
                if(this.submitDataInfo.org_flow_step==0){
                    this.submitDataInfo.approveList.splice(index,1);
                }else if(this.submitDataInfo.org_flow_step==2){
                    console.log('移除审批流程')
                }
            },
            // 移除审批流
            async deleteItem(e){
                const returnData = await this.$api.deleteApproveFlowData({ org_flow_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageNum-1))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getApprovalList(this.pagination);
                    }
                }
            },
            // 移除审批流程
            async deleteDetailItem(e){
                const returnData = await this.$api.deleteApproveData({ approve_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getApprovalList(this.pagination);
                    }
                }
            },
            confirmBtn(itemId){
                const listData = {
                    0: "addItem",
                    1: "comfirmEditFlow",
                    2: "comfirmEditApp",
                    3: "andItemCase"
                }
                // console.log(listData[itemId])
                this[listData[itemId]]()
            },
            // 修改审批流信息
            editItemFlow(e,order){
                this.showModel.captionsTitle = '修改审批流信息';
                this.submitDataInfo.org_flow_step = order;
                const typeData = ['org_flow_id','org_flow_name','org_flow_type','approveList'];
                const typeData_cell = ['key','name','type','listData'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_cell[index]];
                })
                e.listData.forEach((itemCode)=>{
                    let listData_type = ['ZDR','ZDBM','ZDJG'];
                    let listData_list = ['departmentList_man','departmentList_opera','departmentList_organ'];
                    listData_type.forEach((item,index)=>{
                        if(item == itemCode.approve_typeCode){
                            itemCode.approve_userDepartment = this.addOperatorItem[listData_list[index]];
                        }
                    })
                })
                this.showModel.modalInput = true;
            },
            addItemFlow(e,order){
                this.showModel.captionsTitle = '新增审批流程信息';
                this.submitDataInfo.org_flow_step = order;
                this.showModel.modalAdd_single = true;
                this.submitDataInfo['org_flow_id'] = e.key 
                this.approveData_single.attribute_order = e.listData.length+1;
            },
            // 修改审批流程信息
            editItemApp(e,order){
                this.showModel.captionsTitle = '修改审批流程信息';
                this.submitDataInfo.org_flow_step = order;
                this.approveData_single = e;
                let listData_type = ['ZDR','ZDBM','ZDJG'];
                let listData_list = ['departmentList_man','departmentList_opera','departmentList_organ'];
                listData_type.forEach((item,index)=>{
                    if(item == e.approve_typeCode){
                        this.approveData_single['approve_userDepartment'] = this.addOperatorItem[listData_list[index]];
                    }
                })
                this.showModel.modalInput_single = true;
            },
            //确认提交修改审批流信息
            comfirmEditFlow(){
                let dataInfo = {
                    org_flow_id: this.submitDataInfo.org_flow_id,
                    org_flow_name: this.submitDataInfo.org_flow_name,
                    org_flow_type: this.submitDataInfo.org_flow_type
                }
                this.$api.editApproveFlowData(dataInfo).then(()=>{
                    this.showModel.modalEdit = false;
                    this.getApprovalList(this.pagination);
                    this.resetSubmitInfo();
                })
            },
            //确认提交修改
            comfirmEditApp(){
                this.$api.editApproveData({
                    approve_id: this.approveData_single.key,
                    approve_name: this.approveData_single.approve_name,
                    approve_type: this.approveData_single.approve_type,
                }).then(()=>{
                    // let user_list = [];
                    // console.log(this.approveData_single.approve_list)
                    // this.approveData_single.approve_list.forEach(item=>{
                    //     user_list.push(item.id)
                    // })
                    this.$api.editApproveManData({
                        approve_id: this.approveData_single.key,
                        ids: this.approveData_single.approve_userId.join()
                    }).then(()=>{
                        this.showModel.modalInput_single = false;
                        this.getApprovalList(this.pagination);
                        this.resetSubmitInfo();
                    })
                })
            },
            //重置表单
            resetSubmitInfo(){
                initSubmitInfo()
                this.contentNum = 0
                this.showModel.modalEdit = false
            },
            resetSubmitInfo_single(){
                this.approveData_single = {
                    approve_name: '',
                    approve_type: '',
                    approve_list: [],
                    approve_userId: [],
                    approve_userDepartment: [],
                    attribute_order: 1
                }
            },
            andItemCase(){
                console.log(this.approveData_single)
                const listData = this.approveData_single;
                this.recurTest(listData,0);
            },
            //新增审批流
            addInfo(){
                this.showModel.captionsTitle = '新增审批流信息';
                this.showModel.modalInput = true;
            },
            // 确认提交--新增审批流
            addItem(){
                const listData = this.submitDataInfo['approveList'];
                this.recurTest(listData[0],0);
            },
            //递归遍历
            recurTest(item,index){
                console.log(item)
                this.$api.addApproveData({
                    org_flow_id: this.submitDataInfo['org_flow_id'],
                    approve_name: item.approve_name,
                    approve_type: item.approve_type,
                    attribute_order: item.attribute_order,
                    is_last: Number(index+1 == this.submitDataInfo['approveList'].length)
                }).then((returnData)=>{
                    this.$api.addApproveManData({
                        approve_id: returnData.data.approve_id,
                        ids: item.approve_userId.join()
                    })
                    console.log(index+' well done')
                    if(++index == this.submitDataInfo['approveList'].length){
                        if(returnData.code == '0'){
                            this.showModel.modalInput = false;
                            this.showModel.modalAdd_single = false;
                            this.resetSubmitInfo();
                            this.resetSubmitInfo_single();
                            this.getApprovalList(this.pagination);
                        }
                    }else this.recurTest(this.submitDataInfo['approveList'][index],index)
                });
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setApprovalPage{
        padding: 20px 0;
        .setApprovalList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            overflow: auto;
            .addCaseInfo{
                text-align: left;
                padding-left: 20px; 
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
                    color: white;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                }
            }
        }
    }
</style>