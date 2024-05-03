'use client'
import {Chart} from "react-google-charts";
import { useState } from "react"; 
import {returnDataFromAPI} from "../../service/fetchFromAPI";

interface Data{
    _id:string;
    dia:string;
    mes:string;
    ano:string;
    tempo:string;
    data:string;
    hora:string;
    tempA:string;
    tempB:string;
    tensao:string;
    corrente:string;
    potencia:string;
    energia:string
}

interface GraficoProps{
    hasRefresh?:boolean,
    ano:string,
}

const array:Data[] = []

export async function GraficoTensao(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((props.hasRefresh) ? props.hasRefresh : false))))
    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                data[indexToArrData] = [
                    new Date(
                        parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                        parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                        )
                    ,   parseFloat((dados[i]?.tensao) ? dados[i].tensao:"0.0")]
                indexToArrData += 1;
            }
        }
    }

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}

export async function GraficoTemperaturaPlaca(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((props.hasRefresh) ? props.hasRefresh : false))))

    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                    data[indexToArrData] = [
                        new Date(
                            parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                            parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                            parseInt((dados[i]?.dia) ? dados[i].dia:"00"),
                            parseInt((dados[i]?.hora) ? dados[i].hora:"00"),
                            )
                        , parseFloat((dados[i]?.tempB) ? dados[i].tempB:"0.0")
                    ]
                indexToArrData += 1;
            }
        }
    }
    

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}

export async function GraficoTemperaturaAmbiente(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((props.hasRefresh) ? props.hasRefresh : false))))

    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    
    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                data[indexToArrData] = [
                    new Date(
                        parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                        parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                        parseInt((dados[i]?.dia) ? dados[i].dia:"00"),
                        parseInt((dados[i]?.hora) ? dados[i].hora:"00"),
                        )
                    , parseFloat((dados[i]?.tempA) ? dados[i].tempA:"0.0")
                ]
                indexToArrData += 1;
            }
        }
    }

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}

export async function GraficoPotencia(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((prosp.hasRefresh) ? props.hasRefresh : false))))

    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                data[indexToArrData] = [
                    new Date(
                        parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                        parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                        parseInt((dados[i]?.dia) ? dados[i].dia:"00"),
                        parseInt((dados[i]?.hora) ? dados[i].hora:"00"),
                        )
                    , parseFloat((dados[i]?.potencia) ? dados[i].potencia:"0.0")
                ]
                indexToArrData += 1;
            }
            
        }
    }

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}


export async function GraficoEnergiaGerada(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((props.hasRefresh) ? props.hasRefresh : false))))

    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                data[indexToArrData] = [
                    new Date(
                        parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                        parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                        parseInt((dados[i]?.dia) ? dados[i].dia:"00"),
                        parseInt((dados[i]?.hora) ? dados[i].hora:"00"),
                        )
                    , parseFloat((dados[i]?.energia) ? dados[i].energia:"0.0")
                ]
                indexToArrData += 1;
        }
    }
    }

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}

export async function GraficoCorrente(props:GraficoProps) {
    const [dados, setDados] = useState(array);

    let urlData = `http://127.0.0.1:5000/data/annual?annual=${props.ano}`;

    setDados((await returnDataFromAPI(urlData, ((hasRefresh) ? hasRefresh : false))))

    var lastAnnualyUpdate = dados[dados.length-1]?.ano ? dados[dados.length-1]?.ano : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastAnnualyUpdate) {
        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.ano == lastAnnualyUpdate ) {
                
                data[indexToArrData] = [
                    new Date(
                        parseInt((dados[i]?.ano) ? dados[i].ano:"0000"),
                        parseInt((dados[i]?.mes) ? dados[i].mes:"00"),
                        parseInt((dados[i]?.dia) ? dados[i].dia:"00"),
                        parseInt((dados[i]?.hora) ? dados[i].hora:"00"),
                        )
                    , parseFloat((dados[i]?.corrente) ? dados[i].corrente:"0.0")
                ]
                indexToArrData += 1;
            }
        }
    }

    return (
        <div className="-z-10">
            <Chart
                    chartType = "LineChart"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
        </div>
    );
}