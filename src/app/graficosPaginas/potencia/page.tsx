import { Suspense} from "react";
import {GraficoPotencia} from "../../componentes/graficosGerais/graficosEmTempoReal";
import {DadosUltimaMedicao} from "../../componentes/tabbar";



export default function Home() {
  
  
    return (
      <main className="flex-col min-h-screen p-24">
        <div className=" flex-col border-2 border-black  justify-center items-center">
          <DadosUltimaMedicao/>
          <Suspense fallback="carregando...">
            <GraficoPotencia/>
          </Suspense>
        </div>
        
        
      </main>
    );
}