import * as d3 from 'd3';
import { getStackedData, getSeries, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';
import './style.css';


const draw = (props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.vis-radarchart > *').remove();
        a = '.vis-radarchart';
    }

    // const data = props.data;
    const margin = {top: 10, right: 40, bottom: 20, left: 50};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    const chartWidth = width,
        chartHeight = height - 60;
    let svg = d3.select(a)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
            .attr("height", props.width-20)
            .attr("width", props.height-20)
            .attr("x", 10)
            .attr("y", 10)
            .attr("cx", 50)
            .attr("cy", 50)
            .attr("stroke","#eee")
            .attr("stroke-width",5)
            // .style("border","2px solid #4674b2")
            // .style('border-radius','4px')
            .attr("fill","white")
            .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");
    

    // Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y.field) ) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "steelblue"); 
        return svg;
    }
    let hasSeries = ('color' in encoding) && ('field' in encoding.color);
    
    
    // Process Data
    let data = props.data;
    let stackedData = [];
    let dataSeries = [];
    let series = [];
    if (hasSeries) {
        dataSeries = getSeries(data, encoding);
        stackedData = getStackedData(data, encoding);
        series = Object.keys(dataSeries);
    } else {
        data = getAggregatedRows(data, encoding);
    }

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

    console.log('dataProcessed222', dataProcessed)


    // Color channel
    const style = props.spec.style;
    let colorset = style.colorset;


    var cfg = {
        radius: 5,
        w: width,
        h: width,
        factor: 1,
        factorLegend: .6,
        levels: 4,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0, //0.5
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 100,
        ExtraWidthY: 100,
        // color: d3.scaleOrdinal(colorset)
    };
   

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(dataProcessed, function (i) {
        return d3.max(i.map(function (o) {
            return o.value;
        }))
    }));
    var allAxis = (dataProcessed[0].map(function (i, j) {
        return i.axis
    }));
    console.log('allAxis', allAxis.length)
    var total = allAxis.length;
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

    // let svg = d3.select('.vis-radarchart').append('svg')
    //     .attr('width',width + margin.left + margin.right)
    //     .attr('height',height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // let color = d3.scaleOrdinal(colorset);
    
    var tooltip;

    // const encoding = props.encoding;
    // const chartWidth = width,
    //     chartHeight = height - 40;//plus legend height

    let chart = svg.append("g").attr("class", "chart"),
    content = chart.append("g")
        .attr("class", "content")
        .attr("chartWidth", chartWidth)
        .attr("chartHeight", chartHeight)
        .attr("clip-path", "url(#clip-rect)"),
    legend = svg.append("g");

    //Circular segments
    for (var j = 0; j < cfg.levels - 1; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        content.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y1", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("x2", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
            })
            .attr("y2", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "0.3px")
            .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    var seriesNum = 0;

    var axis = content.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", function (d, i) {
            return cfg.w / 2 * (1 - cfg.factor*0.75 * Math.sin(i * cfg.radians / total));
        })
        .attr("y2", function (d, i) {
            return cfg.h / 2 * (1 - cfg.factor *0.75* Math.cos(i * cfg.radians / total));
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    // axis.append("text")
    //     .attr("class", "legend")
    //     .text(function (d) {
    //         return d
    //     })
    //     .style("font-family", "sans-serif")
    //     .style("font-size", "11px")
    //     .attr("text-anchor", "middle")
    //     .attr("dy", "1.5em")
    //     .attr("transform", function (d, i) {
    //         return "translate(0, -10)"
    //     })
    //     .attr("x", function (d, i) {
    //         return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
    //     })
    //     .attr("y", function (d, i) {
    //         return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
    //     });

    // var long = [];
    // var shapes = [];
    dataProcessed.forEach(function (y, x) {
        var dataValues = [];
        content.selectAll(".nodes")
            .data(y, function (j, i) {
                dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor*0.4 * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor *0.4* Math.cos(i * cfg.radians / total))
                ]);
            });
        dataValues.push(dataValues[0]);
        var polygon = content.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", "radar-chart-serie" + seriesNum)
            .style("stroke-width", "2px")
            .style("stroke", colorset[seriesNum])
            .attr("points", function (d) {
                var str = "";
                for (var pti = 0; pti < d.length; pti++) {
                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                }
                return str;
            })
            .style("fill", function (j, i) {
                console.log('series',seriesNum)
                console.log()
                return colorset[seriesNum]
            })
            .style("fill-opacity", cfg.opacityArea);

        seriesNum++;
        // var length = polygon._groups[0][0].getTotalLength();
        // long.push(length);
        // shapes.push(polygon._groups[0][0]);
    });
    
    seriesNum = 0;

    // var w_radar = new Array();
    // for (var i = 0; i < long.length; i++) {
    //     w_radar[i] = new Array();
    //     w_radar[i][shapes.length] = long[i];
    // }

    // for (var i = 0; i < long.length; i++) {
    //     for (var j = i + 1; j < shapes.length; j++) {
    //         var inter = Intersection.intersectPolygonPolygon(shapes[i].points, shapes[j].points);
    //         w_radar[i][j] = inter.points.length * 10
    //     }
    // }
    // console.log(w_radar)

    dataProcessed.forEach(function (y, x) {
        var dataValues = [];
        content.selectAll(".nodes")
            .data(y).enter()
            .append("svg:circle")
            .attr("class", "radar-chart-serie" + seriesNum)
            .attr('r', cfg.radius)
            .style("stroke-width", "0px")
            .attr("alt", function (j) {
                return Math.max(j.value, 0)
            })
            .attr("cx", function (j, i) {
                dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor *0.4* Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor*0.4 * Math.cos(i * cfg.radians / total))
                ]);
                return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor*0.4 * Math.sin(i * cfg.radians / total));
            })
            .attr("cy", function (j, i) {
                return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor *0.4* Math.cos(i * cfg.radians / total));
            })
            .attr("data-id", function (j) {
                return j.axis
            })
            .style("fill", colorset[seriesNum]).style("fill-opacity", .9)
            .append("svg:title")
            .text(function (j) {
                return Math.max(j.value, 0)
            });

        seriesNum++;
    });
    
    tooltip = content.append('text')
        .style('opacity', 0)
        .style('font-family', 'sans-serif')
        .style('font-size', '13px');

    // let svg = d3.select('.vis-radarchart').append('svg')
    //     .attr('width',width + margin.left + margin.right)
    //     .attr('height',height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Create the title for the legend
    // var text = g.append("text")
    //     .attr("class", "title")
    //     .attr('transform', 'translate(90,0)') 
    //     .attr("x", width - 70)
    //     .attr("y", 10)
    //     .attr("font-size", "12px")
    //     .attr("fill", "#404040")
    //     .text("What % of owners use a specific service in a week");
            
    //Initiate Legend	
    // var legend = g.append("g")
    //     .attr("class", "legend")
    //     .attr("height", 100)
    //     .attr("width", 200)
    //     .attr('transform', 'translate(90,20)') 
    //     ;
    //     //Create colour squares
    // legend.selectAll('rect')
    //     .data(LegendOptions)
    //     .enter()
    //     .append("rect")
    //     .attr("x", width - 65)
    //     .attr("y", function(d, i){ return i * 20;})
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .style("fill", function(d, i){ return cfg.color(i);})
    //     ;
    // //Create text next to squares
    // legend.selectAll('text')
    //     .data(LegendOptions)
    //     .enter()
    //     .append("text")
    //     .attr("x", width - 52)
    //     .attr("y", function(d, i){ return i * 20 + 9;})
    //     .attr("font-size", "11px")
    //     .attr("fill", "#737373")
    //     .text(function(d) { return d; })
    //     ;

    /** show legend **/
    // var colorSet = [];
    // for(let i=0; i<series.length; i++){
    //     colorSet.push(i);
    // }
    // var legends = legend.selectAll("legend_color")
    //     .data(colorSet)
    //     .enter().append("g")
    //     .attr("class", "legend_color")
    //     .attr('transform', (d, i) =>`translate(${10}, 0)`);//i * 80 + (chartWidth - 80 * colorSet.length)/2
    // // legends.append("circle")
    // //     .attr("fill", d => color(d))
    // //     .attr("r", 6)
    // //     .attr("cy", -5);
    // legends.append("rect")
    //     .attr("fill", d => colorset[d])
    //     .attr('x', -5)
    //     .attr('y', -10)
    //     .attr("width", '15px')
    //     .attr('height', '15px')
    //     .attr("rx", 1.5)
    //     .attr("ry", 1.5)
    
    //     let legend_nodes=legends.nodes();
    //     let before = legend_nodes[0];
    //     let current;
    //     let offset = 10;

    // for(let i = 1; i< legend_nodes.length; i++){
    // current = legend_nodes[i];
    // // if(d3.select(before).select("text").node().getComputedTextLength()){
    // //     offset += d3.select(before).select("text").node().getComputedTextLength();
    // // }else{
    // //     offset += getWidth(colorSet[i-1])
    // // } 
    // d3.select(current)
    //         .attr('transform', `translate(${i*30 + offset}, 0)`);
    // before = current;
    // }
    // if(legend.node().getBBox().width){
    // // legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2}, ${chartHeight + 60})`);
    // legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2 -10}, ${chartHeight + 55})`);
    // }else{
    // offset += getWidth(colorSet[colorSet.length-1]);
    // legend.attr("transform", `translate(${(chartWidth - offset - 30 * colorSet.length + 20)/2}, ${chartHeight + 60})`);
    // }	
	

    return svg;

}

export default draw;