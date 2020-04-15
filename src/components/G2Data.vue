<template>
  <div class="showG2Info">
    <h3 class="captionsTitle">{{ title }}</h3>
    <div :id="id"></div>
  </div>
</template>
<style lang="less">
  .showG2Info{
    padding: 10px 10px;
    h3.captionsTitle{
      margin-bottom: 20px;
      text-align: left;
    }
  }
</style>
<script>
  import { Chart } from '@antv/g2';
  export default {
    data(){
      return {
        chart: null,
        title: '',
      }
    },
    props: {
      charData: [Object],
      id: [String],
      typeGShow: [Object],
    },
    mounted () {
      console.log(this.charData)
      setTimeout(()=>{
        this.drawChart()
      },100)
    },
    methods: {
      drawChart() {
        this.chart && this.chart.destory();
        const item = this.typeGShow;
        this.title = item.title;
        const chart = new Chart({
          container: this.id,
          autoFit: true,
          width: item.widthScroll,
          height: item.heightScroll
        });
        chart.data(this.charData.data)
        chart.tooltip({
          // showMarkers: false,
          shared: true,
        });
        chart.removeInteraction('legend-filter');
        chart.interaction('active-region');
        // 柱状图
        if(item.type == 'histogram'){
          // 坐标
          // chart.scale('month', { min: 0, max: 20 });
          chart.scale('total', { min: 0, max: Number(this.charData.total+2) });
          chart.scale('time', { range: [0.25, 0.75] });
          chart.axis('month', false);
          chart.scale({
            month: { alias: '本月', },
            total: { alias: '总计', }
          })
          // 展示形式
          chart.interval().position('time*total').color('month',data=>{ 
            if(data<0) return '#ff5957'; else return '#36c361';
          });
          // 展示备注
          
          chart.line().position('time*total').size(3).shape('smooth')
            .color('#fdae6b');
          // 图例
          chart.legend({
            custom: true,
            items: [
              { value: 'total', name: '卷宗总数', marker: { symbol: 'hyphen', style: { stroke: '#fdae6b', r: 5, lineWidth: 3 } } },
              { value: 'month', name: '月总数', marker: { symbol: 'square', style: { fill: '#36c361', r: 5 } } }
            ],
          });
        }
        //柱状图(无统计)
        else if(item.type == 'histogram_type'){
          // 坐标
          // chart.scale('month', { min: 0, max: 20 });
          chart.scale('total', { min: 0, max: this.charData.total })
          chart.scale('type', { range: [0.2,0.8] });
          // 展示形式
          chart.interval().position('type*total').color('type');
          chart.interaction('element-highlight');
        }
        //柱状图(双标)
        else if(item.type == 'histogram_d'){
          // 坐标
          chart.scale('month', {
            nice: true
          });
          chart.scale('time', {
            range: [0.25, 0.75]
          });
          chart.interval()
            .position('time*month')
            .color('type')
            .adjust([
              {
                type: 'dodge',
                marginRatio: 0,
              },
            ]);
          chart.interaction('element-highlight');
        }
        //环形图
        else if(item.type == 'caseData_dept'){
          chart.coordinate('theta', {
            radius: 0.85,
            innerRadius: 0.6,
          });
          chart.tooltip({
            showTitle: false,
            itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
          });
          chart.interval().adjust('stack').position('percent')
            .color('item').shape('slice-shape')
            .tooltip('item*percent', (item, percent) => {
              percent = ((percent/this.charData.maxNum).toFixed(4)) * 100 + '%';
              return {
                name: item,
                value: percent,
              };
            })
            .state({
              active: {
                style: element => {
                  const shape = element.shape;
                  return {
                    lineWidth: 10,
                    stroke: shape.attr('fill'),
                    strokeOpacity: shape.attr('fillOpacity'),
                  };
                },
              },
            });
            chart.interaction('element-active');
        }
        // 饼状图
        else if(item.type == 'pieChart'){
          chart.coordinate('theta', {
            radius: 0.85
          });
          chart.scale('percent', {
            formatter: (val) => {
              val = ((val/this.charData.maxNum).toFixed(4)) * 100 + '%';
              return val;
            },
          });
          chart.tooltip({
            showTitle: false,
            itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
          });
          chart.interval()
            .adjust('stack')
            .position('percent')
            .color('item')
            .label('percent', {
              content: (data) => {
                return `${data.item}: ${ ((data.percent/this.charData.maxNum).toFixed(4)) * 100}%`;
              },
            })
          .tooltip('item*percent', (item, percent) => {
            percent = ((percent/this.charData.maxNum).toFixed(4)) * 100 + '%';
            return {
              name: item,
              value: percent,
            };
          }).style({
            lineWidth: 1,
            stroke: '#fff',
          });
          chart.interaction('element-single-selected');
        }
        // 条形图
        else if(item.type == 'barChart'){
          chart.scale({
            case: {
              max: (this.charData.maxNum+1),
              min: 0,
              alias: '案件数（件）',
            },
          });
          chart.axis('name', {
            title: null,
            tickLine: null,
            line: null,
          });
          chart.axis('case', {
            label: null,
            title: {
              offset: 30,
              style: {
                fontSize: 12,
                fontWeight: 300,
              },
            },
          });
          chart.legend(false);
          chart.coordinate().transpose();
          chart
            .interval()
            .position('name*case')
            .size(26)
            .label('case', {
              style: {
                fill: '#8d8d8d',
              },
              offset: 10,
            });
          chart.interaction('element-active');
          console.log(chart)
        }
        chart.render()
      }
    }
  }
</script>