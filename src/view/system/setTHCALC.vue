<template>
    <div class="setPreservationPage"> 
        <div class="setPreservationList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_thcalc" :pagination="pagination"
                :data-source="tableData_thcalc" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <!--<a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>-->
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增部门 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalInput" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index==0"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-select style="margin-top: 10px;width: 100%;" @change="checkedDepartment"
                        :placeholder="item.placeholder" v-model="submitDataInfo[item.dom]" optionLabelProp="label" v-else>
                        <a-select-option v-for="item in showModel['roomList']"
                            :value="item.key" :label="item.name" 
                            :key="item.key"> 
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
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
                    captionsTitle: '',
                    modalInput: false,
                    confirmType: true, //提交方式：true：新增 false：修改
                    roomList: [],
                },
                submitDataInfo: {
                    th_id: '',
                    room_id: '',
                },
                eachDataInfoList: [
                    { captionTitle: '温湿度计编号',placeholder: '请输入温湿度计编号',dom:'th_id' },
                    { captionTitle: '绑定房间',placeholder: '请选择绑定房间',dom:'room_id' },
                ],
                columns_thcalc: [
                    { title: '温湿度计编号', dataIndex: 'key', },
                    { title: '绑定房间', dataIndex: 'room_name', },
                    { title: '创建时间', dataIndex: 'create_time', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_thcalc: [],
            }
        },
        mounted() {
            this.getThcalcList(this.pagination);
            this.getTypeListData();
        },
        methods: {
            //选择
            checkedDepartment(value){
                console.log(value)
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getThcalcList(this.pagination);
            },
            //获取温湿度传感器列表
            async getThcalcList(dataInfo){
                this.loading = true;
                const thcalcList = await this.$api.getThcalcList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = thcalcList.data;
                const thcalcData = [];
                queryCaseList.forEach(item=>{
                    thcalcData.push({
                        key: item.th_id,
                        room_name: item.room_name,
                        create_time: item.create_time,
                    })
                })
                this.tableData_thcalc = thcalcData;
                pagination.total = thcalcList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取所需参数(房间)
            async getTypeListData(){
                const returnData_room = await this.$api.getRoomListData();
                let returnData_roomList = [];
                returnData_room.data.forEach(item=>{
                    returnData_roomList.push({
                        key: item.room_id,
                        name: item.room_name,
                    })
                })
                this.showModel.roomList = returnData_roomList;
            },
            // 移除温湿度计
            async deleteItem(e){
                const returnData = await this.$api.deleteThcalcDataInfo({ th_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getThcalcList(this.pagination);
                    }
                }
            },
            confirmBtn(){
                if(this.showModel.confirmType){
                    this.addItem();
                }
            },
            //重置表单
            resetSubmitInfo(){
                this.submitDataInfo['th_id'] = '';
                this.submitDataInfo['room_id'] = '';
            },
            //新增物品保全室
            addInfo(){
                this.showModel.captionsTitle = '新增物品保全室';
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                const returnData = await this.$api.addThcalcDataInfo(this.submitDataInfo);
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getThcalcList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setPreservationPage{
        padding: 20px 0;
        .setPreservationList{
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