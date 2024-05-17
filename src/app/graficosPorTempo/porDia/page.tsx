import {DataSelector} from "../../componentes/graficosGerais/graficosPorDia";
import {GraficoCorrente} from "../../componentes/graficosGerais/graficosPorDia";

export default function Home() {  

    return (
      <main className="flex-col min-h-screen p-24">
        <div className="items-center justify-center text-center">
          <DataSelector/>
        </div>
        
        <div className=" flex-col border-2 border-black  justify-center items-center">
            <GraficoCorrente/>
        </div>
      </main>
    );
}