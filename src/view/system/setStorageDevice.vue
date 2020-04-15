<template>
    <div class="setDevicePage"> 
        <div class="setDeviceList">
            <div class="addCaseInfo">
                <span @click="addInfo"><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_device" :pagination="pagination"
                :data-source="tableData_device" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="operation" slot-scope="record">
                    <a-button class="editDate" @click="editItem(record)" size="small">修改</a-button>
                    <a-popconfirm title="确定移除?"
                        @confirm="deleteItem(record)" okText="确认" cancelText="取消">
                        <a-button class="editDate" size="small">移除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!-- 新增部门 -->
            <a-modal :title="showModel.captionsTitle"
                centered v-model="showModel.modalInput" @ok="confirmBtn" @cancel="resetSubmitInfo">
                <div v-for="(item,index) in inputDataInfoList" :key="index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-input :placeholder="item.placeholder" allowClear v-if="index!=1"
                        v-model="submitDataInfo[item.dom]" style="display:table-cell;width: auto" />
                    <a-input-group compact v-if="index==1">
                        <a-input style=" width: 100px; text-align: center" 
                            placeholder="请输入行数" v-model="submitDataInfo.lockDetail_row"/>
                        <a-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                            placeholder="~" disabled />
                        <a-input style="width: 100px; text-align: center; border-left: 0" 
                            placeholder="请输入列数" v-model="submitDataInfo.lockDetail_col"/>
                    </a-input-group>
                </div>
                <!-- select -->
                <div v-for="(item,index) in selectDataInfoList" :key="'item'+index"
                    style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <a-cascader v-if="index==0" v-model="submitDataInfo.bindArea" allowClear
                        :fieldNames="{ label: 'name', value: 'code', children: 'items' }"
                        :options="selectDataInfo[item.dom]" @change="checkedDepartment" 
                        :placeholder="item.placeholder" style="width: 100%" :value="submitDataInfo.bindArea"/>
                    <a-select style="width: 100%" @change="checkedDepartment" v-else
                        v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder">
                        <a-select-option v-for="item in selectDataInfo[item.dom]" 
                            :value="item.key" :key="item.key"> {{ item.name }}
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
                    buildList: [],  //楼层结构
                },
                submitDataInfo: {
                    shale_id: '',
                    lockerName: '',
                    bindArea: [],
                    lockDetail_row: '',
                    lockDetail_col: '',
                    lockPlateIp: '',
                    bindMachine: '',
                    bindCamera: '',
                    bindType: '',
                },
                //table列表
                columns_device: [
                    { title: '柜名', dataIndex: 'lockerName', },
                    { title: '锁板IP', dataIndex: 'lockPlateIp', },
                    { title: '房间名', dataIndex: 'room_name', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_device: [],
                //提交数据信息及列表
                inputDataInfoList: [
                    { captionTitle: '储物柜名',placeholder: '请输入储物柜名',dom:'lockerName' },
                    { captionTitle: '行列数',placeholder: '请输入锁号范围',dom:'lockDetail' },
                    { captionTitle: '锁板IP',placeholder: '请输入锁板IP',dom:'lockPlateIp' },
                ],
                selectDataInfoList: [
                    { captionTitle: '绑定房间',placeholder: '请选择绑定房间',dom:'bindRoom' },
                    { captionTitle: '绑定一体机',placeholder: '请选择绑定一体机',dom:'bindMachine' },
                    { captionTitle: '绑定摄像头',placeholder: '请输选择绑定摄像头',dom:'bindCamera' },
                    { captionTitle: '储物柜类型',placeholder: '请选择储物柜类型',dom:'bindType' },
                ],
                //所需列表信息
                selectDataInfo:{
                    // 房间及区域
                    bindRoom: [],
                    bindMachine: [],
                    bindCamera: [],
                    bindType: [],
                }
            }
        },
        mounted() {
            this.getDeviceList(this.pagination);
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
                this.getDeviceList(this.pagination);
            },
            //获取存储设备列表
            async getDeviceList(dataInfo){
                this.loading = true;
                const deviceList = await this.$api.getDeviceList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = deviceList.data.list;
                const deviceData = [];
                queryCaseList.forEach(item=>{
                    deviceData.push({
                        key: item.shale_id,
                        lockerName: item.shale_name,
                        bindArea: [item.room_id,item.line_id],
                        lockPlateIp: item.shale_lock_ip,
                        lockDetail_row: item.hang,
                        lockDetail_col: item.lie,
                        bindType: item.shale_type,
                        bindCamera: item.camera_id,
                        bindMachine: item.imac_id,
                        room_name: item.room_name
                    })
                })
                this.tableData_device = deviceData;
                pagination.total = deviceList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            // 获取所需参数(放假/类型、一体机、摄像头、储物柜类型)
            async getTypeListData(){
                // 房间
                const returnData_room = await this.$api.getRoomListData();
                let roomData = returnData_room.data;
                // let roomSelect = {};
                roomData.forEach(item=>{
                    let areaList = [];
                    if(item.lineList != []){
                        item.lineList.forEach(item=>{
                            areaList.push({
                                name: item.line_name,
                                code: item.line_id
                            })
                        })
                    }
                    let roomSelect = {
                        name: item.room_name,
                        code: item.room_id,
                        items: areaList
                    }
                    this.selectDataInfo['bindRoom'].push({...roomSelect});
                })
                // 一体机  待更新
                const returnData_machine = await this.$api.getRoomListData();
                let machineData = returnData_machine.data;
                let machineSelect = [];
                machineData.forEach(item=>{
                    machineSelect.push({
                        key: item.room_id,
                        name: item.room_name
                    })
                })
                this.selectDataInfo['bindMachine'] = machineSelect;
                // 摄像头
                const returnData_camera = await this.$api.getCameraListData();
                let cameraData = returnData_camera.data;
                let cameraSelect = [];
                cameraData.forEach(item=>{
                    cameraSelect.push({
                        key: item.camera_id,
                        name: item.camera_name
                    })
                })
                this.selectDataInfo['bindCamera'] = cameraSelect;
                // 储物柜类型
                const returnData_type = await this.$api.getShaleTypeListData();
                let typeData = returnData_type.data;
                let typeSelect = [];
                typeData.forEach(item=>{
                    typeSelect.push({
                        key: item.shale_type_id,
                        name: item.shale_type_name
                    })
                })
                this.selectDataInfo['bindType'] = typeSelect;
            },
            // 移除智能存储柜
            async deleteItem(e){
                const returnData = await this.$api.deteleShaleData({ shale_id: e.key });
                if(returnData){
                    if(returnData.code == '0'){
                        if(((this.pagination.total-1)%(this.pagination.pageSize))==0){
                            this.pagination.pageNum-=1;
                            this.pagination.current-=1;
                        }
                        this.getDeviceList(this.pagination);
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
                this.showModel.captionsTitle = '修改智能存储柜';
                this.showModel.confirmType = false;
                const typeData = ['shale_id','lockerName','bindArea','lockPlateIp','bindCamera','bindMachine',
                    'lockDetail_row','lockDetail_col','bindType','room_name'];
                const typeData_cell = ['key','lockerName','bindArea','lockPlateIp','bindCamera','bindMachine',
                    'lockDetail_row','lockDetail_col','bindType','room_name'];
                typeData.forEach((item,index)=>{
                   this.submitDataInfo[typeData[index]] = e[typeData_cell[index]];
                })
                this.showModel.modalInput = true;
            },
            //确认提交修改
            comfirmEditItem(){
                this.$api.editShaleData({
                    shale_id: this.submitDataInfo['shale_id'],
                    shale_name: this.submitDataInfo['lockerName'],
                    room_id: this.submitDataInfo['bindArea'][0],
                    line_id: this.submitDataInfo['bindArea'][1],
                    shale_type: this.submitDataInfo['bindType'],
                    shale_lock_ip: this.submitDataInfo['lockPlateIp'],
                    imac_id: this.submitDataInfo['bindMachine'],
                    camera_id: this.submitDataInfo['bindCamera'],
                    hang: this.submitDataInfo['lockDetail_row'],
                    lie: this.submitDataInfo['lockDetail_col'],
                }).then(()=>{
                    this.showModel.modalInput = false;
                    this.getDeviceList(this.pagination);
                    setTimeout(()=>{
                        this.resetSubmitInfo();
                    },500)
                })
            },
            //重置表单
            resetSubmitInfo(){
                delete this.submitDataInfo.shale_id;
                this.submitDataInfo['lockerName'] = '';
                this.submitDataInfo['bindArea'] = [];
                this.submitDataInfo['lockDetail_row'] = '';
                this.submitDataInfo['lockDetail_col'] = '';
                this.submitDataInfo['lockPlateIp'] = '';
                this.submitDataInfo['bindMachine'] = '';
                this.submitDataInfo['bindCamera'] = '';
                this.submitDataInfo['bindType'] = '';
            },
            //新增物品保全室
            addInfo(){
                this.showModel.captionsTitle = '新增智能存储柜';
                this.showModel.confirmType = true;
                this.showModel.modalInput = true;
            },
            async addItem(){
                const returnData = await this.$api.addShaleData({
                    shale_name: this.submitDataInfo['lockerName'],
                    room_id: this.submitDataInfo['bindArea'][0],
                    line_id: this.submitDataInfo['bindArea'][1],
                    shale_type: this.submitDataInfo['bindType'],
                    shale_lock_ip: this.submitDataInfo['lockPlateIp'],
                    imac_id: this.submitDataInfo['bindMachine'],
                    camera_id: this.submitDataInfo['bindCamera'],
                    hang: this.submitDataInfo['lockDetail_row'],
                    lie: this.submitDataInfo['lockDetail_col'],
                });
                this.showModel.modalInput = false;
                this.resetSubmitInfo();
                if(returnData){
                    if(returnData.code == '0'){
                        this.getDeviceList(this.pagination);
                    }
                }
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setDevicePage{
        padding: 20px 0;
        .setDeviceList{
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