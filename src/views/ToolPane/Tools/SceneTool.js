import React, { Component, } from 'react';
import ReactDOM from 'react-dom'
import {  Table, Collapse, Row, Col, Button, Input, Tooltip, Radio, List, Layout } from 'antd';
import { SketchPicker, GithubPicker,BlockPicker, CompactPicker } from 'react-color';
import '../toolpane.css';
import {AccountBookOutlined,
    WifiOutlined,
    ReadOutlined,
    ControlOutlined,
    VideoCameraOutlined,
    ConsoleSqlOutlined,
    ShopOutlined,
    HeartOutlined,
    NotificationOutlined,
    DollarOutlined,
    BulbOutlined,
    BulbFilled,
    CloseCircleFilled
    } from '@ant-design/icons/lib/icons';
import { displaySpec } from '../../../selectors/vis';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import _ ,{mean}from 'lodash';
import globalColorStyle_discrete from '@/colorStyle_discrete.js'
import globalColorStyle_squencial from '@/colorStyle_squencial.js'
import globalColorStyle_diverging from '@/colorStyle_diverging.js'
import Column from 'antd/lib/table/Column';
import { cardColor } from '../../../selectors/canvas';
import colorStyle_light from '../../../colorStyle_light';

const { Sider, Content, Footer } = Layout;

//初始化行业icon-highlightcolor
const defaultHighlightColor = 'rgb(129,216,247)';

//初始化style_light & style_dark
const defaultColorStyle_discrete = globalColorStyle_discrete;
const defaultColorStyle_squencial = globalColorStyle_squencial;
const defaultColorStyle_diverging = globalColorStyle_diverging;



//初始化stylepicker_discrete & stylepicker_discrete
const defaultDisplayStylePicker_discrete = new Array();

for(let i = 0; i < defaultColorStyle_discrete[0].colorset.length; i++){
    let temp = new Array();
    //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    for(let j = 0; j <= defaultColorStyle_discrete[0].colorset[i].length; j++){
        temp[j] = false;
    }
    defaultDisplayStylePicker_discrete[i] = temp;
}

const defaultDisplayStylePicker_diverging = new Array();
for(let i = 0; i < defaultColorStyle_diverging[0].colorset.length; i++){
    let temp = new Array();
    //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    for(let j = 0; j <= defaultColorStyle_diverging[0].colorset[i].length; j++){
        temp[j] = false;
    }
    defaultDisplayStylePicker_diverging[i] = temp;
}


const defaultDisplayStylePicker_squencial = new Array();
for(let i = 0; i < defaultColorStyle_squencial[0].colorset.length; i++){
    let temp = new Array();
    //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    for(let j = 0; j <= defaultColorStyle_squencial[0].colorset[i].length; j++){
        temp[j] = false;
    }
    defaultDisplayStylePicker_squencial[i] = temp;
}

console.log('default',defaultDisplayStylePicker_diverging)
console.log('default',defaultDisplayStylePicker_squencial)

//初始化current colorset
const defaultCurrentColorset = defaultColorStyle_discrete[0].colorset[0];


