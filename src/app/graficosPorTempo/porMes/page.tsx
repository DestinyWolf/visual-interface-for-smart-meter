import { GraficoCorrente } from "@/app/componentes/graficosGerais/graficosPorMes";
import { DataSelectorFinish, DataSelectorStart } from "@/app/componentes/graficosGerais/graficosPorMes";


export default function home() {

    return (
        <main className="flex-col min-h-screen p-24 border-2 border-black">
          <div className=" flex items-center justify-center text-center  ">
            <DataSelectorStart/>
            <DataSelectorFinish/>
          </div>
          
          <div className=" flex-col border-2 border-black  justify-center items-center">
              <GraficoCorrente/>
          </div>
        </main>
      );
}
