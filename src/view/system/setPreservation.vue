<template>
    <div class="setPreservationPage"> 
        <div class="setPreservationList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_room" :pagination="pagination"
                :data-source="tableData_room" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增房间 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalInput" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in eachDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index<7"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-cascader v-if="index==7" v-model="submitDataInfo.floor_id" allowClear
                        :fieldNames="{ label: 'name', value: 'code', children: 'items' }"
                        :options="showModel.buildList" @change="changeFloorItem" placeholder="请选择楼层"/>
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
                    buildList: [],  //楼层结构
                },
                submitDataInfo: {
                    room_name: '',
                    door_id: '',
                    door_ip: '',
                    max_temperature: '',
                    min_temperature: '',
                    max_humidity: '',
                    min_humidity: '',
                    floor_id: []
                },
                eachDataInfoList: [
                    { captionTitle: '房间名',placeholder: '请输入房间名',dom:'room_name' },
                    { captionTitle: '门锁ID',placeholder: '请输入门锁ID',dom:'door_id' },
                    { captionTitle: '主机IP',placeholder: '请输入主机IP',dom:'door_ip' },
                    { captionTitle: '最高温度',placeholder: '请输入最高温度',dom:'max_temperature' },
                    { captionTitle: '最低温度',placeholder: '请输入最低温度',dom:'min_temperature' },
                    { captionTitle: '最高湿度',placeholder: '请输入最高湿度',dom:'max_humidity' },
                    { captionTitle: '最低湿度',placeholder: '请输入最低湿度',dom:'min_humidity' },
                    { captionTitle: '选择楼层',placeholder: '请输入最低湿度',dom:'checkedFloor' },
                ],
                columns_room: [
                    { title: '房间名', dataIndex: 'name', },
                    { title: '门锁ID', dataIndex: 'doorLock_id', },
                    { title: '主机IP', dataIndex: 'host_ip', },
                    { title: '最高温度', dataIndex: 'thermal_max', },
                    { title: '最低温度', dataIndex: 'thermal_min', },
                    { title: '最高湿度', dataIndex: 'humidity_max', },
                    { title: '最低湿度', dataIndex: 'humidity_min', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_room: [],
            }
        },
        mounted() {
            this.getRoomList(this.pagination);
            this.getTypeListData();
        },
        methods: {
            //选择楼层
            changeFloorItem(value){
                console.log(value)
                this.submitDataInfo['floor_id'] = value;
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getRoomList(this.pagination);
            },
            //获取保全室列表
            async getRoomList(dataInfo){
                this.loading = true;
                const roomList = await this.$api.getRoomList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = roomList.data.list;
                const roomData = [];
                queryCaseList.forEach(item=>{
                    roomData.push({
                        key: item.room_id,
                        name: item.room_name,
                        doorLock_id: item.door_id,
                        host_ip: item.door_ip,
                        thermal_max: item.max_temperature,
                        thermal_min: item.min_temperature,
                        humidity_max: item.max_humidity,
                        humidity_min: item.min_humidity,
                    })
                })
                this.tableData_room = roomData;
                pagination.total = roomList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取所需参数(楼宇/楼层)
            async getTypeListData(){
                const returnData_build = await this.$api.getBuildAllData();
                returnData_build.data.forEach(item=>{
                    const dataInfo = {
                        pageNum: 1,
                        pageSize: 100,
                        location_id: item.location_id
                    };
                    this.$api.getFloorData_Page(dataInfo).then((res)=>{
                        const foolrList = [];
                        if(res.data.list != []){
                            res.data.list.forEach((itemFoolr)=>{
                                foolrList.push({
                                    name: itemFoolr.floor_name,
                                    code: itemFoolr.floor_id
                                })
                            })
                        }
                        let returnData_foolr = {
                            name: item.location_name,
                            code: item.location_id,
                            items: foolrList
                        }
                        this.showModel['buildList'].push({...returnData_foolr});
                    })
                    
                });
            },
            // 移除物品保全室
            async deleteItem(e){
                const returnData = await this.$api.deleteRoomData({ room_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getRoomList(this.pagination);
                    }
                }
            },
            confirmBtn(){
                if(this.showModel.confirmType){
                    this.addItem();
                }else{
                    this.comfirmEditItem();
                }
            },
            // 修改物品保全室
            async editItem(e){
                this.showModel.captionsTitle = '修改物品保全室';
                this.showModel.confirmType = false;
                console.log(e)
                const typeData = ['room_id','room_name','door_id','door_ip','max_temperature','min_temperature','max_humidity',
                    'min_humidity'];
                const typeData_cell = ['key','name','doorLock_id','host_ip','thermal_max','thermal_min','humidity_max','humidity_min'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_cell[index]];
                })
                this.showModel.modalInput = true;
            },
            //确认提交修改
            comfirmEditItem(){
                this.submitDataInfo['floor_id'] = this.submitDataInfo['floor_id'][1];
                console.log(this.submitDataInfo);
                this.$api.editRoomData(this.submitDataInfo).then(()=>{
                    this.showModel.modalInput = false;
                    this.getRoomList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.room_id;
                this.submitDataInfo['room_name'] = '';
                this.submitDataInfo['door_id'] = '';
                this.submitDataInfo['door_ip'] = '';
                this.submitDataInfo['max_temperature'] = '';
                this.submitDataInfo['min_temperature'] = '';
                this.submitDataInfo['max_humidity'] = '';
                this.submitDataInfo['min_humidity'] = '';
                this.submitDataInfo['floor_id'] = [];
            },
            //新增物品保全室
            addInfo(){
                this.showModel.captionsTitle = '新增物品保全室';
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                this.submitDataInfo['floor_id'] = this.submitDataInfo['floor_id'][1];
                const returnData = await this.$api.addRoomData(this.submitDataInfo);
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getRoomList(this.pagination);
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