//初始化colorpicker style
const popover = {
    position: 'absolute',
    //position: 'relative',
    zIndex: '9999',
    top: '-250px',
    right: '0px',
    bottom: '0px',
    left: '-50px',
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


export default class SceneTool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color : this.props.currentScene.backgroundColor(), //default

            //背景色
            value: 1,
            value2: 1,
            displayColorPicker1: false,
            displayColorPicker2: false,
            BGcolor1: '#FFFFFF',
            BGcolor2: '#090B20',
            cardcolor: 'rgb(255,255,255)',
            textcolor: 'rgb(64,64,64)',
            shadowcolor: 'rgb(250,250,250)',


            //全局色盘库
            colorStyle_discrete: defaultColorStyle_discrete,
            colorStyle_squencial: defaultColorStyle_squencial,
            colorStyle_diverging: defaultColorStyle_diverging,
            // colorStyle: defaultColorStyle,

            //定位行业及行业色盘库
            industryLast: '',
            flagInit: 0,
            highlightColor: defaultHighlightColor,
            industryType: 'business',
            industryIndex: 0,
            spec: '',

            //更改色盘库
            displayStylePicker_discrete: defaultDisplayStylePicker_discrete,
            displayStylePicker_squencial: defaultDisplayStylePicker_squencial,
            displayStylePicker_diverging: defaultDisplayStylePicker_diverging,
            // displayStylePicker: defaultDisplayStylePicker,
            unAddColor: '',

            //定位当前颜色主题
            colorsetIndex: 0,
            currentColorset: defaultCurrentColorset, 
            
            //记录后端传递的推荐色盘
            presetColorsAdd: '',
            presetColorsReplace: '',

            //表格排序
            sortedInfo: {
                order: 'descend',
                columnKey: 'grade'
            }
            
        };
        this.handleChartOk = this.handleChartOk.bind(this); 
        this.cardcolorMap = this.cardcolorMap.bind(this);


    }

    //背景色与cardcolor,textcolor映射函数
    cardcolorMap(bgcolor){
        //hex -> rgb
        function hexToRgb(hex) {
            return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
                    + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
        }
        let cardcolor;
        let textcolor;
        var shadowcolor;
        let flag = 0;
        switch(bgcolor){
            //深色teample
            case '#090B20':
                cardcolor = 'rgba(16,22,56,0.8)'
                // textcolor = 'rgb(68,255,212)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor='rgb(4,6,27)'
                flag = 2
                break;
            // case '#423457':
            //     cardcolor = 'rgba(20,11,30,0.8)'
            //     textcolor = 'rgba(255,255,255,0.9)'
            //     // shadowcolor='rgb(61,47,82)'
            //     // textcolor = 'rgb(255,255,255)'
            //     flag = 2
            //     break;
            case '#0e022a':
                cardcolor = 'rgba(14,2,42,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(9,0,37)'
                // textcolor = 'rgb(255,255,255)'
                flag = 2
                break;
            case '#20787c':
                cardcolor = 'rgba(13,51,70,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(27,115,119)'
                flag = 2
                break;
            case '#0b0f28':
                cardcolor = 'rgba(16,22,56,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(6,10,35)'
                // textcolor = 'rgb(27,117,194)'
                flag = 2
                break;
            case '#4d305e':
                cardcolor = 'rgba(53,27,66,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(72,43,69)'
                // textcolor = 'rgb(255,255,255)'
                flag = 2
                break;
            case '#524741':
                cardcolor = 'rgba(59,49,47,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(77,66,60)'
                // textcolor = 'rgb(255,255,255)'
                break;
            case '#476E2D':
                cardcolor = 'rgba(28,60,22,0.8)'
                textcolor = 'rgb(255,255,255)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(65,105,40)'
                flag = 2
                break;
            case '#2B363A':
                cardcolor = 'rgba(33,42,49,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(38,49,53)'
                flag = 2
                break;
            case '#3f728f':
                cardcolor = 'rgba(43,78,98,0.8)'
                textcolor = 'rgba(255,255,255,0.9)'
                // shadowcolor = 'rgb(58,109,138)'
                flag = 2
                break;

            //浅色tample
            case '#F6F7FF':
            case '#ECECEC':
            case '#ececec':
            case '#FFF7F6':
            case '#FFF7F6':
            case '#FFFFF6':
            case '#F7FFF6':
            case '#F6FBFF':
            case '#F6F7FF':
            case '#FFF6FF':
                cardcolor = 'rgb(255,255,255)'
                textcolor = 'rgba(64,64,64,0.9)'
                flag = 2
                break;
        }

        if(bgcolor[0] == '#'){
            bgcolor = hexToRgb(bgcolor)
        }
        console.log('bgcolor',bgcolor)
        let temp = bgcolor.split(',')
        var r = parseInt(temp[0].split('(')[1]);
        var g = parseInt(temp[1]);
        var b = parseInt(temp[2].split('(')[0]);

        //未匹配的时 背景与颜色映射
        if(flag == 0){
            

            // textcolor= 'rgb('+ `${255-r}` + ',' + `${255-g}` +','+ `${255-b}` +')';
           //textcolor固定两种模式
            textcolor=this.state.value==1? 'rgb(64,64,64,0.9)':'rgb(255,255,255,0.9)'
            if(mean([r,g,b]) >=150){
                textcolor= 'rgb(64,64,64,0.9)'
                cardcolor = 'rgba('+ `${r+10 > 255 ? 255: r+10}` + ',' + `${g+10 > 255 ? 255: g+10}` +','+ `${b+10 > 255 ? 255: b+10}` +',0.8)';
                shadowcolor = 'rgb('+ `${r-15 < 0 ? 0 : r-15}` + ',' + `${g-15 < 0 ? 0: g-15}` +','+ `${b-15 < 0 ? 0: b-15}` +')';
            }else{
                textcolor = 'rgb(255,255,255,0.9)'
                cardcolor = 'rgba('+ `${r-15 < 0 ? 0 : r-15}` + ',' + `${g-15 < 0 ? 0: g-15}` +','+ `${b-15 < 0 ? 0: b-15}` +',0.8)';
                shadowcolor = 'rgb('+ `${r-5 < 0 ? 0 : r-5}` + ',' + `${g-5 < 0 ? 0: g-5}` +','+ `${b-5 < 0 ? 0: b-5}` +')';
                // shadowcolor = 'rgb('+ `${r+15 < 0 ? 0 : r+15}` + ',' + `${g+15 < 0 ? 0: g+15}` +','+ `${b+15 < 0 ? 0: b+15}` +')';
            }
            
        }else{      
             shadowcolor = 'rgb('+ `${r-10 < 0 ? 0 : r-10}` + ',' + `${g-10 < 0 ? 0: g-10}` +','+ `${b-10 < 0 ? 0: b-10}` +')';
        }
        
        console.log('cardcolor-tool',cardcolor)
        console.log('textcolor-tool',textcolor)
        this.setState({
            cardcolor: cardcolor,
            textcolor: textcolor,
            shadowcolor: shadowcolor,
        })

        // return cardcolor,textcolor;
    }

    //light模式color picker出现
    handleColorClick1 () {
        let {displayColorPicker1} =this.state;
        displayColorPicker1 = displayColorPicker1==="none"?"block":"none";
        this.setState({displayColorPicker1})
        if(displayColorPicker1){
            //this.props.updateColor(key,color)
        }
        this.setState({ displayColorPicker1: !this.state.displayColorPicker1 })

    };

    //light模式color更改
    handleColorChange1 = (value)=>{
        let color = value.hex;

        //更改state cardcolor和textcolor卡片样式
        
        //异步操作！！
        new Promise((resolve, reject) => {
            this.cardcolorMap(color);
            resolve('111');
          }).then((res) => {
            if(this.state.value == 1){
                console.log('cardcolor-tool',this.state.cardcolor);
                var layoutStage = document.getElementById('layoutStage')
                ReactDOM.findDOMNode(layoutStage).style.backgroundColor = color;
    
                this.props.changeColorStyle(color, this.state.cardcolor, this.state.textcolor, this.state.shadowcolor)
            }  
            
          });

          

        //   cardcolor, textcolor = this.cardcolorMap(color)
          
        
        
        
        
        let r1, g1, b1;
        let r2, g2, b2;
        if(color[0] == '#'){
            r1 = parseInt('0x' + color.slice(1, 3));
            g1 = parseInt('0x' + color.slice(3, 5));
            b1 = parseInt('0x' + color.slice(5, 7));
        }else{
            let temp = color.split(',')
            r1 = parseInt(temp[0].split('(')[1]);
            g1 = parseInt(temp[1]);
            b1 = parseInt(temp[2].split('(')[0]);
        }

        // //更新colorStyle_light
        // let colorStyle_light = globalColorStyle_light;
        // let industryIndex = this.state.industryIndex;
        // let colorsetIndex = this.state.colorsetIndex;

        // //迷惑的深拷贝浅拷贝问题，待查
        // colorStyle_light.forEach((item, index) => {
        //     let item_temp = item;
        //     item_temp.colorset = item.colorset.filter((item2, index2) => {
        //         let flag = true;
        //         item2.forEach((item3, index3) => {
        //             if(item3[0] == '#'){
        //                 r2 = parseInt('0x' + item3.slice(1, 3));
        //                 g2 = parseInt('0x' + item3.slice(3, 5));
        //                 b2 = parseInt('0x' + item3.slice(5, 7));
        //             }else{
        //                 let temp = item3.split(',')
        //                 r2 = parseInt(temp[0].split('(')[1]);
        //                 g2 = parseInt(temp[1]);
        //                 b2 = parseInt(temp[2].split('(')[0]);
        //             }

        //             console.log('jnd',(r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2))
        //             //jnd感知 待查
        //             if(((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)) < 300 ){
        //                 flag =  false;
        //             }
        //         })
        //         if(flag == false){
        //             console.log('fasel')
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     })
   
        // })

        // console.log('colorstyle_light',colorStyle_light)

        // //更新displaycolorStyle_light
        // let displayStylePicker_light = new Array();
        // for(let i = 0; i < colorStyle_light[0].colorset.length; i++){
        //     let temp = new Array();
        //     //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
        //     for(let j = 0; j <= colorStyle_light[0].colorset[i].length; j++){
        //         temp[j] = false;
        //     }
        //     displayStylePicker_light[i] = temp;
        // }     

        // //如果是浅色模式,更新全局颜色
        // if(this.state.value == 1){
        //     console.log('BGCOLOR1',color)

        //     let currentColorset = this.state.currentColorset;
        //     currentColorset = colorStyle_light[industryIndex].colorset[colorsetIndex];

        //     //更新全局颜色
        //     //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
        //     let widgets = [...this.props.widgets];
        //     widgets.forEach((item,index)=>{
        //         item.spec.style.colorset = currentColorset;
        //     })
        //     this.props.changeMapping(widgets);
        //     this.props.changeCurrentColorset(currentColorset);
        //     let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
        //     let data = []
        //     console.log('colorData',this.props.currentColorset)
        //     HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
        //         .then(re=>{
        //             data = re.data
        //             console.log('dataColor',data)
                    
                        
        //         })
        //         .catch(error=>{
        //             console.log(error.message);
        //         })
        //         //异步 保证canvas拿到新色盘
        //         .then(res=>{
        //             this.props.changeGlobalColorpair(data)
        //         }); 
        //     this.setState({
        //         currentColorset: currentColorset
        //     })
        // }      
    
        this.setState({
            // colorStyle_light: colorStyle_light,
            // displayStylePicker_light: displayStylePicker_light,
            BGcolor1: color
        })
        // if(this.state.value==1)
        
    }
  
    handleColorClose1 = () => {
        this.setState({ displayColorPicker1: false })
    };

    //调出colorpicker
    handleColorClick2 () {
        let {displayColorPicker2} =this.state;
        displayColorPicker2 = displayColorPicker2==="none"?"block":"none";
        this.setState({displayColorPicker2})
        if(displayColorPicker2){
            //this.props.updateColor(key,color)
        }
        this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })

    };

    //通过index.js调用updateScene方法, 并引起系统响应
    handleColorChange2 = (value)=>{

        let color = value.hex;

        //更改state cardcolor和textcolor卡片样式
        
        //异步操作！！
        new Promise((resolve, reject) => {
            this.cardcolorMap(color);
            resolve('yeah');
          }).then((res) => {
            if(this.state.value == 2){
                console.log('cardcolor-tool',this.state.cardcolor);
                var layoutStage = document.getElementById('layoutStage')
                ReactDOM.findDOMNode(layoutStage).style.backgroundColor = color;
    
                this.props.changeColorStyle(color, this.state.cardcolor, this.state.textcolor,this.state.shadowcolor)
            }  
          });
        
        let r1, g1, b1;
        let r2, g2, b2;
        if(color[0] == '#'){
            r1 = parseInt('0x' + color.slice(1, 3));
            g1 = parseInt('0x' + color.slice(3, 5));
            b1 = parseInt('0x' + color.slice(5, 7));
        }else{
            let temp = color.split(',')
            r1 = parseInt(temp[0].split('(')[1]);
            g1 = parseInt(temp[1]);
            b1 = parseInt(temp[2].split('(')[0]);
        }

        // //更新colorStyle_dark
        // let colorStyle_dark = globalColorStyle_dark;
        // let industryIndex = this.state.industryIndex;
        // let colorsetIndex = this.state.colorsetIndex;

        // //迷惑的深拷贝浅拷贝问题，待查
        // colorStyle_dark.forEach((item, index) => {
        //     let item_temp = item;
        //     item_temp.colorset = item.colorset.filter((item2, index2) => {
        //         let flag = true;
        //         item2.forEach((item3, index3) => {
        //             if(item3[0] == '#'){
        //                 r2 = parseInt('0x' + item3.slice(1, 3));
        //                 g2 = parseInt('0x' + item3.slice(3, 5));
        //                 b2 = parseInt('0x' + item3.slice(5, 7));
        //             }else{
        //                 let temp = item3.split(',')
        //                 r2 = parseInt(temp[0].split('(')[1]);
        //                 g2 = parseInt(temp[1]);
        //                 b2 = parseInt(temp[2].split('(')[0]);
        //             }

        //             console.log('jnd',(r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2))
        //             //jnd感知 待查
        //             if(((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)) < 300 ){
        //                 flag =  false;
        //             }
        //         })
        //         if(flag == false){
        //             console.log('fasel')
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     })
   
        // })

        // //更新displaycolorStyle_dark
        // let displayStylePicker_dark = new Array();
        // for(let i = 0; i < colorStyle_dark[0].colorset.length; i++){
        //     let temp = new Array();
        //     //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
        //     for(let j = 0; j <= colorStyle_dark[0].colorset[i].length; j++){
        //         temp[j] = false;
        //     }
        //     displayStylePicker_dark[i] = temp;
        // }  

        

        // //如果是深色模式,更新色盘
        // if(this.state.value == 2){
        //     console.log('BGCOLOR2',color)

        //     let currentColorset = colorStyle_dark[industryIndex].colorset[colorsetIndex];

        //     //更新全局颜色
        //     //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
        //     let widgets = [...this.props.widgets];
        //     widgets.forEach((item,index)=>{
        //         item.spec.style.colorset = currentColorset;
        //     })
        //     this.props.changeMapping(widgets);
        //     this.props.changeCurrentColorset(currentColorset);
        //     let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
        //     let data = []
        //     console.log('colorData',this.props.currentColorset)
        //     HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
        //         .then(re=>{
        //             data = re.data
        //             console.log('dataColor',data)
                    
                        
        //         })
        //         .catch(error=>{
        //             console.log(error.message);
        //         })
        //         //异步 保证canvas拿到新色盘
        //         .then(res=>{
        //             this.props.changeGlobalColorpair(data)
        //         }); 
        //     this.setState({
        //         currentColorset: currentColorset
        //     })
        // }      

      
        this.setState({
            // colorStyle_dark: colorStyle_dark,
            // displayStylePicker_dark: displayStylePicker_dark,
            BGcolor2: color
        })
        
    }
  
    handleColorClose2 = () => {
        this.setState({ displayColorPicker2: false })
    };

    onChangeBackgroundMode = e => {
 

        //全局色盘库
        let colorStyle_light = this.state.colorStyle_light;
        let colorStyle_dark = this.state.colorStyle_dark;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.state.colorsetIndex;

       //  if(e.target.value != this.state.value){
           
           let color = e.target.value == 1? this.state.BGcolor1: this.state.BGcolor2;
           //更改state cardcolor和textcolor卡片样式
          
           //异步操作！！
           new Promise((resolve, reject) => {
               this.cardcolorMap(color);
              
               resolve('yeah');
           }).then((res) => {
               // if(this.state.value == 2){
       
                   var layoutStage = document.getElementById('layoutStage')
                   ReactDOM.findDOMNode(layoutStage).style.backgroundColor = color;
       
                   this.props.changeColorStyle(color, this.state.cardcolor, this.state.textcolor, this.state.shadowcolor)
               // }  
           });


       // }
        
       
        
           
        
           
       this.setState({
           value: e.target.value,
       });
   };



    onChangeColorsetMode = e => {
 

        //全局色盘库
        let colorStyle_discrete = this.state.colorStyle_discrete;
        let colorStyle_squencial = this.state.colorStyle_squencial;
        let colorStyle_diverging = this.state.colorStyle_diverging;


        //全局色盘库
        let industryIndex = this.state.industryIndex;

        // 初始化colorsetIndex
        let colorsetIndex = 0;

        let currentColorset;

       switch(e.target.value){
            case 1:
                currentColorset = colorStyle_discrete[industryIndex].colorset[colorsetIndex];
                break;
            case 2:
                currentColorset = colorStyle_squencial[industryIndex].colorset[colorsetIndex];
                break;
            case 3:
                currentColorset = colorStyle_diverging[industryIndex].colorset[colorsetIndex];
                break;
            default:
                currentColorset = colorStyle_discrete[industryIndex].colorset[colorsetIndex];
                break;
       }

    // //    更新colorpicker
    //     let displayStylePicker_discrete = new Array();
    //     for(let i = 0; i < colorStyle_discrete[index].colorset.length; i++){
    //         let temp = new Array();
    //         //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    //         for(let j = 0; j <= colorStyle_discrete[index].colorset[i].length; j++){
    //             temp[j] = false;
    //         }
    //         displayStylePicker_discrete[i] = temp;
    //     }

    //     let displayStylePicker_squencial = new Array();
    //     for(let i = 0; i < colorStyle_squencial[index].colorset.length; i++){
    //         let temp = new Array();
    //         //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    //         for(let j = 0; j <= colorStyle_squencial[index].colorset[i].length; j++){
    //             temp[j] = false;
    //         }
    //         displayStylePicker_squencial[i] = temp;
    //     }

    //     let displayStylePicker_diverging = new Array();
    //     for(let i = 0; i < colorStyle_diverging[index].colorset.length; i++){
    //         let temp = new Array();
    //         //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    //         for(let j = 0; j <= colorStyle_squencial[index].colorset[i].length; j++){
    //             temp[j] = false;
    //         }
    //         displayStylePicker_squencial[i] = temp;
    //     }
        
       
        // if(e.target.value != this.state.value){
        //    let currentColorset = e.target.value == 1 ? colorStyle_light[industryIndex].colorset[colorsetIndex] : colorStyle_dark[industryIndex].colorset[colorsetIndex];
        //    this.props.changeCurrentColorset(currentColorset);
        //    let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
        //    let data = []
        //    console.log('colorData',this.props.currentColorset)
        //    HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
        //        .then(re=>{
        //            data = re.data
        //            console.log('dataColor',data)
                   
                       
        //        })
        //        .catch(error=>{
        //            console.log(error.message);
        //        })
        //        //异步 保证canvas拿到新色盘
        //        .then(res=>{
        //            this.props.changeGlobalColorpair(data)
        //        }); 
        //    this.setState({
        //        //切换模式之后，colorsetIndex恢复为0
        //        colorsetIndex: 0,
        //        currentColorset : currentColorset
        //    });

           //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
           let widgets = [...this.props.widgets];
           let chartMode = this.props.chartMode;
           let editMode  = this.props.editMode;

           if(!chartMode){
               widgets[editMode].colorsetType = e.target.value;
               widgets[editMode].colorsetIndex = colorsetIndex;
               widgets[editMode].spec.style.colorset = currentColorset;
               widgets[editMode].legendChangedColor = [];
           }
           
        //    widgets.forEach((item,index)=>{
        //        item.spec.style.colorset = currentColorset;
        //        item.legendChangedColor = []
        //    })
           this.props.changeMapping(widgets)
           this.props.changeCurrentColorset(currentColorset)

           this.props.changeColorset( e.target.value, this.props.colorsetIndex)
           

        //    }
        
           
       this.setState({
           colorsetIndex: 0,
           currentColorset: currentColorset,
           value2: e.target.value
       });
   };


    
    editElement(eleIndex, element) {
        // this.props.displayAssistLines(false);
        const newScene = _.cloneDeep(this.props.currentScene);
        const newElement = _.cloneDeep(element);
        newScene.updateElement(element, eleIndex);
        this.props.updateScene(this.props.sceneIndex, newScene);
        const elementName = this.props.sceneIndex + '-' + eleIndex;
        this.props.updateElement(newElement, eleIndex, elementName);
    }

    //根据行业切换色盘库
    // setColorStyle = (industry, e) =>{
        
       
    //     //行业icon高亮
    //     if(this.state.industryLast!==''){
    //         this.state.industryLast.style.color = '';
    //     }
    //     e.target.style.color = this.state.highlightColor;

    //     //更新industryIndex

    //     let colorStyle_light = this.state.colorStyle_light;
    //     let colorStyle_dark = this.state.colorStyle_dark;

    //     //更新colorStyle字典index
    //     let index = 0;
    //     // console.log('indus',industry)
    //     switch(industry){
    //         case 'business':
    //             index = 0
    //             break;
                
    //         case 'education':
    //             index = 1
    //             break;

    //         case 'healthcare':
    //             index = 2
    //             break;

    //         case 'finance':
    //             index = 3
    //             break;

    //         case 'manufacturing':
    //             index = 4
    //             break;

    //         case 'marketing':
    //             index = 5
    //             break;

    //         case 'project':
    //             index = 6
    //             break;

    //         case 'retail':
    //             index = 7
    //             break;

    //         case 'media':
    //             index = 8
    //             break;

    //         case 'sports':
    //             index = 9
    //             break;
                
    //         case 'technology':
    //             index = 10
    //             break;

    //         case 'web':
    //             index = 11
    //             break;
            
    //         default:
    //             index = 0
    //     }

    //     //初始化colorsetIndex
    //     let colorsetIndex = 0;

    //     //更新currentColorset
    //     let currentColorset = this.state.value == 1? colorStyle_light[index].colorset[0] : colorStyle_dark[index].colorset[0];

    //     //更新colorpicker
    //     let displayStylePicker_light = new Array();
    //     for(let i = 0; i < colorStyle_light[index].colorset.length; i++){
    //         let temp = new Array();
    //         //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    //         for(let j = 0; j <= colorStyle_light[index].colorset[i].length; j++){
    //             temp[j] = false;
    //         }
    //         displayStylePicker_light[i] = temp;
    //     }

    //     let displayStylePicker_dark = new Array();
    //     for(let i = 0; i < colorStyle_dark[index].colorset.length; i++){
    //         let temp = new Array();
    //         //注意这里是j<=  因为要多留一位给添加颜色的colorpicker
    //         for(let j = 0; j <= colorStyle_dark[index].colorset[i].length; j++){
    //             temp[j] = false;
    //         }
    //         displayStylePicker_dark[i] = temp;
    //     }
       
    //     //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
    //     let widgets = [...this.props.widgets];
        
    //     widgets.forEach((item,index)=>{
    //         item.spec.style.colorset = currentColorset;
    //     })
    //     this.props.changeMapping(widgets)
    //     // this.props.widgets = widgets;
        
    //     this.props.changeCurrentColorset(currentColorset);
    //     let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
    //     let data = []
    //     console.log('colorData',this.props.currentColorset)
    //     HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
    //         .then(re=>{
    //             data = re.data
    //             console.log('dataColor',data)
                
                    
    //         })
    //         .catch(error=>{
    //             console.log(error.message);
    //         })
    //         //异步 保证canvas拿到新色盘
    //         .then(res=>{
    //             this.props.changeGlobalColorpair(data)
    //         });  
           
        
           

    //    console.log('index-education', index)
    //     this.setState({
    //         industryType: industry,
    //         industryLast: e.target,
    //         flagInit: 1,
    //         industryIndex: index,
    //         colorsetIndex: colorsetIndex,
    //         currentColorset: currentColorset,
    //         displayStylePicker_light: displayStylePicker_light,
    //         displayStylePicker_dark: displayStylePicker_dark,
    //     })
    // }

    //选择色块，调出该色块的colorpicker
    handleStyleClick = (index, index2) =>{
        console.log('colorclick',this.state.displayStylePicker_diverging)
         //打印日志
        HttpUtil.post(ApiUtil.API_COLOR_LOG, 'prepare for replacing color in color palettes')
        .then(re=>{         
        })
        .catch(error=>{
            console.log(error.message);
        })

        // let colorStyle = this.state.value2 ==1 ? this.state.colorStyle_discrete: (this.state.value2 == 2?this.state.colorStyle_squencial:this.state.colorStyle_diverging);


        // let industryIndex = this.state.industryIndex;
        

        let displayStylePicker = this.props.colorsetType == 1? this.state.displayStylePicker_discrete: (this.props.colorsetType == 2? this.state.displayStylePicker_squencial:this.state.displayStylePicker_diverging);
        
        console.log('colorpicker222',displayStylePicker)
        displayStylePicker[index][index2] = !displayStylePicker[index][index2];
        console.log('colorpicker',displayStylePicker)
        
        if(this.props.colorsetType == 1){    
            this.setState({
                displayStylePicker_discrete: displayStylePicker,
            });
        }else if(this.props.colorsetType == 2){
            this.setState({
                displayStylePicker_squencial: displayStylePicker,
            });
        }else{
            this.setState({
                displayStylePicker_diverging: displayStylePicker,
            });
        }
        
    }

    //对色盘中某个值进行修改
    handleStyleChange = (index, index2, value) => {
    //打印日志
      //判断是否选择的是色盘中的颜色
      //推荐的颜色组
      const presetColorsReplace = this.state.presetColorsReplace;
      let suggestion = []
        for(let i=0; i < presetColorsReplace.length; i++){
            let rgb = '';
            rgb = 'rgb(' + presetColorsReplace[i][0] + ','+ presetColorsReplace[i][1] + ','+presetColorsReplace[i][2] +')';       
            suggestion.push(rgb);       
            
        }
        let chooseColor = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';
        let logStr = suggestion.indexOf(chooseColor)!=-1? 'replace color with existed color in color palettes' : 'replace color by self in color palettes'
        //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, logStr)
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      })


        //更新全局色盘库
        let colorStyle = this.props.colorsetType ==1 ? this.state.colorStyle_discrete: (this.props.colorsetType == 2?this.state.colorStyle_squencial:this.state.colorStyle_diverging);
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.props.colorsetIndex;

        colorStyle[industryIndex].colorset[index][index2] = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';

        //更新现在的色盘
        let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新全局颜色
        //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
        let widgets = [...this.props.widgets];
        let editMode = this.props.editMode;
        let chartMode = this.props.chartMode;
        if(!chartMode){
            widgets[editMode].spec.style.colorset = currentColorset;
            
        }
        
        // for(let i = 0; i<widgets.length;i++){
        //     widgets[i].spec.style.colorset = currentColorset;
        // }
        this.props.changeMapping(widgets);

        this.props.changeCurrentColorset(currentColorset);
      
        
        if(this.props.colorsetType == 1){
            this.setState({
                colorStyle_discrete: colorStyle,
                currentColorset: currentColorset,
            });
        }else if(this.props.colorsetType == 2){
            this.setState({
                colorStyle_squencial: colorStyle,
                currentColorset: currentColorset,
            });
        }else{
            this.setState({
                colorStyle_diverging: colorStyle,
                currentColorset: currentColorset,
            });
        }
        
    }

    //关闭colorpicker
    handleStyleClose = (index, index2) =>{
        //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, 'stop to replace color in color palettes')
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      })

      let displayStylePicker = this.props.colorsetType == 1? this.state.displayStylePicker_discrete: (this.props.colorsetType == 2? this.state.displayStylePicker_squencial:this.state.displayStylePicker_diverging);
      displayStylePicker[index][index2] = false;
      if(this.props.colorsetType == 1){    
          this.setState({
              displayStylePicker_discrete: displayStylePicker,
          });
      }else if(this.props.colorsetType == 2){
          this.setState({
              displayStylePicker_squencial: displayStylePicker,
          });
      }else{
          this.setState({
              displayStylePicker_diverging: displayStylePicker,
          });
      }
    }

    // //对色盘中某个值进行删除
    // handleStyleDelete = (index, index2)=>{
    //     //打印日志
    //   HttpUtil.post(ApiUtil.API_COLOR_LOG, 'delete color in color palettes')
    //   .then(re=>{         
    //   })
    //   .catch(error=>{
    //       console.log(error.message);
    //   })

    //     //更新全局色盘库
    //     let colorStyle = this.state.value ==1 ? this.state.colorStyle_light: this.state.colorStyle_dark;
    //     let displayStylePicker = this.state.value == 1? this.state.displayStylePicker_light: this.state.displayStylePicker_dark;
    //     let industryIndex = this.state.industryIndex;
    //     let colorsetIndex = this.state.colorsetIndex;

    //     //删除全局色盘库中的某个值
    //     colorStyle[industryIndex].colorset[index].splice(index2, 1);
    //     //删除displayStylePicker中的某个值
    //     displayStylePicker[index].splice(index2, 1);


    //     //下面的操作与stylechange中一致
    //     //更新现在的色盘
    //     let currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

    //     //更新全局颜色
    //     //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
    //     let widgets = [...this.props.widgets];
        
    //     // for(let i = 0; i<widgets.length;i++){
    //     //     widgets[i].spec.style.colorset = currentColorset;
    //     // }
    //     widgets.forEach((item,index)=>{
    //         // console.log('item',item);
    //         // console.log('index',index)
    //         item.spec.style.colorset = currentColorset;
    //     })
    //     this.props.changeMapping(widgets)

    //     // //更新所有element
    //     // // Update chart on canvas
    //     // const newScene = Object.assign({}, this.props.currentScene);
        
      
    //     this.props.changeCurrentColorset(currentColorset);
    //     let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
    //     let data = []
    //     console.log('colorData',this.props.currentColorset)
    //     HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
    //         .then(re=>{
    //             data = re.data
    //             console.log('dataColor',data)
                
                    
    //         })
    //         .catch(error=>{
    //             console.log(error.message);
    //         })
    //         //异步 保证canvas拿到新色盘
    //         .then(res=>{
    //             this.props.changeGlobalColorpair(data)
    //         }); 
        
    //     if(this.state.value == 1){
    //         this.setState({
    //             colorStyle_light: colorStyle,
    //             displayStylePicker_light: displayStylePicker,
    //             currentColorset: currentColorset,
    //         });
    //     }else{
    //         this.setState({
    //             colorStyle_dark: colorStyle,
    //             displayStylePicker_dark: displayStylePicker,
    //             currentColorset: currentColorset,
    //         });
    //     }
    // }

    // //调出添加颜色的colorpicker/关闭添加颜色的colorpicker+更新添加后的颜色
    // handleStyleAddClick = (index) =>{
    //     //打印日志
    //     HttpUtil.post(ApiUtil.API_COLOR_LOG, 'prepare for adding color in color palettes')
    //     .then(re=>{         
    //     })
    //     .catch(error=>{
    //         console.log(error.message);
    //     })

    //     let colorStyle = this.state.value ==1 ? this.state.colorStyle_light: this.state.colorStyle_dark;
    //     let industryIndex = this.state.industryIndex;
    //     let colorsetData = [...colorStyle[industryIndex].colorset[index]];

    //     for(let i=0; i < colorsetData.length; i++){
    //         let temp1 = colorsetData[i].replace(/rgb\(/, " ")
    //         let temp2 = temp1.replace(/\)/, " ")
    //         let temp3 = temp2.split(",")
    //         let temp4 = []
    //         temp4=temp3.map(function(data){
    //             return +data;
    //         });
    //         colorsetData[i] = temp4;
    //     }

    //     var data = []
    //     // setTimeout(()=> console.log('成功',data))

    //     HttpUtil.post(ApiUtil.API_COLOR_SUGESSTION, colorsetData)
    //         .then(re=>{
    //             data = re.data
    //             this.setState({
    //                 presetColorsAdd: data,
    //             });
                
    //         })
    //         .catch(error=>{
    //             console.log(error.message);
    //         });

        

    //     let displayStylePicker = this.state.value == 1? this.state.displayStylePicker_light: this.state.displayStylePicker_dark;
      
    //     displayStylePicker[index][-1] = !displayStylePicker[index][-1];
        
        
    //     if(this.state.value == 1){
    //         this.setState({
    //             displayStylePicker_light: displayStylePicker,
    //         });
    //     }else{
    //         this.setState({
    //             displayStylePicker_dark: displayStylePicker,
    //         });
    //     }

    // }

    // //更换unAddColor
    // handleStyleAddChange = (value) =>{
    //     //打印日志
    //   //判断是否选择的是推荐颜色
    //   //推荐的颜色组
    //   const presetColorsAdd = this.state.presetColorsAdd;
    //   let suggestion = []
    //     for(let i=0; i < presetColorsAdd.length; i++){
    //         let rgb = '';
    //         rgb = 'rgb(' + presetColorsAdd[i][0] + ','+ presetColorsAdd[i][1] + ','+presetColorsAdd[i][2] +')';       
    //         suggestion.push(rgb);       
            
    //     }
    //     let chooseColor = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';
    //     let logStr = suggestion.indexOf(chooseColor)!=-1? 'add color with suggestion in color palettes' : 'add color by self in color palettes'
    //     //打印日志
    //   HttpUtil.post(ApiUtil.API_COLOR_LOG, logStr)
    //   .then(re=>{         
    //   })
    //   .catch(error=>{
    //       console.log(error.message);
    //   })


    //     let unAddColor = this.state.unAddColor;
    //     unAddColor = 'rgb('+ value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b +')';
    //     this.setState({
    //         unAddColor: unAddColor,
    //     })
    // }


    

    handleStyleAddClose = (index) =>{
        //打印日志
        HttpUtil.post(ApiUtil.API_COLOR_LOG, 'stop to add color in color palettes')
        .then(re=>{         
        })
        .catch(error=>{
            console.log(error.message);
        })

        let displayStylePicker = this.state.value == 1? this.state.displayStylePicker_light: this.state.displayStylePicker_dark;
        displayStylePicker[index][-1] = false;


        //更新全局色盘库
        let colorStyle = this.state.value ==1 ? this.state.colorStyle_light: this.state.colorStyle_dark;
        let industryIndex = this.state.industryIndex;
        let colorsetIndex = this.prop.colorsetIndex;
        let unAddColor = this.state.unAddColor;

        //更新现在的色盘
        let currentColorset = this.state.currentColorset;
            
        //增加全局色盘库中的某个值
        colorStyle[industryIndex].colorset[index].push(unAddColor);

        //下面的操作与stylechange中一致

        currentColorset = colorStyle[industryIndex].colorset[colorsetIndex];

        //更新全局颜色
        //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
        let widgets = [...this.props.widgets];
        
        // for(let i = 0; i<widgets.length;i++){
        //     widgets[i].spec.style.colorset = currentColorset;
        // }
        widgets.forEach((item,index)=>{
            // console.log('item',item);
            // console.log('index',index)
            item.spec.style.colorset = currentColorset;
        })
        this.props.changeMapping(widgets)

   
        displayStylePicker[index][-1] = false;

        //增加一位false
        displayStylePicker.push(false);
        this.props.changeCurrentColorset(currentColorset);
        let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': currentColorset}
        let data = []
        console.log('colorData',this.props.currentColorset)
        HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
            .then(re=>{
                data = re.data
                console.log('dataColor',data)
                
                    
            })
            .catch(error=>{
                console.log(error.message);
            })
            //异步 保证canvas拿到新色盘
            .then(res=>{
                this.props.changeGlobalColorpair(data)
            }); 

        if(this.state.value == 1){
            this.setState({
                colorStyle_light: colorStyle,
                displayStylePicker_light: displayStylePicker,
                currentColorset: currentColorset,
            });
        }else{
            this.setState({
                colorStyle_dark: colorStyle,
                displayStylePicker_dark: displayStylePicker,
                currentColorset: currentColorset,
            });
        }
    }


    //更新所有element颜色
    handleChartOk = (e) => {
        //打印日志
      HttpUtil.post(ApiUtil.API_COLOR_LOG, 'change colorset in color palettes')
      .then(re=>{         
      })
      .catch(error=>{
          console.log(error.message);
      })

    // handleChartOk = (selectedRowKeys) => {
        // console.log('selectedRows',selectedRowKeys)
        let colorStyle = this.props.colorsetType ==1 ? this.state.colorStyle_discrete: (this.props.colorsetType == 2?this.state.colorStyle_squencial:this.state.colorStyle_diverging);
        let colorsets =  colorStyle[this.state.industryIndex].colorset; 
        
        //更新全局颜色
        //浅拷贝，可以直接对props进行修改，而且调用changemapping页面会重新更新，深拷贝做不到这样
        let widgets = [...this.props.widgets];
        
        // for(let i = 0; i<widgets.length;i++){
        //     widgets[i].spec.style.colorset = currentColorset;
        // }
        let chartMode = this.props.chartMode;
        let editMode = this.props.editMode;
        if(!chartMode){
            widgets[editMode].colorsetIndex = e.target.value;
            widgets[editMode].spec.style.colorset = colorsets[e.target.value];
        }
        // widgets.forEach((item,index)=>{
        //     // console.log('item',item);
        //     // console.log('index',index)
        //     item.spec.style.colorset = colorsets[e.target.value];
        //     item.legendChangedColor = []
        // })
        this.props.changeMapping(widgets)
        this.props.changeColorset(this.props.colorsetType, e.target.value)


       

        this.props.changeCurrentColorset(colorsets[e.target.value]);
        //    let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': colorsets[e.target.value]}
        //    let data = []
       
        //    HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
        //        .then(re=>{
        //            data = re.data
        //            console.log('dataColor',data)
                   
                       
        //        })
        //        .catch(error=>{
        //            console.log(error.message);
        //        })
        //        //异步 保证canvas拿到新色盘
        //        .then(res=>{
        //            this.props.changeGlobalColorpair(data)
        //        });  
           this.setState({
                colorsetIndex: e.target.value,
                currentColorset: colorsets[e.target.value],
            });
        // }

    }

    //色盘分数排序
    handleTableChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
          sortedInfo: sorter,
        });
      };
       
    

    render() {

        const colorStyle = this.props.colorsetType ==1 ? this.state.colorStyle_discrete: (this.props.colorsetType == 2?this.state.colorStyle_squencial:this.state.colorStyle_diverging);
        const displayStylePicker = this.props.colorsetType == 1? this.state.displayStylePicker_discrete: (this.props.colorsetType == 2? this.state.displayStylePicker_squencial:this.state.displayStylePicker_diverging);
        
        
        const industryIndex = this.state.industryIndex;
        const colorsets = colorStyle[industryIndex].colorset;
      
        const currentColorset = this.state.currentColorset;
        // const presetColorsAdd = this.state.presetColorsAdd;
        const presetColorsReplace = this.state.presetColorsReplace;
        const grades = colorStyle[industryIndex].grade;
        const sortedInfo = this.state.sortedInfo ;
    

        let suggestion1 = currentColorset;
        // for(let i=0; i < presetColorsReplace.length; i++){
        //     let rgb = '';
        //     rgb = 'rgb(' + presetColorsReplace[i][0] + ','+ presetColorsReplace[i][1] + ','+presetColorsReplace[i][2] +')';       
        //     suggestion1.push(rgb);       
            
        // }
        // console.log('成功',suggestion1);

        // let suggestion2 = []
        // for(let i=0; i < presetColorsAdd.length; i++){
        //     let rgb = '';
        //     rgb = 'rgb(' + presetColorsAdd[i][0] + ','+ presetColorsAdd[i][1] + ','+presetColorsAdd[i][2] +')';       
        //     suggestion2.push(rgb);       
            
        // }
        // console.log('成功',suggestion2);


        //色盘单选框style
        const radioStyle = {
            display: 'block',
            height: '30px',
            width: '280px',
            lineHeight: '35px',
            marginBottom: '10px',
            // padding: "0 5px"
            // color: 'rgb(89,89,89)',
            // border: '1px solid #ddd'
          };

        //更新globalColorStyle
        // this.props.updateGlobalColorStyle({"colorset": currentColorset, "backgroundColor": this.props.currentScene.backgroundColor()});

   

        return (
            
            <div style={{padding: '0px 10px 0px 10px', fontSize: '14px',height:this.props.contentHeight-80+'px',overflow: 'auto'}}>

            <Layout style={{backgroundColor: '#fff', height: '180px'}}>
                <Sider style={{backgroundColor: '#fff', height: '180px', overflow: 'hidden'}}>
                    <Row></Row>
                    <Row></Row>
                <Radio.Group value={this.props.colorsetType} onChange={this.onChangeColorsetMode}>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={5}>
                            <Radio value={1} style={{marginLeft: '-10px', marginRight: '15px'}}>Discrete Color
                            </Radio>
                        </Col>

                    </Row>
                    <Row></Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={5}>
                            <Radio value={2} style={{marginLeft: '-10px', marginRight: '15px'}}>Squencial Color
                            </Radio>
                        </Col>
                    </Row>
                    <Row></Row>
                    <Row>
                    <Col span={3}></Col>
                        <Col span={5}>
                            <Radio value={3} style={{marginLeft: '-10px', marginRight: '15px'}}>Diverging Color
                            </Radio>
                        </Col>
                    </Row>
                    
                        
                    </Radio.Group>
                    <Row></Row>
                <Row>
                    <Col span={2}></Col>
                    <Radio.Group value={this.state.value} onChange={this.onChangeBackgroundMode}>
                        <Radio value={1} style={{marginLeft: '-10px', marginRight: '15px'}}>
                            <BulbOutlined />
                            <Button size='small' onClick={ this.handleColorClick1.bind(this) } style={{width: '20px',height:'20px', margin: '0px 5px 0px 5px',background: this.state.BGcolor1,border:"#ffffff"}}></Button> 
                            {this.state.displayColorPicker1 ? 
                            <div style={ popover }>
                                {/* handleColorClose再次点击，关闭colorpicker */}
                                <div style={ cover } onClick={ this.handleColorClose1.bind(this) } />
                                    {/* canvas backgroundColor赋予sketcher Color,  并且让sketcher Color掌握handleColorChange方法，从而改变canvas background Color*/}
                                    <SketchPicker color={this.state.BGcolor1}  presetColors = {[ '#ECECEC', '#F6F7FF', '#FFF7F6', '#FFFFF6', '#F7FFF6', '#F6FBFF', '#F6F7FF', '#FFF6FF']}style={{'left':'20px','top':'15px'}}onChange={this.handleColorChange1.bind(this)}  />
                            </div>
                            :null }
                        </Radio>
                        <Radio value={2}>
                            <BulbFilled />
                            <Button size='small' onClick={ this.handleColorClick2.bind(this) } style={{width: '20px',height:'20px',margin: '0px 5px 0px 5px',background: this.state.BGcolor2,border:"#ffffff"}}></Button> 
                       
                          {console.log('this.state.displayColorPicker2  ',this.state.displayColorPicker2 ) }
                            {this.state.displayColorPicker2 ? 
                            <div style={ popover }>
                                {/* handleColorClose再次点击，关闭colorpicker */}
                                <div style={ cover } onClick={ this.handleColorClose2.bind(this) } />
                                    {/* canvas backgroundColor赋予sketcher Color,  并且让sketcher Color掌握handleColorChange方法，从而改变canvas background Color*/}
                                    <SketchPicker color={this.state.BGcolor2} presetColors = {['#423457', '#0E022A', '#20787C', '#0B0F28', '#4D305E', '#524741', '#476E2D', '#2B363A', '#3F728F']}  style={{marginLeft: '200px'}}onChange={this.handleColorChange2.bind(this)}  />
                            </div>
                            :null }
                        </Radio>
                    </Radio.Group>
                </Row>
                </Sider>
            
                <Content style={{backgroundColor: '#fff', height: '180px', marginLeft: '-10px', overflowY: "auto"}}>
                
                {/* radio模式 */}
                <Radio.Group value={this.props.colorsetIndex} size="small" style={{ marginTop: 16, marginLeft: '10px' }}>
                    {/* 双层嵌套列表，读入colorsets */}
                    
                    {

                        colorsets.map((item, index) =>{
                            
                            return (
                                <Radio.Button value={index} style={{display: 'block',width: '280px',lineHeight: '35px',marginBottom: '10px',height:(item.length>11||this.props.colorsetType==2||this.props.colorsetType==3)? '65px':'30px'}} onChange = {this.handleChartOk}>
                                    {this.props.colorsetType==2?
                                                        <div style={{width:'260px',height:'25px',marginTop:'8px',background:'-webkit-gradient(linear, 0% 0%, 100% 0%,from('+item[0]+'), to('+item[item.length-1]+'))'}}></div>
                                                        :
                                                        (this.props.colorsetType == 3?
                                                            <div style={{width:'260px',height:'25px',marginTop:'8px',background:'linear-gradient(90deg, '+item[0] +'20%, '+item[parseInt(item.length/2)]+' 50%, '+item[item.length-1]+' 80%)'}}></div>
                                                            :null)

                                                    }
                                    <Row justify="space-around" align="middle" style={{marginBottom:'8px'}}>
                                    {
                                        item.map((item2, index2) =>{
                                            console.log('item2',item2,index)
                                            var pickerMarginTop;
                                            if(index>=10){
                                                pickerMarginTop = -250+(index-5)*(-60);
                                                pickerMarginTop += 'px'
                                            }else if(index>=6){
                                                pickerMarginTop = '-450px'
                                            }else if(index>=4){
                                                pickerMarginTop = '-420px'
                                            }else{
                                                pickerMarginTop = '-280px'
                                            }
                                            return (
                                                <Col span={2} style={{marginRight: this.props.colorsetType==1?'2px':((this.props.colorsetType==2&&index2==0)?'217px':(this.props.colorsetType==3&&(index2==0||index2==1))?'97px':'2px')}}> 
                                                    
                                                    {/* <CloseCircleFilled onClick={this.handleStyleDelete.bind(this, index, index2)}/> */}
                                                    <Button size='small' className='colorBtn' onClick={ this.handleStyleClick.bind(this, index, index2)} style={{width: '90%', height: '20px', background: item2, border:"#ffffff"}}></Button>
                                                    
                                                     {displayStylePicker[index][index2] ? <div style={ popover } style={{marginTop:pickerMarginTop}}>
                                                    <div style={ cover } onClick={ this.handleStyleClose.bind(this, index, index2) } />
                                                    <SketchPicker color={colorsets[index][index2]}  presetColors = {suggestion1}  onChange={this.handleStyleChange.bind(this, index, index2)} />
                                                    </div>:null }
                                                </Col>
                                            );
                                        })
                                    }
                                    </Row>
                                </Radio.Button>
                            );
                        })
                    } 

                    
                </Radio.Group>
        
               
                </Content>
                </Layout>
            </div>
        )
    }
}