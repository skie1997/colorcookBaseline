import * as d3 from 'd3';
import React, { PureComponent } from 'react';
import { Layout,Button,Row, Col, Tooltip } from 'antd';
import { SketchPicker } from 'react-color';
import { WidthProvider, Responsive } from "react-grid-layout";
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';
import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import _ from "lodash";
import D3Container from "@/charts/D3/D3Container"
import RadarChart from "@/charts/D3/RadarChart2";
import './canvaspane.css';

import{ getStackedData as  getStackedDataArea, getSeries as getSeriesArea} from '@/charts/D3/AreaChart/helper'
import{ getStackedData as  getStackedDataBar, getSeries as getSeriesBar} from '@/charts/D3/BarChart/helper'
import{ getStackedData as  getStackedDataLine, getSeries as getSeriesLine, getAggregatedRows as getAggregatedRowsLine, sortByDateAscending as sortByDateAscendingLine, getCategories as getCategoriesLine} from '@/charts/D3/LineChart/helper'
import{ getAggregatedRows as  getAggregatedRowsPie, getCategories as getCategoriesPie} from '@/charts/D3/PieChart/helper'
import{ getAggregatedRows as  getAggregatedRowsScatter, getAverageRows as getAverageRowsScatter,getSeries as getSeriesScatter} from '@/charts/D3/ScatterPlot/helper'
import{ getStackedData as  getStackedDataTree, getSeries as getSeriesTree} from '@/charts/D3/TreeMap/helper'
import{ getStackedData as  getStackedDataRadar, getSeries as getSeriesRadar} from '@/charts/D3/RadarChart/helper'
import{ getData as getDataMap}from '@/charts/D3/Map/helper'
import Item from 'antd/lib/list/Item';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout = WidthProvider(Responsive);
const { Header, Content} = Layout;

//初始化colorpicker style
const popover = {
  position: 'absolute',
  //position: 'relative',
  zIndex: '9999',
  top: '-250px',
  right: '0px',
  bottom: '0px',
  left: '-50px',
  marginTop:'50px',
  marginLeft:'-100px'
}

const cover = {
  position: 'fixed',
  zIndex: '9999',
  //position:
  top: '-100px',
  right: '0px',
  bottom: '0px',
  left: '0px',
}

const defaultcolorPicker = [];
      for(let i = 0; i < 40; i++){
        let temp = [];
        for(let j = 0; j< 40; j++){
          temp.push(false)
        }
        defaultcolorPicker.push(temp);
      }

