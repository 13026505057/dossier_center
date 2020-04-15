<template>
    <div class="setDepartmentPage"> 
        <div class="setDepartmentList">
            <div class="addCaseInfo">
                <span @click=" showModel.modalInput = true "><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_setDepartment" :pagination="pagination"
                :data-source="tableData_setDepartment" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增部门 -->
            <a-modal title="新增部门"
                centered v-model="showModel.modalInput" @ok="addItem" @cancel="resetSubmitInfo">
                <a-input placeholder="部门名称" allowClear v-model="showModel.deptName" />
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
                    modalInput: false,
                    deptName: '',
                },
                columns_setDepartment: [
                    { title: '部门名称', dataIndex: 'name', },
                    { title: '部门编号', dataIndex: 'number', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_setDepartment: [],
            }
        },
        mounted() {
            this.getDepartmentList(this.pagination);
        },
        methods: {
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getDepartmentList({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize
                });
            },
            async getDepartmentList(dataInfo){
                this.loading = true;
                const departmentList = await this.$api.getDepartmentList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = departmentList.data.list;
                const departmentData = [];
                queryCaseList.forEach((item,index)=>{
                    departmentData.push({
                        key: item.dept_id,
                        number: index+1,
                        name: item.dept_name,
                    })
                })
                this.tableData_setDepartment = departmentData;
                pagination.total = departmentList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            async deleteItem(e){
                const returnData = await this.$api.deleteDepartment_Page({ dept_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getDepartmentList(this.pagination);
                    }
                }
                
            },
            //重置表单
            resetSubmitInfo(){
                this.showModel.deptName = '';
            },
            async addItem(){ 
                const returnData = await this.$api.addDepartment_Page({ dept_name: this.showModel.deptName });
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getDepartmentList(this.pagination);
                    }
                }
                
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setDepartmentPage{
        padding: 20px 0;
        .setDepartmentList{
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
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                }
            }
        }
    }
</style>