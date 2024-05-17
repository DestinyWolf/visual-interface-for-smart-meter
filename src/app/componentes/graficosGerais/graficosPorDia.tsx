"use client"
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import Chart from "react-apexcharts";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";


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
    date:string,
}

var date = ''
var hasValueInData:boolean = false;

export function DataSelector() {
    // Estado para armazenar a data selecionada
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>('');

    // Manipulador de evento para a mudança na seleção da data
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        var dataArray:string[] = (event.target.value.split("-")) ?? '';
        // Aqui você pode fazer o que quiser com a data selecionada, como enviar para a API, etc.
        date = `${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`;
        hasValueInData = true;
    };

    return (
        <div className="flex items-center justify-center mb-2">
        <label htmlFor="datePicker" className="text-white font-semibold text-xl mr-2">Selecione uma data:</label>
        <input
            type="date"
            id="datePicker"
            name="datePicker"
            value={selectedDate}
            onChange={handleDateChange}
            className=" py-1 text-center rounded-lg"
        />
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg ml-2" onClick={() => {router.refresh();}}>
                <FaSearch/>
            </button>
        </div>
        </div>
    );
}


/**
 * APARTIR DAQUI INICIA OS COMPONENTES DE GRAFICOS
 */
/**
 * Graph component for interface, show currrent data for all power save
 * @param props props for Graph component
 * @returns React Component
 */
