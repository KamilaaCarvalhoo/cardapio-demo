import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export default function Caixa(){

  const [caixaAberto,setCaixaAberto]=useState(false);
  const [valorAbertura,setValorAbertura]=useState("");
  const [movimentacoes,setMovimentacoes]=useState([]);
  const [vendas,setVendas]=useState([]);
  const [valorManual,setValorManual]=useState("");
  const [pagamento,setPagamento]=useState("Dinheiro");

  /* ================= IMPRESSÃO COZINHA ================= */

  const imprimirCozinha = (valor, pagamento) => {
    const conteudo = `
      <html>
      <body style="font-family:monospace;padding:10px;width:280px">
        <h3>🍔 PEDIDO COZINHA
        Hamburguer Premium + Batata Rústica + Refrigerante</h3>
        <p>${new Date().toLocaleString()}</p>
        <hr/>
        <p><b>Venda:</b> R$ ${valor}</p>
        <p><b>Pagamento:</b> ${pagamento}</p>
        <hr/>
        <h4>Preparar Pedido</h4>
      </body>
      </html>
    `;

    const tela = window.open("", "", "width=300,height=600");
    tela.document.write(conteudo);
    tela.document.close();
    tela.print();
  };

  /* ================= ENVIAR PARA TELA COZINHA ================= */

  const enviarCozinha = (venda) => {
    const pedidos =
      JSON.parse(localStorage.getItem("pedidos_cozinha") || "[]");

    pedidos.push({
      ...venda,
      status:"novo"
    });

    localStorage.setItem(
      "pedidos_cozinha",
      JSON.stringify(pedidos)
    );
  };

  /* ================= CAIXA ================= */

  const abrirCaixa=()=>{
    const valor=parseFloat(valorAbertura);
    if(!valor) return alert("Informe o valor inicial");

    setCaixaAberto(true);
    setMovimentacoes([{tipo:"Abertura",valor,data:new Date()}]);
  };

  const registrarVenda=()=>{

    const valor=parseFloat(valorManual);
    if(!valor) return alert("Informe valor da venda");

    const venda={
      id:Date.now(),
      valor,
      pagamento,
      data:new Date()
    };

    setVendas(v=>[...v,venda]);

    setMovimentacoes(m=>[
      ...m,
      {tipo:"Venda",valor,data:new Date(),pagamento}
    ]);

    /* 🔥 ENVIA PRA COZINHA */
    enviarCozinha(venda);

    /* 🔥 IMPRESSÃO AUTOMÁTICA */
    imprimirCozinha(valor, pagamento);

    setValorManual("");
  };

  const sangria=(valor)=>{
    setMovimentacoes(m=>[
      ...m,
      {tipo:"Sangria",valor:-Math.abs(valor),data:new Date()}
    ]);
  };

  const reforco=(valor)=>{
    setMovimentacoes(m=>[
      ...m,
      {tipo:"Reforço",valor:parseFloat(valor),data:new Date()}
    ]);
  };

  const saldoAtual=movimentacoes.reduce((s,m)=>s+m.valor,0);

  const fecharCaixa=()=>{
    alert(`Resumo do Caixa:

Total vendas: ${vendas.length}
Saldo final: R$ ${saldoAtual.toFixed(2)}`);

    setCaixaAberto(false);
    setMovimentacoes([]);
    setVendas([]);
  };

  /* ================= RELATÓRIOS ================= */

  const totalPix=vendas.filter(v=>v.pagamento==="Pix")
    .reduce((s,v)=>s+v.valor,0);

  const totalCartao=vendas.filter(v=>v.pagamento==="Cartão")
    .reduce((s,v)=>s+v.valor,0);

  const totalDinheiro=vendas.filter(v=>v.pagamento==="Dinheiro")
    .reduce((s,v)=>s+v.valor,0);

  const dadosGrafico=vendas.map(v=>({
    data:new Date(v.data).toLocaleTimeString(),
    valor:v.valor
  }));

  /* ================= STORAGE ================= */

  useEffect(()=>{
    localStorage.setItem("caixa_mov",JSON.stringify(movimentacoes));
    localStorage.setItem("caixa_vendas",JSON.stringify(vendas));
  },[movimentacoes,vendas]);

  useEffect(()=>{
    const m=localStorage.getItem("caixa_mov");
    const v=localStorage.getItem("caixa_vendas");
    if(m) setMovimentacoes(JSON.parse(m));
    if(v) setVendas(JSON.parse(v));
  },[]);

  /* ================= UI ================= */

  return(
    <div className="min-h-screen text-white relative">

      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85"/>
      </div>

      <div className="px-4 md:px-12 py-10">

        <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-10">
          🧾 Sistema de Caixa
        </h1>

        {!caixaAberto ? (
          <div className="bg-white/10 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-yellow-400">
              Abrir Caixa
            </h2>

            <input
              placeholder="Valor inicial"
              value={valorAbertura}
              onChange={e=>setValorAbertura(e.target.value)}
              className="p-3 w-full mb-5 rounded-lg text-black"
            />

            <button
              onClick={abrirCaixa}
              className="bg-green-500 px-6 py-3 rounded-xl w-full font-bold">
              Abrir Caixa
            </button>
          </div>
        ):(

        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            <Card title="Saldo" value={`R$ ${saldoAtual.toFixed(2)}`} />
            <Card title="Pix" value={`R$ ${totalPix.toFixed(2)}`} />
            <Card title="Cartão" value={`R$ ${totalCartao.toFixed(2)}`} />
            <Card title="Dinheiro" value={`R$ ${totalDinheiro.toFixed(2)}`} />
          </div>

          <div className="bg-white/10 p-4 md:p-6 rounded-3xl mb-10">
            <h3 className="mb-4 text-yellow-400">Movimentação</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dadosGrafico}>
                <Tooltip />
                <Line dataKey="valor" stroke="#facc15" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* REGISTRAR VENDA */}
            <div className="bg-white/10 p-6 rounded-3xl shadow-xl">
              <h2 className="text-lg font-bold mb-6 text-yellow-400">
                Registrar Venda
              </h2>

              <input
                placeholder="Valor da venda"
                value={valorManual}
                onChange={e=>setValorManual(e.target.value)}
                className="p-3 w-full mb-4 rounded-lg text-black"
              />

              <select
                value={pagamento}
                onChange={e=>setPagamento(e.target.value)}
                className="p-3 w-full mb-4 rounded-lg text-black">
                <option>Dinheiro</option>
                <option>Cartão</option>
                <option>Pix</option>
              </select>

              <button
                onClick={registrarVenda}
                className="bg-yellow-500 px-6 py-3 rounded-xl w-full text-black font-bold">
                Registrar
              </button>
            </div>

            {/* MOVIMENTAÇÕES */}
            <div className="bg-white/10 p-6 rounded-3xl shadow-xl">
              <h2 className="text-lg font-bold mb-6 text-yellow-400">
                Movimentações
              </h2>

              <div className="max-h-60 overflow-y-auto text-sm space-y-2">
                {movimentacoes.map((m,i)=>(
                  <div key={i}
                    className="flex justify-between border-b border-gray-700 py-2">
                    <span>{m.tipo}</span>
                    <span className={m.valor<0?"text-red-400":"text-green-400"}>
                      R$ {m.valor}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={()=>sangria(50)}
                  className="bg-red-500 px-4 py-2 rounded-xl w-full">
                  Sangria
                </button>

                <button onClick={()=>reforco(100)}
                  className="bg-purple-500 px-4 py-2 rounded-xl w-full">
                  Reforço
                </button>
              </div>
            </div>

            {/* RESUMO */}
            <div className="bg-white/10 p-6 rounded-3xl shadow-xl">
              <h2 className="text-lg font-bold mb-6 text-yellow-400">
                Resumo
              </h2>

              <p>Total de Vendas: {vendas.length}</p>
              <p className="text-3xl font-bold mt-4">
                R$ {saldoAtual.toFixed(2)}
              </p>

              <button
                onClick={fecharCaixa}
                className="bg-black border border-yellow-500 text-yellow-400 px-6 py-3 rounded-xl w-full mt-6">
                Fechar Caixa
              </button>
            </div>

          </div>
        </>
        )}

      </div>
    </div>
  );
}

function Card({title,value}){
  return(
    <div className="bg-white/10 p-4 rounded-2xl shadow-xl">
      <p className="text-gray-300">{title}</p>
      <h2 className="text-xl font-bold text-yellow-400 mt-2">{value}</h2>
    </div>
  );
}
