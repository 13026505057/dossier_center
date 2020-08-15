<template>
    <div class="setOperatorPage"> 
        <div class="setOperatorList">
            <div class="addCaseInfo">
                <span @click="addInfo">
                    <i class="iconfont icon-cf-c101"></i>新增
                </span>
                <el-input v-model="sel.user_true_name" placeholder="请输入姓名" style="width:120px;margin-left:20px;"></el-input>
                <el-input v-model="sel.current_dept_ids" placeholder="请输入部门" style="width:120px;margin-left:10px;"></el-input>
                  <span @click="selct" style="margin-left:10px;">
                    <i class="el-icon-search"></i>查询
                </span>        
            </div>
             
            <a-table bordered :columns="columns_setOperator" :pagination="pagination"
                :data-source="tableData_setOperator" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                    <a-popconfirm title="确定删除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增部门 -->
            <a-modal :title="showModel.captionsTitleInfo"
                centered v-model="showModel.modalFrom" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px"
                        v-if="index<3 && showModel.confirmType">
                        {{ item.captionTitle }}：
                    </span>
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px"
                        v-else-if="index!=2 && !showModel.confirmType">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index<2"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-input-password :placeholder="item.placeholder" v-if="index==2 && showModel.confirmType"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto"/>
                </div>
                <div style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        选择部门： 
                    </span>
                    <a-select style="width: 120px" @change="checkedDepartment" v-model="submitDataInfo.dept_ids">
                        <a-select-option v-for="item in addOperatorItem.departmentList" 
                            :value="item.key" :key="item.key"> {{ item.title }}
                        </a-select-option>
                    </a-select>
                </div>
                <div style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        选择权限： 
                    </span>
                    <a-checkbox :indeterminate="showModel.indeterminate" @change="onCheckAllChange" 
                        :checked="showModel.checkAll">全选
                    </a-checkbox>
                    <a-checkbox-group :options="addOperatorItem.roleList"
                        v-model="addOperatorItem.checkedList" @change="onChange">
                        <template slot="key" slot-scope="option">
                            <span>{{ option.title }}</span>
                        </template>
                        <!-- <span style="color: red" slot="key" slot-scope="title">{{title}}</span> -->
                    </a-checkbox-group>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                sel:{
                   user_true_name:'',
                   current_dept_ids:'',
                   pageNum: 1,
                   pageSize: 10
                },
                
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                showModel: {
                    captionsTitleInfo: '',
                    modalFrom: false,
                    confirmType: false,

                    checkAll: false,
                    indeterminate: true,
                }, 
                submitDataInfo: {
                    user_name: '',
                    user_true_name: '',
                    pass_word: '',
                    dept_ids: '',
                    role_ids: ''
                }, 
                addOperatorItem: {
                    roleList: [],  //总数据列表(多选)
                    departmentList: [],  //select列表(select)
                    checkedList: [],  //已选中列表(多选)
                    checkedAllData: [],  //预备全部选中(多选)
                },
                eachDataInfoList: [
                    { captionTitle: '登录账号',placeholder: '请输入登录账号',dom:'user_name' },
                    { captionTitle: '选择人员',placeholder: '请输入内容',dom:'user_true_name' },
                    { captionTitle: '登录密码',placeholder: '请输入密码',dom:'pass_word' },
                ],
                columns_setOperator: [
                    { title: '姓名', dataIndex: 'name', },
                    { title: '账号', dataIndex: 'account', },
                    { title: '绑定电话', dataIndex: 'phone', },
                    { title: '权限', dataIndex: 'power', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_setOperator: [],
            }
        },
        mounted() {
            this.getOperatorList(this.pagination);
            this.getRoleList();
        },
        methods: {
            //查询
            selct(){
                // this.$api.selctpeo(this.sel).then(res=>{
                //     console.log(res)
                //     this.tableData_setOperator = operatortData;
                // })
                this.getOperatorList(this.sel)
            },
            //选中部门
            checkedDepartment(value) {
                this.submitDataInfo.dept_ids = value;
            },
            onChange(checkedList) {
                this.showModel.indeterminate = !!checkedList.length && checkedList.length < this.addOperatorItem.roleList.length;
                this.showModel.checkAll = checkedList.length === this.addOperatorItem.roleList.length;
            },
            onCheckAllChange(e) {
                this.addOperatorItem.checkedList = e.target.checked ? this.addOperatorItem.checkedAllData : [];
                Object.assign(this.showModel, {
                    indeterminate: false,
                    checkAll: e.target.checked,
                });
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getOperatorList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            // 获取操作员列表
            async getOperatorList(dataInfo){
                this.loading = true;
                const operatortList = await this.$api.getOperatorList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = operatortList.data.list;
                const operatortData = [];
                queryCaseList.forEach(item=>{
                    operatortData.push({
                        key: item.user_id,
                        account: item.user_name, 
                        name: item.user_true_name,
                        phone: item.user_tel,
                        userDept: item.userDept,
                        userRole: item.userRole
                    })
                })
                this.tableData_setOperator = operatortData;
                pagination.total = operatortList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 删除操作员
            async deleteItem(e){
                const returnData = await this.$api.deleteOperator_Page({ user_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getOperatorList(this.pagination);
                    }
                }
            },
            // 获取所需列表(部门/权限)
            async getRoleList(){
                const returnData_role = await this.$api.getRoleList({ pageNum:1,pageSize:100 });
                const returnData_department = await this.$api.getDepartmentList();
                const roleList = returnData_role.data.list;
                const departmentList = returnData_department.data;
                const roleListData = [];   //多选列表
                const departmentListData = [];  //下拉选中
                const checkedAllListData = [];  //预备全部选中
                roleList.forEach((item)=>{
                    roleListData.push({
                        value: item.role_id,
                        label: item.role_name
                    });
                    checkedAllListData.push(item.role_id);
                })
                departmentList.forEach((item)=>{
                    departmentListData.push({
                        key: item.dept_id,
                        title: item.dept_name
                    })
                })
                this.addOperatorItem['roleList'] = roleListData;
                this.addOperatorItem['departmentList'] = departmentListData;
                this.addOperatorItem['checkedAllData'] = checkedAllListData;
            },
            // 修改操作员信息
            async editItem(e){
                this.showModel.confirmType = false;
                this.showModel.captionsTitleInfo = '修改操作员信息';
                const typeData = ['user_id','user_name','user_true_name'];
                const typeData_cell = ['key','account','name'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_cell[index]];
                })
                if(e['userDept'].length>0) this.submitDataInfo['dept_ids'] = e['userDept'][0].dept_id
                const userRoleList = e['userRole'];
                if(userRoleList.length>0){
                    const roleList = [];
                    userRoleList.forEach(item=>{
                        roleList.push(item.role_id)
                    })
                    this.addOperatorItem['checkedList'] = roleList;
                    this.onChange(roleList)
                }
                this.showModel.modalFrom = true;
            },
            //确认提交修改
            comfirmEditItem(){
                this.submitDataInfo.role_ids = this.addOperatorItem.checkedList.join();
                this.$api.editOperatorData(this.submitDataInfo).then(()=>{
                    this.showModel.modalFrom = false;
                    this.getOperatorList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //确定按钮
            confirmBtn(){
                if(this.showModel.confirmType) this.addItem();
                    else this.comfirmEditItem();
            },
            //重置表单
            resetSubmitInfo(){
                Object.keys(this.submitDataInfo).map(item=> this.submitDataInfo[item] = '' )
                this.addOperatorItem['checkedList'] = [];
                this.showModel['checkAll'] = false;
                this.showModel['indeterminate'] = true;
            },
            //新增操作员
            addInfo(){
                this.showModel.confirmType = true;
                this.showModel.modalFrom = true;
                this.showModel.captionsTitleInfo = '新增操作员';
            },
            async addItem(){
                let dataInfo = { ...this.submitDataInfo }
                dataInfo.role_ids = this.addOperatorItem.checkedList.join();
                dataInfo.pass_word = this.$md5(this.submitDataInfo.pass_word)
                const returnData = await this.$api.addOperatorData(dataInfo);
                this.showModel.modalFrom = false;
                this.resetSubmitInfo();
                if(returnData && returnData.code == '0') this.getOperatorList(this.pagination)
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setOperatorPage{
        padding: 20px 0;
        .setOperatorList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
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
                    margin: 0 5px;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                }
            }
        }
    }
</style>