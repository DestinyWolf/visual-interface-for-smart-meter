export async function fetchFromApi(url:string)  {
    return  fetch(url)
            .then(res => { return res.json()})
            .then(data => {return data})
}

let previousData: any = null;
let status:boolean = true;

interface Data{
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

//realiza a chamada do metodo de verificao a cada um minuto
setInterval(checkForUpdateAndFetchData, 60000);

export async function returnDataFromAPI(url:string, hasRefrash:boolean){
    if (status || hasRefrash) {
        try{
            const data:Data = await fetchFromApi(url);
            return Object.values(data);
        }  catch (err) {
            console.log(err);
        }
    }
}