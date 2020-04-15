<template>
    <div>
        <div>

                <template v-for="(item,index) in listData">
                    <div :class="[item.block?'suo':'gui','divWidth']" :key="index"
                        :style="{ width: (100/typeDataInfo.col)+'%' }">{{ item.id }}
                        <!--<div :style="{ height: 10+'px',background: item.block?'#fff':'red'  }" :key="index"></div>-->
                    </div>
                </template>
                <table border="2">
                    <tr v-for="(item,index) in listData" :key="index">
                        <td v-for="(itemCol,index) in item.data" :key="index"
                            :class="[itemCol.block?'suo':'gui','divWidth']"
                            :style="{ width: (100/typeDataInfo.col)+'%'}"
                            :rowspan="itemCol.col">
                            {{ itemCol.title }}
                        </td>
                        <!--<td :style="{ width: (100/typeDataInfo.col)+'%'}"
                            :class="[itemCol.block?'suo':'gui','divWidth']">
                            {{ itemCol.title }}
                        </td>-->
                    </tr>
                </table>

            </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            type: 'type4',
            typeDataInfo: {},
            typeList: [
                { type: 'type1',row: 4,col: 5,gui: 2 },
                { type: 'type2',row: 2,col: 5,gui: 1 },
                { type: 'type3',row: 6,col: 5,gui: 3 },
                { type: 'type4',row: 4,col: 4,gui: 2 },
                { type: 'type5',row: 4,col: 7,gui: 2 },
                { type: 'type6',row: 2,col: 9,gui: 2 },
            ],
            listData: [
                { row:1,
                    data:[
                        { block: false,title: '第一',col:2 },
                        { block: true,title: '第二',col:1 },
                        { block: true,title: '第三',col:1 },
                        { block: true,title: '第四',col:1 },
                    ] 
                },
                { row:2,
                    data:[
                        { block: false,title: '第5',col:2 },
                        { block: true,title: '第5',col:1 },
                        { block: true,title: '第7',col:1 },
                        { block: true,title: '第8',col:1 },
                    ] 
                },
                { row:3,
                    data:[
                        { block: true,title: '第5',col:1 },
                        { block: true,title: '第6',col:1 },
                        { block: true,title: '第7',col:1 },
                        { block: true,title: '第8',col:1 },
                    ] 
                },
                { row:4,
                    data:[
                        { block: true,title: '第5',col:1 },
                        { block: true,title: '第6',col:1 },
                        { block: true,title: '第7',col:1 },
                        { block: true,title: '第8',col:1 },
                    ] 
                },
            ],
        }
    },
    mounted() {
        this.typeList.map(item=>{
                if(item.type == this.type)
                    this.typeDataInfo = item;
            })
            console.log(this.typeDataInfo)
    },
}
</script>