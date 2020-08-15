import React, { Component } from 'react';
import { Button, Divider } from 'antd';
import './channelstab.css';
import d3Channels from '@/charts/D3/channels';
import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';
import Encoding from '@/components/ChartEditor/MappingPanel/Encoding';
import * as d3 from 'd3';
import _ from "lodash";
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import{ getStackedData as  getStackedDataArea, getSeries as getSeriesArea} from '@/charts/D3/AreaChart/helper'
import{ getStackedData as  getStackedDataBar, getSeries as getSeriesBar} from '@/charts/D3/BarChart/helper'
import{ getStackedData as  getStackedDataLine, getSeries as getSeriesLine} from '@/charts/D3/LineChart/helper'
import{ getAggregatedRows as  getAggregatedRowsPie, getCategories as getCategoriesPie} from '@/charts/D3/PieChart/helper'
import{ getAggregatedRows as  getAggregatedRowsScatter, getSeries as getSeriesScatter} from '@/charts/D3/ScatterPlot/helper'
import{ getStackedData as  getStackedDataTree, getSeries as getSeriesTree} from '@/charts/D3/TreeMap/helper'
import{ getStackedData as  getStackedDataRadar, getSeries as getSeriesRadar} from '@/charts/D3/RadarChart/helper'
import { chartMode } from '../../../selectors/canvas';

export default class ChannelsTab extends Component {
    static defaultProps = {
        cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
        rowHeight: 30,
      };

    constructor(props) {
        super(props);
        this.handleChartOk = this.handleChartOk.bind(this)
        this.state = {
            // layouts: this.getFromLS("layouts") || {},
            layouts: {
              cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
              rowHeight: 40,
              title: 'Start to make a new dashboard!'
            },
            widgets: []
        }

    }
    //data-mapping
    handleChartOk = () => {

        //生成模式
        if(this.props.chartMode){
            //layout中增加chart
            
            //计算weights
            const size = {
                x: (this.props.widgets.length * 2) % (this.state.cols || 8),
                y: Infinity, // puts it at the bottom
                w: 2,
                h: 1,
                i: new Date().getTime().toString(),
            };
            const type = {
                type: this.props.chartMode
            };
            const dataIndex = {
                dataIndex: this.props.dataIndex
            }
            const category = {
                category: 'D3'
            }
            const spec = {
                spec: this.props.generateSpec
            }
            const legendChangedColor = {
                legendChangedColor: []
            }
            const colorsetType ={
                colorsetType: 1
            }
            const colorsetIndex ={
                colorsetIndex: 0
            }

        new Promise((resolve, reject) => {
            let newWidgets = _.cloneDeep(this.props.widgets)
        this.props.addChart(newWidgets.concat({...size,...type,...dataIndex,...category,...spec, ...legendChangedColor,...colorsetType, ...colorsetIndex}));                  
            resolve('111');
            }).then((res) => {
                        
                        
                        
                //改变dataIndex
                this.props.switchData(this.props.widgets[this.props.widgets.length-1].dataIndex)

                // //改变selectChartIndex
                // this.props.selectChart(i);

                

                //改变edit mode
                this.props.changeEditMode(this.props.widgets.length-1);

                this.props.changeColorset(this.props.widgets[this.props.widgets.length-1].colorsetType, this.props.widgets[this.props.widgets.length-1].colorsetIndex)

                //改变edit channels
                let channels = d3Channels(this.props.widgets[this.props.widgets.length-1].type);
                
                //注意这里是遍历字典 要按key查找
                let channelsName = Object.keys(channels);
                
                for(let i = 0; i< channelsName.length; i++){
                    channels[channelsName[i]]['isEncoding'] = true;
                }



                this.props.changeEditChannels(channels)
                // console.log('this.props.changeEditChannels', d3Channels(this.props.widgets[this.props.widgets.length-1].type))
                
                this.props.changeEditSpec(this.props.widgets[this.props.widgets.length-1].spec)

                //关闭chart mode
                this.props.changeChartMode(false);

     
            });
        
        
        
     
                        
                    

        }

        //编辑模式
        else{
            
            //避坑大法 - 解决改变状态却不刷新页面问题
            //https://blog.csdn.net/qq_40259641/article/details/105275819
            let widgets = [...this.props.widgets];

                    
            console.log('this.props.loading', this.props.isLoading)

            widgets[this.props.editMode].spec = this.props.editSpec;
            widgets[this.props.editMode].dataIndex = this.props.dataIndex;
            this.props.changeMapping(widgets);
            this.props.widgets[this.props.editMode].spec = this.props.editSpec;

        }

        
    

    }

    render() {
        console.log('this.props.chartmode',this.props.chartMode)

        return (
            // <div className="pane ChannelsTab" style={{ height: 255}}>
            <div  style={{ height: 283, padding:'10px', marginTop:'-35px'}}>   
                {/* <div className='header'>Channels</div> */}
                <Divider className='headerDivder' orientation="left">Channels</Divider>
                    
                    <Encoding { ...this.props } />

                    {/* {this.props.selectChartIndex !== -1 ? */}
                    <Button type="primary" block style={{ marginTop: '5px', marginLeft:'45px',backgroundColor:'#00aeff', fontSize:'14px', width:'150px', height:'25px',borderRadius:'7px'}} onClick={this.handleChartOk} type="primary">{this.props.chartMode? 'Generate':'Update'}</Button>
                     {/* : null} */}
              
            </div>
        )
    }
}
