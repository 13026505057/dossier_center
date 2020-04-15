<template>
    <div class="setJurisdicPage"> 
        <div class="setJurisdicList">
            <div class="addCaseInfo">
                <span @click="addInfo">
                    <i class="iconfont icon-cf-c101"></i>新增
                </span>
            </div>
            <a-table bordered :columns="columns_Jurisdic" :pagination="pagination"
                :data-source="tableData_Jurisdic" class="tableCaseData" size="middle"
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
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
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
                    role_id: 0,
                    role_name: '',
                    group_ids: ''
                }, 
                addOperatorItem: {
                    roleList: [],  //总数据列表(多选)
                    checkedList: [],  //已选中列表(多选)
                    checkedAllData: [],  //预备全部选中(多选)
                },
                eachDataInfoList: [
                    { captionTitle: '职责名称',placeholder: '请输入职责名称',dom:'role_name' },
                ],
                columns_Jurisdic: [
                    { title: '职责名称', dataIndex: 'name', },
                    { title: '职责编码', dataIndex: 'number', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_Jurisdic: [],
            }
        },
        mounted() {
            this.getJurisdicList(this.pagination);
            this.getPowerList();
        },
        methods: {
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
                this.getJurisdicList(this.pagination);
            },
            // 获取权限职责列表
            async getJurisdicList(dataInfo){
                this.loading = true;
                const jurisdicList = await this.$api.getRoleList(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = jurisdicList.data.list;
                const jurisdicData = [];
                queryCaseList.forEach(item=>{
                    jurisdicData.push({
                        key: item.role_id,
                        name: item.role_name, 
                        number: item.role_code,
                        roleGroupList: item.roleGroupList,
                    })
                })
                this.tableData_Jurisdic = jurisdicData;
                pagination.total = jurisdicList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 删除职责名目
            async deleteItem(e){
                const returnData = await this.$api.deleteRoleData({ role_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getJurisdicList(this.pagination);
                    }
                }
            },
            // 获取所需列表(权限)
            async getPowerList(){
                const returnData = await this.$api.getPowerList({ pageNum:1,pageSize:100 });
                const powerList = returnData.data.list;
                const roleListData = [];   //多选列表
                const checkedAllListData = [];  //预备全部选中
                powerList.forEach((item)=>{
                    roleListData.push({
                        value: item.group_id,
                        label: item.group_name
                    });
                    checkedAllListData.push(item.group_id);
                })
                this.addOperatorItem['roleList'] = roleListData;
                this.addOperatorItem['checkedAllData'] = checkedAllListData;
            },
            // 修改操作员信息
            async editItem(e){
                console.log(e)
                this.showModel.confirmType = false;
                this.showModel.captionsTitleInfo = '修改权限设置';
                const typeData = ['role_id','role_name'];
                const typeData_cell = ['key','name'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_cell[index]];
                })
                const userGroupList = e['roleGroupList'];
                if(userGroupList.length>0){
                    const powerList = [];
                    userGroupList.forEach(item=>{
                        powerList.push(item.group_id)
                    })
                    this.addOperatorItem['checkedList'] = powerList;
                    this.onChange(powerList)
                }
                this.showModel.modalFrom = true;
            },
            //确认提交修改
            comfirmEditItem(){
                this.submitDataInfo.group_ids = this.addOperatorItem.checkedList.join();
                console.log(this.submitDataInfo)
                this.$api.editRoleData(this.submitDataInfo).then(()=>{
                    this.showModel.modalFrom = false;
                    this.getJurisdicList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //确定按钮
            confirmBtn(){
                if(this.showModel.confirmType){
                    this.addItem();
                }else{
                    this.comfirmEditItem();
                }
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.role_id;
                this.submitDataInfo['role_name'] = '';
                this.submitDataInfo['group_ids'] = '';
                this.addOperatorItem['checkedList'] = [];
                this.showModel['checkAll'] = false;
                this.showModel['indeterminate'] = true;
            },
            //新增操作员
            addInfo(){
                this.showModel.confirmType = true;
                this.showModel.modalFrom = true;
                this.showModel.captionsTitleInfo = '新增权限设置';
            },
            async addItem(){
                this.submitDataInfo.group_ids = this.addOperatorItem.checkedList.join();
                const returnData = await this.$api.addRoleData(this.submitDataInfo);
                this.showModel.modalFrom = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getJurisdicList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setJurisdicPage{
        padding: 20px 0;
        .setJurisdicList{
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