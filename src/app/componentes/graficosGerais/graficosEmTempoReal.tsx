'use client'
import { ApexOptions } from "apexcharts";
//import {Chart, GoogleChartWrapperChartType} from "react-google-charts";
import { useState } from "react";
import Chart from "react-apexcharts";


//link for push data from API 
const uri = "http://127.0.0.1:5000/data";

//data components and your types
interface DataObject{
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

async function fetchFromApi(url:string)  {
    return  fetch(url)
            .then(res => { return res.json()})
            .then(data => {return data})
}

//variaveis para a valicação de alterações no banco de dados
let previousData:any;
let status:boolean = false

async function checkForUpdateAndFetchData() {
    const currentData = await fetchFromApi("http://127.0.0.1:5000/data");

    // Verificar se é a primeira vez que os dados são verificados
    if (!previousData) {
        previousData = currentData;
        return;
    }

    // Comparar os dados atuais com os dados anteriores
    const isUpdated = JSON.stringify(currentData) !== JSON.stringify(previousData);

    if (isUpdated) {
        // Se os dados foram atualizados, fazer a solicitação à API
        await fetchFromApi("http://127.0.0.1:5000/data");
        // Atualizar os dados anteriores
        previousData = currentData;

        status = true
    } else {
        console.log("Os dados não foram atualizados. Não é necessário fazer a solicitação à API.");
        status = false
    } 
}

// Executar a função de verificação a cada 60 segundos
setInterval(checkForUpdateAndFetchData, 60000);

const array:DataObject[] = []; //array global para armazenar as informações iniciais dos graficos


//props of graphs
interface GraficoProps{
    hasRefresh?:boolean,
}



/**
 * APARTIR DAQUI INICIA OS COMPONENTES DE GRAFICOS
 */
/**
 * Graph component for interface, show currrent data for all power save
 * @param props props for Graph component
 * @returns React Component
 */
export async function GraficoEnergiaGerada(props:GraficoProps) {

    
    //save data  after push API
    const [dados, setDados] = useState(array); 
    

    //set graph type
    const [type, setTypeView] = useState("LineChart");
    
    //fetch in API 
    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    //armazena a ultima hora que ouve atualização
    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;

    //armazena a ultima data que ouve atualização
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;

    //var to save currrent position on array data
    let indexToArrData = 0;

    //label for graph
    const title = [{type:"date", label:`DIA: ${lastDayUpdate}`}, "Kw/h"];

    //array for data graph
    var data = []

    //if has last hour update
    if (lastHourUpdate) {
        let sumValues = 0;

        //set last hour to null and read de data label
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            //if the date is the last day, insert this camp in Data array
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    sumValues += parseFloat(dados[i]?.energia)
                } else {
                    if(dados[i]?.hora == lastHour){
                        sumValues += parseFloat(dados[i]?.energia)
                    } else {
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, sumValues]

                        //update last hour to new hour and repet the process
                        lastHour = dados[i]?.hora
                        indexToArrData++;
                        sumValues = parseFloat(dados[i]?.energia)
                    }
                }
                
            }
        }
    }

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Kwh',
            data: data
        }
    ]

    
    //exibe o grafico na tela
    return (
        <div className="">
            <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                    <Chart
                        type="area"
                        options={options}
                        series={series}
                        width="100%"
                        height="400px"
        
                    />
                </div>
        </div>
        
    )
}

export async function GraficoTensao(props:GraficoProps) {

    //armazena os dados vindo da API
    const [dados, setDados] = useState(array); 

    //setta o tipo de visualização dos graficos
    const [type, setTypeView] = useState("LineChart");
    //faz o fetch na api
    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;

    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.tensao)]
                    indexToArrData++;
                } else {
                    //verifica se houve uma troca de hora e atualiza o dado
                    if(dados[i]?.hora != lastHour){
                        lastHour = dados[i]?.hora;
                    }
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.tensao)]
                    indexToArrData++;
                    
                }
                
            }
        }
    } 

    const options:ApexOptions = {
        chart: {
            id: "area"
        },
        xaxis:{
            type: "datetime"
        },
        dataLabels:{
            enabled:false
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Volts',
            data: data
        }
    ]
    
    //exibe o grafico na tela
    return (
        <div className="">
            <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                <Chart
                    type="area"
                    options={options}
                    series={series}
                    width="100%"
                    height="400px"
    
                />
                </div>
        </div>
        
    )

}

