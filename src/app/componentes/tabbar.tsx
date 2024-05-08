"use client"
import { useState } from "react";

interface propsBar {
    fun: (button:number) => {}
}


interface DataObject{
    _id?:string;
    dia?:string;
    mes?:string;
    ano?:string;
    tempo?:string;
    data?:string;
    hora?:string;
    tempA?:string;
    tempB?:string;
    tensao?:string;
    corrente?:string;
    potencia?:string;
    energia:string
}

export async function fetchFromApi() {
    return  fetch("http://127.0.0.1:5000/data")
            .then(res => { return res.json()})
            .then(data => {return data})
}

let previousData: any = null;
let status:boolean = true;

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

export function DadosUltimaMedicao() {

    const array:DataObject[] = [];
    const [dados, setDados] = useState(array); 
    
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
    
    var energia = 0.0; 
    var data = dados[dados.length -1]?.data
    for (let i = 0; i < dados.length; i++){
        if(dados[i].data == data)
            energia += parseFloat(dados[i].energia);


    }
    

    return (
        <div className="flex-col justify-center items-center align-top text-center  mt-5">
            <h1 className="mb-3 text-white">ULTIMOS DADOS</h1>
            <div className="text-white font-semibold mt-auto mb-4">{`Dia ${dados[dados.length - 1]?.data}`}</div>
            <div className="flex mb-3 justify-center items-center">
                <div className="ml-2 mr-2 border-4 p-6 font-bold text-center border-emerald-700 bg-white rounded-xl">
                    {`Potência: ${(dados[dados.length-1]?.potencia) ? dados[dados.length-1]?.potencia:0} Kw`}
                </div>

                <div className="ml-2 mr-2 border-4 p-6 font-bold text-center border-orange-400 bg-white rounded-xl">
                    {`Temperatura Inversor: ${(dados[dados.length-1]?.tempB) ? dados[dados.length-1]?.tempB:0} °C`}
                </div>
                
                <div className="ml-2 mr-2 border-4 p-6 font-bold text-center border-cyan-900 bg-white rounded-xl">
                    {`Temperatura Ambiente: ${(dados[dados.length-1]?.tempA) ? dados[dados.length-1]?.tempA:0} °C`}
                </div>

                <div className="ml-2 mr-2 border-4 p-6 font-bold text-center border-cyan-400 bg-white rounded-xl">
                    {`Energia Gerada: ${energia.toFixed(2)} Kwh`}
                </div>
            </div>
            
            


        </div>
    );
}

export function EstatusFuncionamento() {

    return (
        <div className="flex justify-center items-center">
            <p className="text-white font-semibold">funcionando</p>
            <div className=" ml-3 border-2 border-black rounded-full w-6 h-6 bg-green-500 mr-1"></div>
        </div>
    );
}