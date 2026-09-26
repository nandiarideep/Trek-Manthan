import ReactECharts from "echarts-for-react";
// import { format } from "../utlis";
 
const Gauge = ({ baseLine, chartValue, INDICATOR_TYPE, BaseLineYear }) => {
 
  const textGraphic = {
    type: 'text',
    left: '38%',
    top: '0%',
    style: {
      text: ``,
      font: ' 10px Arial',
      fill: '#000',
      textAlign: 'middle',
      textBaseline: 'middle',
      backgroundColor: '#fff',
      padding: [4, 7],
      borderRadius: 25
    },
    z: 10,
  };
  const option = {
    graphic: textGraphic,
    series: [
      {
        type: "gauge",
        startAngle: 180,
        center: [
          "50%",
          "65%"
        ],
        radius: "130%",
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            // color: [
            //   [baseline / 100, "#d6e4dc"], // before baseline
            //   [value / 100, "#0f5132"],    // between baseline and current
            //   [1, "#000000"]               // over current
            // ]
            color: [
              //   [0.6, "#D68228"],
              [1, "#999"],
            ],
          }
        },
        pointer: {
          show: true,
          width: 3,
          itemStyle: {
            color: "#fff"
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: true,
          width: 20,
         itemStyle: {
          color: chartValue < 50
            ? {
                type: 'linear',
                x: 1, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#FACA15' },  
                  { offset: 1, color: '#ffffff' },  
                ]
              }
            : {
                type: 'linear',
                x: 1, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#498E71' },  
                  { offset: 1, color: '#ffffff' }  
                ]
              }
        }
        },
        detail: {
          show: true,
          valueAnimation: true,
          fontSize: 10,
          fontWeight: 300,
          color: "#fff",
        //   formatter: () => {
        //     const baselineValue = format(baseLine, {
        //       forcedecimals: 0,
        //       suffix: INDICATOR_TYPE == 'number' ? '' : '%'
        //     });
        //     return `Baseline: ${baselineValue} (${BaseLineYear})`;
        //   },
          offsetCenter: [0, "20%"]
        },
        data: [
          {
            value: chartValue
          }
        ],
        title: {
          show: false,
          offsetCenter: [0, "60%"],
          fontSize: 14,
          color: "#fff"
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

export default Gauge;