export async function GraficoCorrente(props:GraficoProps) {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");
    

    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData:any = 0;


    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    ///data[indexToArrData] = title;
    //indexToArrData = 1;
    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                    indexToArrData ++;
                } else {
                    if(dados[i]?.hora == lastHour){
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                        indexToArrData ++;
                    } else {
                        lastHour = dados[i]?.hora;
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                        indexToArrData ++;
                    }
                }
                
            }
        }

        
    }   

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        },
        noData: {
            text: "Carregando...",
                        align: "center",
                        verticalAlign: "middle",
        },
        legend:{
            show: true
        },
        dataLabels:{
            enabled: false
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Amper',
            data: data
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="-z-10">
            <div className="-z-10">
                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                <Chart
                    type="area"
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

export async function GraficoTemperaturaPlaca(props:GraficoProps) {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }


    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.tempB)]
                    indexToArrData++;
                } else {
                    if(dados[i]?.hora == lastHour){
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.tempB)]
                        indexToArrData++;
                    } else {
                        lastHour = dados[i]?.hora;
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.tempB)]
                        indexToArrData++
                    }
                }
                
            }
        }

        
    } 

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        },
        dataLabels:{
            enabled:false
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Kwh',
            data: data
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="">
            <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                    <Chart
                        type="area"
                        options={options}
                        series={series}
                        width="100%"
                        height="400px"
        
                    />
                </div>
        </div>
        
    )

}

export async function GraficoTemperaturaAmbiente(props:GraficoProps) {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.tempA)]
                    indexToArrData++;
                } else {
                    if(dados[i]?.hora == lastHour){
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.tempA)]
                        indexToArrData++;
                    } else {
                        lastHour = dados[i]?.hora;
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.tempA)]
                        indexToArrData++;
                }
                
            }
        }
    }
        
    } 

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        },
        dataLabels:{
            enabled:false
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Kwh',
            data: data
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="">
            <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                    <Chart
                        type="area"
                        options={options}
                        series={series}
                        width="100%"
                        height="400px"
        
                    />
                </div>
        </div>
        
    )

}

export async function GraficoPotencia(props:GraficoProps) {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "W"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.potencia)]
                    indexToArrData++;
                } else {
                    if(dados[i]?.hora == lastHour){
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.potencia)]
                        indexToArrData++;
                    } else {
                        lastHour = dados[i]?.hora;
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                        data[indexToArrData] = [date, parseFloat(dados[i]?.potencia)]
                        indexToArrData++;
                    }
                }
                
            }
        }

        
    } 

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        },
        dataLabels:{
            enabled:false
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Kwh',
            data: data
        }
    ]
    //verifica se o grafico é de linhas ou barras
    //var typeChart:GoogleChartWrapperChartType = (type) ? type:"LineChart";

    
    //exibe o grafico na tela
    return (
        <div className="">
            <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                    <Chart
                        type="area"
                        options={options}
                        series={series}
                        width="100%"
                        height="400px"
        
                    />
                </div>
        </div>
        
    )

}


export async function GraficoTensaoXCorrente(props:GraficoProps) {
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");
    

    async function buscaDados() {
    
        try{
            fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status){
        status=false
        buscaDados()
    } 
    if (dados.length == 0) {
        buscaDados()
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData:any = 0;


    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data1 = []
    const data2 = []
    ///data[indexToArrData] = title;
    //indexToArrData = 1;
    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data1[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                    data2[indexToArrData] = [date, parseFloat(dados[i]?.tensao)]
                    indexToArrData ++;
                } else {
                    if(dados[i]?.hora == lastHour){
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                            data1[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                            data2[indexToArrData] = [date, parseFloat(dados[i]?.tensao)]
                        indexToArrData ++;
                    } else {
                        lastHour = dados[i]?.hora;
                        let date = new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes)-1,
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora)-3,
                            parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                            data1[indexToArrData] = [date, parseFloat(dados[i]?.corrente)]
                            data2[indexToArrData] = [date, parseFloat(dados[i]?.tensao)]
                        indexToArrData ++;
                    }
                }
                
            }
        }

        
    }   

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime"
        },
        yaxis: [
            {
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true,
                    color: "#FF1654"
                },
                labels: {
                    style: {
                        colors: "#FF1654"
                    }
                },
                title: {
                    text: "Voltagem",
                    style: {
                        color: "#FF1654"
                    }
                }
            },
            {
                opposite: true,
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true,
                    color: "#247BA0"
                },
                labels: {
                    style: {
                        colors: "#247BA0"
                    }
                },
                title: {
                    text: "Corrente",
                    style: {
                        color: "#247BA0"
                    }
                }
            }
            ],
            tooltip: {
                shared: false,
                intersect: true,
                x: {
                show: false
                }
            },
        noData: {
            text: "Carregando...",
                        align: "center",
                        verticalAlign: "middle",
        },
        legend:{
            show: true
        },
        dataLabels:{
            enabled: false
        },
        colors: ["#FF1654", "#247BA0"]
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'Volts',
            data: data2
        }, 
        {
            name: 'Amper',
            data: data1
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="-z-10">
            <div className="-z-10">
                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("LineChart")}
                >
                    grafico de linhas
                </button>

                <button 
                className="rounded-full bg-white m-2 p-2 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("Bar")}
                >
                    grafico de barras
                </button>
                <div className="bg-white">
                <Chart
                    type="area"
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