export default class CanvasPane extends PureComponent {
 
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
    rowHeight: 30,
  };
    constructor(props) {
      super(props);
      
      

      this.state = {
        // layouts: this.getFromLS("layouts") || {},
        layouts: {
          cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
          rowHeight: 40,
          title: 'Start to make a new dashboard!'
        },
        // widgets:[]

        //更新colorPicker
        displayColorPicker: defaultcolorPicker,

        //推荐色盘
        presetColorsReplace: '',

        //legendChangedColor
        legendChangedColor:[]
      }

      this.selectChart = this.selectChart.bind(this)
      this.onLayoutChange = this.onLayoutChange.bind(this)
      // this.inputChange = this.inputChange.bind(this)
    }
    componentWillReceiveProps(props) {
     console.log('will',this.props.widgets)
  }
  
    getFromLS(key) {
      let ls = {};
      if (global.localStorage) {
        try {
          ls = JSON.parse(global.localStorage.getItem("rgl-4")) || {};
        } catch (e) {
          /*Ignore*/
        }
      }
      return ls[key];
    }
  
    saveToLS(key, value) {
      if (global.localStorage) {
        global.localStorage.setItem(
          "rgl-4",
          JSON.stringify({
            [key]: value
          })
        );
      }
    }

    selectChart = (i, spec, e) => {
      window.event.stopPropagation();
    //   console.log('scatterplottype',this.props.widgets[i].type)
    //   if (this.props.widgets[i].type === 'scatterplot') {

    //     console.log('scatterplottype2',this.props.widgets[i].type)
    //     this.props.switchData(1); //countrys.csv
    //     // dataindex = 1
    // }else if(this.props.widgets[i].type  === 'map'){
    //   console.log('scatterplottype3',this.props.widgets[i].type)
    //     this.props.switchData(2); //china.csv
    //     // dataindex = 2
    // }else{
    //   console.log('scatterplottype4',this.props.widgets[i].type)
    //     this.props.switchData(0); //car.csv
    // }
      
     
      
      //改变dataIndex
      this.props.switchData(this.props.widgets[i].dataIndex)

      //改变selectChartIndex
      this.props.selectChart(i);

      //改变edit mode
      this.props.changeEditMode(i);

     
      this.props.changeEditSpec(spec);

       //改变edit channels
       let channels = d3Channels(this.props.widgets[i].type);
       //注意这里是遍历字典 要按key查找
       let channelsName = Object.keys(channels);
                        
       for(let i = 0; i< channelsName.length; i++){
           channels[channelsName[i]]['isEncoding'] = true;
       }

      this.props.changeEditChannels(channels);

      this.props.changeColorset(this.props.widgets[i].colorsetType, this.props.widgets[i].colorsetIndex)

       //关闭chart mode
       this.props.changeChartMode(false);  

       
      //  e.nativeEvent.stopImmediatePropagation();
      

      


    }

    inputChange = (i, event) =>{

      let widgets = [...this.props.widgets];
        
        // for(let i = 0; i<widgets.length;i++){
        //     widgets[i].spec.style.colorset = currentColorset;
        // }
        if(!event || event.target==undefined){
          widgets[i].inputvalue = "Add some text11";
          
        }else{
          widgets[i].inputvalue = event.target.value;
        }
        this.props.changeMapping(widgets);

        
    }
    titleInputChange = (event) =>{
      let input = event.target.value;
      this.setState({
        title: input
      })
    }


    handleStyleClick = (i, fieldsIndex) =>{

      //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, 'prepare for replacing color in legend')
      // HttpUtil.post(ApiUtil.API_COLOR_LOG, this.props.colormap)
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      })


      let displayColorPicker = this.state.displayColorPicker;

      displayColorPicker[i][fieldsIndex] =true;
      this.setState({
        displayColorPicker: displayColorPicker
      });

      //颜色推荐
      let colorsetData = _.cloneDeep(this.props.currentColorset);
      this.setState({
        presetColorsReplace: colorsetData,
      });



      //层级过深无法触发渲染时需要强制渲染
      this.forceUpdate();
      console.log('this.state.displayColorPicker',this.state.displayColorPicker)
    }


    inputOnBlur = ()=>{
     console.log('inputOnBlur')
    }
  
    inputOnFocus = ()=> {
      console.log('inputOnFocus')
    }
    startSearch = ()=> {
      console.log('startSearch')
    }
 

    handleStyleChange = (i, fieldsIndex, value) =>{
      
      
      //打印日志
      //判断是否选择的是推荐颜色
      //推荐的颜色组
      const presetColorsReplace = this.state.presetColorsReplace;
      let suggestion = presetColorsReplace;
       
      let chooseColor = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';
        let logStr = suggestion.indexOf(chooseColor)!=-1? 'replace color with existed color in legend' : 'replace color by self in legend'
        //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, logStr)
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      });

      //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
      let widgets = [...this.props.widgets];
      widgets[i].legendChangedColor.push({'fieldsIndex':fieldsIndex, 'color':chooseColor})
        
      // for(let i = 0; i<widgets.length;i++){
      //     widgets[i].spec.style.colorset = currentColorset;
      // }
      
      this.props.changeMapping(widgets);

  
    }

    handleStyleClose = (i, fieldsIndex) =>{
      //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, 'stop to replace color in legend')
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      })

      console.log('handleStyleClose',this.state.displayColorPicker)
      let displayColorPicker = this.state.displayColorPicker;
      displayColorPicker[i][fieldsIndex] = false;
      
      this.setState({
        displayColorPicker: displayColorPicker
      })
      this.forceUpdate();
    }

    generateDOM = (e) => {
      console.log('rendergenDOM')
      
      
      // console.log('e2',this.state.layouts)
      // console.log('generace',this.props.widgets);
      let widgets = [...this.props.widgets];


      if(widgets.length == 0){
        return ;
      }

      
      
  
      return _.map(widgets, (item, i) => {
    
        // console.log('e.1111111')
        
     

      
      //推荐的颜色组
      const presetColorsReplace = this.state.presetColorsReplace;
      let suggestion = presetColorsReplace;

      let dataCategories = getCategories(this.props.dataList[item.dataIndex], item.spec.encoding);
      let categories = Object.keys(dataCategories);

      let colorset = item.spec.style.colorset;
      let cardFieldsList = [];
      let cardColorList = [];
      let minValue = 0;
      let maxValue = 0;
      let midValue = 0;
      if(item.type == 'map' || item.type == 'heat map'){
       

        if(item.type == 'map'){
          let parseData = this.props.dataList[item.dataIndex];
          cardFieldsList[0] = parseData[item.spec.encoding.color.field]+'-minValue';
          cardFieldsList[1] = parseData[item.spec.encoding.color.field]+'-maxValue';
          let encodingData = getDataMap(parseData, item.spec.encoding);
          let values = encodingData.values;
          let encodingValue = Object.values(values);
          if (!_.isEmpty(item.spec.encoding.color)) {
            maxValue = d3.max(encodingValue);
            minValue = d3.min(encodingValue);
          }
        }else{
          let data = this.props.dataList[item.dataIndex];
          cardFieldsList[0] = data[item.spec.encoding.color.field]+'-minValue';
          cardFieldsList[1] = data[item.spec.encoding.color.field]+'-maxValue';
          var myGroups = d3.map(data, function(d){return d[item.spec.encoding.x.field];}).keys();
          var myVars = d3.map(data, function(d){return d[item.spec.encoding.y.field];}).keys();

          let heatData = new Array()

          for(let i = 0; i<myGroups.length; i++){
              for(let j = 0; j<myVars.length; j++){
                  let xField = item.spec.encoding.x.field;
                  let yField = item.spec.encoding.y.field;
                  let colorField = item.spec.encoding.color.field;
                  let heatDatai = new Array()
                  heatDatai[xField] = myGroups[i]
                  heatDatai[yField] = myVars[j]
                  heatDatai[colorField] = 0
                  heatData.push(heatDatai)

              }
          }
          for(let i = 0; i<data.length; i++){
              let index = myGroups.indexOf(data[i][item.spec.encoding.x.field])+1
              let index2 = myVars.indexOf(data[i][item.spec.encoding.y.field].toString())+1

              heatData[index*index2-1][item.spec.encoding.color.field] += data[i][item.spec.encoding.color.field]
          }
          let valueRange = d3.extent(heatData, function(d) { return (d[item.spec.encoding.color.field]);});
          minValue = valueRange[0];
          maxValue = valueRange[1]; 

        }
        
   
        if(maxValue > 0 && minValue < 0){
            let leftColor = colorset[0];
            let rightColor = colorset[1];
            
            cardColorList.push(leftColor);

            cardColorList.push(rightColor);
         
        }else if(minValue >= 0){
      
          let leftColor = 'rgb(241,241,241)';
          let rightColor = colorset[0];
         
          cardColorList.push(leftColor)
          cardColorList.push(rightColor)
        }else if(maxValue <= 0){
          console.log('maxValue<0')
          let rightColor = 'rgb(241,241,241)';
          let leftColor = colorset[0];
       
          cardColorList.push(leftColor)
          cardColorList.push(rightColor)
        }


      }else{

        cardFieldsList =  categories;

        if(item.colorsetType == 1){
          cardFieldsList.forEach((item,index)=>{  
            cardColorList.push(colorset[index])
          })

        }else{
          let dataValue = [];

          let data = this.props.dataList[item.dataIndex];
          let encoding = item.spec.encoding;
          let stackedData = [];
          let dataSeries = [];
          let series = [];
          let valueScale;
          let computeColor;
            

          switch(item.type){
            case 'area chart':
              stackedData = getStackedDataArea(this.props.dataList[item.dataIndex], encoding)
              stackedData.forEach((item, i)=>{
                  let temp = 0;
                  item.forEach((item2,i)=>temp += item2[1]-item2[0])
                  dataValue.push(temp)
              })
              minValue = d3.min(dataValue)
              maxValue = d3.max(dataValue)
              midValue = (minValue + maxValue)/2
              if(colorset.length==2){
                  valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                  computeColor = d3.interpolate(colorset[0], colorset[1]); 
                  categories.forEach((item,index)=>{
                    cardColorList.push(computeColor(valueScale(dataValue[index])));
                  })     
              }else if(colorset.length == 3){
                  // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                  // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                  computeColor = d3.scaleLinear()
                      .domain([minValue, midValue, maxValue])
                      .range([colorset[0], colorset[1],colorset[2]])
                  categories.forEach((item,index)=>{
                    cardColorList.push(computeColor(dataValue[index]));
                  })
                  
              }
              break;
            case 'bar chart':
              stackedData = getStackedDataBar(this.props.dataList[item.dataIndex], encoding)
              stackedData.forEach((item, i)=>{
                  let temp = 0;
                  item.forEach((item2,i)=>temp += item2[1]-item2[0])
                  dataValue.push(temp)
              })
              minValue = d3.min(dataValue)
              maxValue = d3.max(dataValue)
              midValue = (minValue + maxValue)/2
            if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
                
            }
              break;
            case 'line chart':
              let dataCategories = getCategoriesLine(data, encoding);
              categories = Object.keys(dataCategories);
              dataSeries = getSeriesLine(data, encoding);
              series = Object.keys(dataSeries);
              let dataSeriesCategories =[];
              for (const s in dataSeries) {
                dataSeriesCategories[s] = {};
                // dataSeries[s] = getMaxRows(dataSeries[s], encoding);
                dataSeries[s] = getAggregatedRowsLine(dataSeries[s], encoding)
                for (let index = 0; index < dataSeries[s].length; index++) {
                    const rowData = dataSeries[s][index];
                    // console.log(rowData);
                    dataSeriesCategories[s][rowData[encoding.x.field]] = rowData[encoding.y.field]
                }
              }
              
              if (series.length > 0) {
                let preparedData = {}
                series.forEach((s) => {
                    let sData = [];
                    categories.forEach(c => { // each x value 
    
                        sData.push({
                            x: c,
                            y: dataSeriesCategories[s][c]?dataSeriesCategories[s][c]:0,
                            y0: 0,
                            color: s
                        })
                    });
                    // sData = sData.sort(sortByDateAscendingLine);
                    preparedData[s] = sData;
                })

                for (let index = 0; index < series.length; index++) {
                  
                    let dataTemp = [preparedData[series[index]]];
    
                    let valueTemp = 0;
                    dataTemp[0].forEach((item,index)=>{
                      
                        valueTemp += item.y-item.y0;
                    })
                    dataValue.push(valueTemp)
                }
              }
              minValue = d3.min(dataValue)
              maxValue = d3.max(dataValue)
              midValue = (minValue + maxValue)/2
            if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
                
            }
              break;
            case 'pie chart':
              data = getAggregatedRowsPie(data, encoding);
              console.log('data-pie',data)
              data.forEach((item, i)=>{
      
                dataValue.push(item[encoding.size.field])
              })
              maxValue = d3.max(dataValue)
              minValue = d3.min(dataValue)
              midValue = (minValue + maxValue)/2
              
              if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
                
            }
              break;
            case 'radar chart':
              
    
              dataSeries = getSeriesRadar(data, encoding);
              stackedData = getStackedDataRadar(data, encoding);
              series = Object.keys(dataSeries);

              const dataProcessed = []
              let dataMin = 10000;
              let dataMax = 0;
              for(let i=0; i<stackedData.length; i++){
                  let temp1 = [];
                  let temp1Data = stackedData[i]
                  for(let j=0; j<temp1Data.length; j++){
                      let temp2 = {};
                      let temp2Data = temp1Data[j];
                      temp2.axis = temp2Data.data.x;
                      temp2.value = temp2Data[1] - temp2Data[0];
                      if(temp2.value >= dataMax){
                          dataMax = temp2.value;
                      }else if(temp2.value <= dataMin){
                          dataMin = temp2.value;
                      }
                      // temp2.value = 1.0;
                      temp1.push(temp2);
                  }
                  dataProcessed.push(temp1);  
              }

              // for(let i=0; i < dataProcessed.length; i++){
              //     for(let j=0; j < dataProcessed[i].length; j++){
              //         dataProcessed[i][j].value / (dataMax - dataMin)
              //     }
              // }
              dataProcessed.forEach(function(v,index){

                  v.forEach(function(v2, index2){
                      v2.value = v2.value / (dataMax - dataMin)
                  })
              })
              dataProcessed.forEach((item, i)=>{
                  let temp = 0;
                  item.forEach((item2,i)=>temp += item2.value)
                  dataValue.push(temp)
              })
              minValue = d3.min(dataValue)
              maxValue = d3.max(dataValue)
              midValue = (minValue + maxValue)/2
            if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
              }
                

              break;
            case 'scatterplot':
              data = getAverageRowsScatter(data, encoding);
              console.log('data-pie',data)
              data.forEach((item, i)=>{
      
                dataValue.push(item[encoding.size.field])
              })
              maxValue = d3.max(dataValue)
              minValue = d3.min(dataValue)
              midValue = (minValue + maxValue)/2
              
              if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
                
            }

              break;
            case 'treemap':
              stackedData = getStackedDataTree(data, encoding)
              stackedData.forEach((item, i)=>{
                  let temp = 0;
                  item.forEach((item2,i)=>temp += item2[1]-item2[0])
                  dataValue.push(temp)
              })
              maxValue = d3.max(dataValue)
              minValue = d3.min(dataValue)
              midValue = (minValue + maxValue)/2
              
              if(colorset.length==2){
                valueScale = d3.scaleLinear().domain([minValue, maxValue]);
                computeColor = d3.interpolate(colorset[0], colorset[1]); 
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(valueScale(dataValue[index])));
                })     
            }else if(colorset.length == 3){
                // valueScale = d3.scaleLinear().domain([minValue, midValue, maxValue]);
                // computeColor = d3.interpolate(colorset[0], colorset[1],colorset[2]);
                computeColor = d3.scaleLinear()
                    .domain([minValue, midValue, maxValue])
                    .range([colorset[0], colorset[1],colorset[2]])
                categories.forEach((item,index)=>{
                  cardColorList.push(computeColor(dataValue[index]));
                })
                
            }
              
              break;
            }
            
   
            
            
        }
        
        
      }

      item.legendChangedColor.forEach((coloritem,index)=>{
        cardColorList[coloritem.fieldsIndex] = coloritem.color;
      })
  
      

      
  

        let component = (
          <D3Container
            type={item.type}
            // // item.dataIndex,
            // // item.category, // category
            // // item.type, //type
            data={this.props.dataList[item.dataIndex]}
            spec={item.spec} //spec
            // categories = {Object.keys(dataCategories)}
            // colormap={this.state.colormap}
            size={!widgets[i]? {w:0,h:0}:{w:widgets[i].w,h:widgets[i].h}}
            legendChangedColor = {item.legendChangedColor}
            cardFieldsList = {cardFieldsList}
            cardColorList = {cardColorList}
            textcolor={this.props.textColor}
            cardcolor={this.props.cardColor}
            cardId={'chart'+item['i']}
            // option={option}
            // notMerge={true}
            // lazyUpdate={true}
            style={{width: '100%',height:'100%'}}
          />
        )
        return (
          // <div style={{width:'100px',height:'50px'}}>
          // <div ref='carddiv' className="carddiv" style={{backgroundColor: this.props.cardColor, boxShadow:'0px 0px 5px 2px '+`${this.props.shadowColor}`, textAlign: 'center',pointerEvents:'box-none'}} key={item.i} data-grid={item} onClick={()=>this.selectChart(i, item.spec)}>
          <div ref='carddiv' className="carddiv" style={{backgroundColor: this.props.cardColor, border:!this.props.chartMode&&this.props.editMode==i? '1px solid '+`${this.props.textColor}`:'1px solid '+`${this.props.shadowColor}`, textAlign: 'center',pointerEvents:'box-none'}} key={item.i} data-grid={item} onClick={()=>this.selectChart(i, item.spec)}>
            <input type="text" id="myVal"  
             onPressEnter={this.startSearch}         
             onBlur={this.inputOnBlur }
             onFocus={this.inputOnFocus }
            value={!this.props.widgets[i].inputvalue? this.props.widgets[i].type: this.props.widgets[i].inputvalue} onChange={this.inputChange.bind(this,i)} 
            style={{backgroundColor: this.props.cardColor, color: this.props.textColor}}></input>
            <span className='remove' style={{color:this.props.textColor}}  onClick={this.onRemoveItem.bind(this, i)}>x</span>
            {component}
            <div style={{position:'absolute',bottom:'0', width:'100%',display:'flex',justifyContent:'center'}}>
            <Row  type="flex" justify="space-around" align="middle" style={{marginBottom:'-8px', width:'100%'}}>
          {
            // if(cardFieldsList !== [])
              cardFieldsList.map((fieldsItem, fieldsIndex) =>{
                  return (
                    <div style={{width:'40px'}}>
                      <Col span={2} style={{marginRight: '20px'}}> 
                          <Button size='small'  onClick={ this.handleStyleClick.bind(this, i, fieldsIndex)} style={{width: '15px', height: '15px', marginTop:'-10px',background: cardColorList[fieldsIndex], border:"#ffffff"}}></Button>
                          
                          {
                          

                          this.state.displayColorPicker[i][fieldsIndex]==true ? 
                            <div style={ popover }>
                            <div style={ cover } onClick={ this.handleStyleClose.bind(this, i,fieldsIndex) } />
                              <SketchPicker width={150} color={cardColorList[fieldsIndex]} presetColors = {suggestion}  style={{marginTop:'50px', marginLeft:'-160px', width:'150px'}} onChange={this.handleStyleChange.bind(this,i,fieldsIndex)} />
                            </div>
                          :null 
                          }
                      </Col>
                      <Col span={2}>
                        {/* <Tooltip title={fieldsItem}> */}
                        <div style={{width:'40px',textAlign:'left',fontSize:'12px',marginTop:'-12px',color:this.props.textColor,whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}} title={fieldsItem}>
                            {fieldsItem}
                            {/* <p style={{textAlign:'left', color:this.props.textColor}}>{fieldsItem}</p> */}
                          </div>
                      {/* </Tooltip> */}
                        
                        </Col>
                      </div>
                      
                  );
              })
          }
          
        
          </Row>
          </div>
         
          </div>
          
          // </div>
        );
      });
    
    };
  
    // addChart(type) {
    //   const addItem = {
    //     x: (this.state.widgets.length * 3) % (this.state.cols || 12),
    //     y: Infinity, // puts it at the bottom
    //     w: 3,
    //     h: 2,
    //     i: new Date().getTime().toString(),
    //   };
    //   this.setState(
    //     {
    //       widgets: this.state.widgets.concat({
    //         ...addItem,
    //         type,
    //       }),
    //     },
    //   );
    // };
  
    onRemoveItem(i) {

      
      
      
      // this.props.changeColormap(this.props.colormap.filter((item,index) => index !=i));


      console.log('colormap-dele', this.props.colormap)
        
      let data = []

        
        // console.log('this.props.colormap',this.props.colormap)
        let colorData = {'colormap': this.props.colormap.filter((item,index) => index !=i), 'backgroundcolor': this.props.backgroundColor, 'currentColorset': this.props.currentColorset}
        console.log('colorData',this.props.currentColorset)

        this.props.changeLoading(true);
        HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
            .then(re=>{
              

                data = re.data
                console.log('dataColor',data)
                this.props.changeGlobalColorpair(data)
                    
            })
            .catch(error=>{
              
                console.log(error.message);
            })
            .then(re=>{
              //打开chart mode - 恢复默认bartchart
              let charttype = 'bar chart'
              
              this.props.changeChartMode(charttype)

              //改变dataIndex
              this.props.switchData(0)

              //关闭edit mode
              this.props.changeEditMode(false);

              // 改变generate channels
              let channels = d3Channels(charttype);
              //注意这里是遍历字典 要按key查找
              let channelsName = Object.keys(channels);
                              
              for(let i = 0; i< channelsName.length; i++){
                  channels[channelsName[i]]['isEncoding'] = false;
              }

              this.props.changeGenerateChannels(d3Channels(charttype))
              this.props.changeGenerateSpec(d3DefaultSpec(charttype))

              this.props.removeChart(this.props.widgets.filter((item,index) => index !=i));
              this.props.changeColormap(this.props.colormap.filter((item,index) => index !=i));  
              this.props.changeLoading(false);
            });  
            // this.props.removeChart(this.props.widgets.filter((item,index) => index !=i)) 
      // console.log('remove',this.state.widgets)
      // this.setState({
      //   widgets: this.state.widgets.filter((item,index) => index !=i)
      // });
  
    }
  
    onLayoutChange = (layout, layouts) =>{
     
      //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
      let widgets = JSON.parse(JSON.stringify(this.props.widgets));
        
      // for(let i = 0; i<widgets.length;i++){
      //     widgets[i].spec.style.colorset = currentColorset;
      // }

      console.log('layouts-change',layouts)
      widgets.forEach((item,index)=>{
       
          // console.log('item',item);
          // console.log('index',index)
          item.w = layouts.sm[index].w;
          item.h = layouts.sm[index].h;
          item.x = layouts.sm[index].x;
          item.y = layouts.sm[index].y;
      })
      this.props.changeMapping(widgets);

      // this.props.changeLayout(layouts);
      // this.forceUpdate();
      // this.setState();

      
      this.saveToLS("layouts", layouts);
      this.setState({ layouts });
    }
    backToInit =() =>{
      this.props.changeChartMode('bar chart');
      this.props.changeGenerateChannels(d3Channels('bar chart'))
      this.props.changeGenerateSpec(d3DefaultSpec('bar chart'))
      this.props.changeEditMode(false)
      this.props.changeEditChannels('')
      this.props.changeEditSpec('')
    
    }
  
    render() {
    console.log('cardColor-render',this.props.cardColor)
     return(
      //  <Layout onClick={this.backToInit.bind(this)} > 
      <Layout>
        {/* <Header style={{ height:'30px'}}> */}
       
        {/* </Header> */}
        <Content id = 'layoutDash' style={{backgroundColor: this.props.backgroundColor}}>
        <input type="text" 
            //  placeholder="Start to make a dashboard!"
             value={this.state.title} onChange={this.titleInputChange.bind(this)} 
             style={{backgroundColor: this.props.backgroundColor, color: this.props.textColor, width:'100%',marginTop:'40px', fontSize:'14px'}}></input>
          <div id="layoutStage" style={{ background: '#fff', padding: 20 }}>
            <ResponsiveReactGridLayout
              style={{width:'800px',height:'528px',marginLeft:'70px',marginTop:'0px'}}
              className="layout"
         
              layouts={this.state.layouts}
              onLayoutChange={(layout, layouts) =>
                this.onLayoutChange(layout, layouts)
              }
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
          </div>
        </Content>
      </Layout>
     )}
  }