export async function GraficoEnergiaGerada() {

    
    //save data  after push API
    const [dados, setDados] = useState(array); 
    

    //set graph type
    const [type, setTypeView] = useState("LineChart");
    
    //fetch in API 
    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray)
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status && hasValueInData){
        status=false
        buscaDados()
    } 
    if (dados.length == 0 && hasValueInData) {
        buscaDados()
    }

    //armazena a ultima hora que ouve atualização
    var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;

    //armazena a ultima data que ouve atualização
    //var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;

    //var to save currrent position on array data
    let indexToArrData = 0;

    //array for data graph
    var data = []

    //if has last hour update
    if (lastHourUpdate) {
        let sumValues = 0;

        //set last hour to null and read de data label
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
            //if the date is the last day, insert this camp in Data array
            
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

export async function GraficoTensao() {

    //armazena os dados vindo da API
    const [dados, setDados] = useState(array); 

    //setta o tipo de visualização dos graficos
    const [type, setTypeView] = useState("LineChart");
    //faz o fetch na api
    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
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
    //var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
    let indexToArrData = 0;

    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
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

    const options:ApexOptions = {
        chart: {
            id: "area"
        },
        xaxis:{
            type: "datetime",
            title:{
                text:"Horas"
            }
        },
        dataLabels:{
            enabled:false
        },
        yaxis:{
            title:{
                text:"Tensão"
            }
        }
    }

    const series:ApexAxisChartSeries = [
        {
            name: 'V',
            data: data
        }
    ]
    
    //exibe o grafico na tela
    return (
        <div className="">
                <div className="items-center justify-center text-center font-semibold text-lg border-t-4 border-black mt-2">Grafico Tensão</div>
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

export function GraficoCorrente() {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("area");
    

    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
            .then(res => { return res.json()})
            .then(data => {
                const dataArray: DataObject[] = Object.values(data);
                setDados(dataArray);
            })
        } catch(err) {
            console.log(err)
            }
        }
        
    if(status && hasValueInData){
        status=false
        hasValueInData = false
        buscaDados()
    }
    if (dados.length == 0 && hasValueInData) {
        hasValueInData = false
        buscaDados()
    }
    if (hasValueInData){
        hasValueInData = false
        buscaDados();
    }

        var lastHourUpdate = dados[dados.length-1]?.hora ? dados[dados.length-1]?.hora : null;
        //var lastDayUpdate = dados[dados.length-1]?.data ? dados[dados.length-1]?.data : null;
        let indexToArrData:any = 0;

        const data = []
        if (lastHourUpdate) {
            let lastHour = null;

            for(let i = 0; i<dados.length; i++) {
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
                    text:"Corrente"
                }
            },
            
        }
    
        const series:ApexAxisChartSeries = [
            {
                name: 'A',
                data: data
            }
        ]
    
        //exibe o grafico na tela
        return (
            <div className="-z-10">
                <div className="-z-10">
                    <div className="bg-white">
                    <div className="items-center justify-center text-center font-semibold text-lg">Grafico Corrente</div>
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

export async function GraficoTemperaturaPlaca() {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
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
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
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
                    if(dados[i]?.hora != lastHour){
                        lastHour = dados[i]?.hora;
                    }
                    let date = new Date(
                        parseInt(dados[i]?.ano),
                        parseInt(dados[i]?.mes)-1,
                        parseInt(dados[i]?.dia),
                        parseInt(dados[i]?.hora)-3,
                        parseInt(dados[i]?.tempo.slice(3,5))).getTime()
                    data[indexToArrData] = [date, parseFloat(dados[i]?.tempB)]
                    indexToArrData++;
                }
        }
    } 

    const options:ApexOptions = {
        chart: {
            id: "basic-bar",
        },
        xaxis:{
            type: "datetime",
            title:{
                text:"Horas"
            }
        },
        dataLabels:{
            enabled:false
        },
        yaxis:{
            title:{
                text:"Temperatura"
            }
        }, 
    }

    const series:ApexAxisChartSeries = [
        {
            name: '°C',
            data: data
        }
    ]

    //exibe o grafico na tela
    return (
        <div className="">
                <div className="bg-white">
                <div className="items-center justify-center text-center font-semibold text-lg border-t-4 border-black">Temperatura da Placa</div>
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

export async function GraficoTemperaturaAmbiente() {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
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
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "°C"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
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
                    if(dados[i]?.hora != lastHour){
                        lastHour = dados[i]?.hora;
                    }
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

        const options:ApexOptions = {
            chart: {
                id: "basic-bar"
            },
            xaxis:{
                type: "datetime",
                title:{
                    text:"Horas"
                }
            },
            dataLabels:{
                enabled:false
            },
            yaxis:{
                title:{
                    text:"Temperatura"
                }
            }
        }
    
        const series:ApexAxisChartSeries = [
            {
                name: '°C',
                data: data
            }
        ]
    
        //exibe o grafico na tela
        return (
            <div className="">
                    <div className="bg-white">
                    <div className="items-center justify-center text-center font-semibold text-lg">Temperatura do Ambiente</div>
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

export async function GraficoPotencia() {

    
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("LineChart");

    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
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
    let indexToArrData = 0;


    const title = [{type:"date", label:"Hour"}, "W"];
    const data = []
    

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
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
                if(dados[i]?.hora != lastHour){
                    lastHour = dados[i]?.hora;
                }
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

        const options:ApexOptions = {
            chart: {
                id: "basic-bar"
            },
            xaxis:{
                type: "datetime",
                title:{
                    text: "Horas"
                }
            },
            dataLabels:{
                enabled:false
            },
            yaxis:{
                title:{
                    text:"KiloWats"
                }
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
                    <div className="bg-white">
                    <div className="items-center justify-center text-center font-semibold text-lg">Grafico Potencia</div>
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


export async function GraficoTensaoXCorrente() {
    const [dados, setDados] = useState(array); 
    const [type, setTypeView] = useState("juntos");
    

    async function buscaDados() {
    
        try{
            fetch(`http://127.0.0.1:5000/data/day?data=${date}`)
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
    let indexToArrData:any = 0;

    const data1 = []
    const data2 = []

    if (lastHourUpdate) {
        let lastHour = null;

        for(let i = 0; i<dados.length; i++) {
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
                    if(dados[i]?.hora != lastHour){
                        lastHour = dados[i]?.hora;
                    }
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

    const options:ApexOptions = {
        chart: {
            id: "basic-bar"
        },
        xaxis:{
            type: "datetime",
            title:{
                text: "Horas",
                
            },
            axisBorder:{
                show:true,
                color: "#00FFFF"
            },
            axisTicks: {
                show:true
            }
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
                <div className="items-center justify-center text-center">
                <button 
                className="rounded-full bg-white m-2 p-3 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("juntos")}
                >
                    JUNTOS
                </button>

                <button 
                className="rounded-full bg-white m-2 p-3 font-semibold hover:bg-slate-400 hover:border-blue-500 focus:bg-emerald-800 transition"
                onClick={() => setTypeView("separados")}
                >
                    SEPARADOS
                </button>

                </div>
                
                <div className="bg-white">
                
                    {(type == "juntos") && (
                        <>
                        <div className="items-center justify-center text-center font-semibold text-lg">Tensão x Corrente</div>
                        <Chart
                        type="area"
                        options={options}
                        series={series}
                        width="100%"
                        height="400px"
        
                        />
                        </>
                        
                    )}
                    {(type == "separados") && (
                        <>
                            <GraficoCorrente/>
                            <GraficoTensao/>
                        </>
                    )}
                
                </div>
                
            </div>
        </div>
            
        
    )
}