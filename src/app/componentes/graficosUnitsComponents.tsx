"use client"

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";


export function GraficoSeparadoArea({unit, dataGraph, type, name, legend}:{unit:string, dataGraph:number[][], type:string, name:string, legend:string}){

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime",
            title:{
                text:"Horas"
            }, 
        },
        noData: {
            text: "Carregando...",
                        align: "center",
                        verticalAlign: "middle",
        },
        legend:{
            show: true,
            position: "bottom"
        },
        dataLabels:{
            enabled: (type == "area") ? false:true
        },
        yaxis:{
            title:{
                text: legend
            }
        },
        
    }

    const series:ApexAxisChartSeries = [
        {
            name: unit,
            data: dataGraph
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="-z-10">
            <div className="-z-10">
                <div className="bg-white">
                <div className="items-center justify-center text-center font-semibold text-lg">{`${name}`}</div>
                <Chart
                    type={(type) == "area" ? "area":"bar"}
                    options={options}
                    series={series}
                    width="100%"
                    height="400px"
    
                />
                </div>
                
            </div>
        </div>
            
        
    )
}
