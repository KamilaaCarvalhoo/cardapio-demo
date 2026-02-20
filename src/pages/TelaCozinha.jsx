import { useState, useEffect } from "react";

export default function TelaCozinha(){

  const [pedidos,setPedidos]=useState([]);
  const [ultimoId,setUltimoId]=useState(null);
  const [hora,setHora]=useState(new Date());

  /* ===== RELÓGIO GLOBAL ===== */
  useEffect(()=>{
    const timer=setInterval(()=>{
      setHora(new Date());
    },1000);
    return ()=>clearInterval(timer);
  },[]);

  /* ===== SOM PROFISSIONAL ===== */
  const tocarSom=()=>{
    const audio=new Audio(
      "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
    );
    audio.volume=1;
    audio.play();
  };

  /* ===== CARREGAR PEDIDOS ===== */
  const carregarPedidos=()=>{
    const dados=localStorage.getItem("pedidos_cozinha");

    if(dados){
      const lista=JSON.parse(dados).reverse();

      if(lista[0]?.id!==ultimoId){
        tocarSom();
        setUltimoId(lista[0]?.id);
      }

      setPedidos(lista);
    }
  };

  useEffect(()=>{
    carregarPedidos();
    const intervalo=setInterval(carregarPedidos,2000);
    return ()=>clearInterval(intervalo);
  },[ultimoId]);

  /* ===== STATUS ===== */
  const atualizarStatus=(id,status)=>{
    const atualizados=pedidos.map(p=>
      p.id===id?{...p,status}:p
    );

    localStorage.setItem(
      "pedidos_cozinha",
      JSON.stringify([...atualizados].reverse())
    );

    setPedidos(atualizados);
  };

  /* ===== CRONÔMETRO ===== */
  const tempoDecorrido=(data)=>{
    const diff=Math.floor((new Date()-new Date(data))/1000);
    const min=Math.floor(diff/60);
    const seg=diff%60;
    return `${min}m ${seg}s`;
  };

  /* ===== COR STATUS ===== */
  const corStatus=(status)=>{
    if(status==="preparando") return "bg-yellow-500";
    if(status==="pronto") return "bg-green-500";
    return "bg-red-600 animate-pulse";
  };

  /* ===== FULLSCREEN ===== */
  const ativarFullscreen=()=>{
    if(document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen();
    }
  };

  return(
    <div className="min-h-screen text-white relative">

      {/* FUNDO */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/90"/>
      </div>

      <div className="p-8">

        {/* TOPO */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-extrabold text-yellow-400">
            👨‍🍳 PAINEL COZINHA
          </h1>

          <div className="flex gap-6 items-center">
            <span className="text-2xl font-bold">
              {hora.toLocaleTimeString()}
            </span>

            <button
              onClick={ativarFullscreen}
              className="bg-yellow-500 px-4 py-2 rounded-xl text-black font-bold">
              📺 Tela Cheia
            </button>
          </div>

        </div>

        {pedidos.length===0 && (
          <div className="text-center text-gray-400 text-xl">
            Nenhum pedido no momento
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {pedidos.map(p=>(
            <div
              key={p.id}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-yellow-500/30 hover:scale-105 transition duration-300">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold text-yellow-400">
                  Pedido #{p.id}
                </h2>

                <span className={`px-4 py-1 rounded-full text-sm font-bold ${corStatus(p.status)}`}>
                  {p.status || "NOVO"}
                </span>

              </div>

              <div className="text-xl mb-4">
                🍔 <span className="font-bold">{p.nome}</span>
              </div>

              <div className="space-y-2 mb-4 text-lg">
                <p>📦 Quantidade: {p.qtd}</p>
                <p>💰 R$ {p.valor}</p>
                <p>💳 {p.pagamento}</p>
              </div>

              <div className="text-sm text-gray-400 mb-6">
                ⏱ Tempo: {tempoDecorrido(p.data)}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={()=>atualizarStatus(p.id,"preparando")}
                  className="bg-yellow-500 px-4 py-3 rounded-xl text-black font-bold w-full hover:brightness-110">
                  Preparando
                </button>

                <button
                  onClick={()=>atualizarStatus(p.id,"pronto")}
                  className="bg-green-500 px-4 py-3 rounded-xl font-bold w-full hover:brightness-110">
                  Pronto
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
