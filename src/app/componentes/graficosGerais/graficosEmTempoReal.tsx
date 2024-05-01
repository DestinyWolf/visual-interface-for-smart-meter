'use client'
import {Chart} from "react-google-charts";
import { useState } from "react";

//formato que os dados sao guardados no banco de dados
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


const array:DataObject[] = []; //array global para armazenar as informações iniciais dos graficos
//realiza um fetch geral na api
export async function fetchFromApi() {
    return  fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {return data})
}

let previousData: any = null;
let status:boolean = true;

//verifica se houve alguma atualizacao na api
async function checkForUpdateAndFetchData() {
    const currentData = await fetchFromApi();

    // Verificar se é a primeira vez que os dados são verificados
    if (!previousData) {
        previousData = currentData;
        return;
    }

    // Comparar os dados atuais com os dados anteriores
    const isUpdated = JSON.stringify(currentData) !== JSON.stringify(previousData);

    if (isUpdated) {
        // Se os dados foram atualizados, fazer a solicitação à API
        await fetchFromApi();
        // Atualizar os dados anteriores
        previousData = currentData;

        status = true
    } else {
        console.log("Os dados não foram atualizados. Não é necessário fazer a solicitação à API.");
        status = false
    } 
}

//realiza a chamada do metodo de verificao a cada um minuto
setInterval(checkForUpdateAndFetchData, 60000);

export async function GraficoEnergiaGerada() {

    
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
        buscaDados();
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;

    const title = [{type:"date", label:`DIA: ${lastDayUpdate}`}, "Kw/h"];
    const data = []

    data[indexToArrData] = title;
    indexToArrData = 1;

    if (lastHourUpdate) {
        let sumValues = 0;
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    sumValues += parseFloat(dados[i]?.energia)
                } else {
                    if(dados[i]?.hora == lastHour){
                        sumValues += parseFloat(dados[i]?.energia)
                    } else {
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(lastHour),
                            
                        ), sumValues]
                        lastHour = dados[i]?.hora
                        indexToArrData += 1;
                        sumValues = parseFloat(dados[i]?.energia)
                    }
                }
                
            }
        }

        
    }

    
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
            <Chart
                chartType={(type) ? type:"LineChart"}
                data={data}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
        
    )
}

export async function GraficoTensao() {

    
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
    if (dados.length == 0){
        buscaDados()
    }


    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "Volts"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    data[indexToArrData] = [
                        new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            )
                        , parseFloat(dados[i]?.tensao)]
                    indexToArrData += 1;
                } else {
                    if(dados[i]?.hora == lastHour){
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ),parseFloat(dados[i]?.tensao)]
                        indexToArrData += 1;
                    } else {
                        lastHour = dados[i]?.hora;
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ), parseFloat(dados[i]?.tensao)]
                        indexToArrData += 1;
                    }
                }
                
            }
        }

        
    } 

    
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
            <Chart
                chartType={(type) ? type:"LineChart"}
                data={data}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
        
    )

}

export async function GraficoCorrente() {

    
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
        buscaDados();
    }

    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "Amper"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    data[indexToArrData] = [
                        new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            )
                        , parseFloat(dados[i]?.corrente)]
                    indexToArrData += 1;
                } else {
                    if(dados[i]?.hora == lastHour){
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ),parseFloat(dados[i]?.corrente)]
                        indexToArrData += 1;
                    } else {
                        lastHour = dados[i]?.hora;
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ), parseFloat(dados[i]?.corrente)]
                        indexToArrData += 1;
                    }
                }
                
            }
        }

        
    }   
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
                <Chart
                    chartType = {(type) ? type:"LineChart"}
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
            </div>
        </div>
            
        
    )

}

export async function GraficoTemperaturaPlaca() {

    
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
        buscaDados();
    }


    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    data[indexToArrData] = [
                        new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            )
                        , parseFloat(dados[i]?.tempB)]
                    indexToArrData += 1;
                } else {
                    if(dados[i]?.hora == lastHour){
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ),parseFloat(dados[i]?.tempB)]
                        indexToArrData += 1;
                    } else {
                        lastHour = dados[i]?.hora;
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ), parseFloat(dados[i]?.tempB)]
                        indexToArrData += 1;
                    }
                }
                
            }
        }

        
    } 

    
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
            <Chart
                chartType={(type) ? type:"LineChart"}
                data={data}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
        
    )

}

export async function GraficoTemperaturaAmbiente() {

    
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
        buscaDados();
    }


    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    data[indexToArrData] = [
                        new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            )
                        , parseFloat(dados[i]?.tempA)]
                    indexToArrData += 1;
                } else {
                    if(dados[i]?.hora == lastHour){
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ),parseFloat(dados[i]?.tempA)]
                        indexToArrData += 1;
                    } else {
                        lastHour = dados[i]?.hora;
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ), parseFloat(dados[i]?.tempA)]
                        indexToArrData += 1;
                    }
                }
                
            }
        }

        
    } 

    
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
            <Chart
                chartType={(type) ? type:"LineChart"}
                data={data}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
        
    )

}

export async function GraficoPotencia() {

    
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
        buscaDados();
    }


    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
    var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "W"];
    const data = []
    data[indexToArrData] = title;
    indexToArrData = 1;
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            if (dados[i]?.data == lastDayUpdate ) {
                if(!lastHour){
                    lastHour = dados[i]?.hora
                    data[indexToArrData] = [
                        new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            )
                        , parseFloat(dados[i]?.corrente)]
                    indexToArrData += 1;
                } else {
                    if(dados[i]?.hora == lastHour){
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ),parseFloat(dados[i]?.corrente)]
                        indexToArrData += 1;
                    } else {
                        lastHour = dados[i]?.hora;
                        data[indexToArrData] = [new Date(
                            parseInt(dados[i]?.ano),
                            parseInt(dados[i]?.mes),
                            parseInt(dados[i]?.dia),
                            parseInt(dados[i]?.hora),
                            parseInt(dados[i]?.tempo.slice(3,5)),
                            ), parseFloat(dados[i]?.corrente)]
                        indexToArrData += 1;
                    }
                }
                
            }
        }

        
    } 

    
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
            <Chart
                chartType={(type) ? type:"LineChart"}
                data={data}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
        
    )

}