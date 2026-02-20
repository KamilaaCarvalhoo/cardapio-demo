import { useState, useEffect } from "react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from "recharts";

export default function Admin(){

  const [logado,setLogado]=useState(false);
  const [senha,setSenha]=useState("");
  const [vendas,setVendas]=useState([]);
  const [filtro,setFiltro]=useState("mes");

  /* ================= DADOS DEMO ================= */

  useEffect(()=>{
    const v=localStorage.getItem("caixa_vendas");

    if(v){
      setVendas(JSON.parse(v));
    } else {
      const fake=[
        {id:1, valor:120, pagamento:"Pix", data:new Date()},
        {id:2, valor:80, pagamento:"Cartão", data:new Date()},
        {id:3, valor:60, pagamento:"Dinheiro", data:new Date()}
      ];
      localStorage.setItem("caixa_vendas",JSON.stringify(fake));
      setVendas(fake);
    }
  },[]);

  const hoje=new Date();

  const vendasFiltradas=vendas.filter(v=>{
    const d=new Date(v.data);

    if(filtro==="hoje")
      return d.toDateString()===hoje.toDateString();

    if(filtro==="semana"){
      const semana=new Date();
      semana.setDate(hoje.getDate()-7);
      return d>=semana;
    }

    return true;
  });

  /* ================= MÉTRICAS ================= */

  const total=vendasFiltradas.reduce((s,v)=>s+v.valor,0);
  const pedidos=vendasFiltradas.length;
  const ticket=(total/pedidos || 0).toFixed(2);

  const ontemTotal=vendas
    .filter(v=>{
      const d=new Date(v.data);
      const ontem=new Date();
      ontem.setDate(hoje.getDate()-1);
      return d.toDateString()===ontem.toDateString();
    })
    .reduce((s,v)=>s+v.valor,0);

  const crescimento=((total-ontemTotal)/(ontemTotal||1)*100).toFixed(1);

  /* ================= PAGAMENTOS ================= */

  const pagamentos={};
  vendasFiltradas.forEach(v=>{
    pagamentos[v.pagamento]=(pagamentos[v.pagamento]||0)+v.valor;
  });

  const dadosPizza=Object.keys(pagamentos).map(k=>({
    name:k,
    value:pagamentos[k]
  }));

  const dadosGrafico=vendasFiltradas.map(v=>({
    data:new Date(v.data).toLocaleDateString(),
    valor:v.valor
  }));

  const cores=["#facc15","#4ade80","#60a5fa","#f87171"];

  /* ================= LOGIN ================= */

  if(!logado){
    return(
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md">
          <h2 className="text-3xl text-yellow-400 font-bold mb-6 text-center">
            Área Administrativa
          </h2>

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e=>setSenha(e.target.value)}
            className="w-full p-3 rounded text-black mb-5"
          />

          <button
            onClick={()=> senha==="admin123"
              ? setLogado(true)
              : alert("Senha incorreta")
            }
            className="bg-yellow-500 w-full py-3 rounded-xl text-black font-bold">
            Entrar
          </button>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return(
    <div className="min-h-screen flex text-white">

      {/* SIDEBAR */}
      <aside className="w-60 bg-black border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-yellow-400 mb-10">
          Painel Admin
        </h1>

        <nav className="space-y-4">
          <p className="cursor-pointer hover:text-yellow-400">Dashboard</p>
          <p className="cursor-pointer hover:text-yellow-400">Pedidos</p>
          <p className="cursor-pointer hover:text-yellow-400">Produtos</p>
          <p className="cursor-pointer hover:text-yellow-400">Relatórios</p>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-gray-900 to-black">

        <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-10">
          Dashboard
        </h1>

        {/* FILTRO */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["hoje","semana","mes"].map(f=>(
            <button
              key={f}
              onClick={()=>setFiltro(f)}
              className={`px-5 py-2 rounded-full font-bold ${
                filtro===f
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <Card titulo="Faturamento" valor={`R$ ${total.toFixed(2)}`} />

          <Card titulo="Pedidos" valor={pedidos} />

          <Card titulo="Ticket Médio" valor={`R$ ${ticket}`} />

          <Card
            titulo="Crescimento"
            valor={`${crescimento}%`}
            destaque={crescimento>0}
          />

        </div>

        {/* BOTÃO EXPORTAR */}
        <button
          onClick={()=>alert("Exportação demo")}
          className="bg-green-500 px-6 py-3 rounded-xl font-bold mb-10">
          Exportar Relatório
        </button>

        {/* GRÁFICOS */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white/10 p-6 rounded-3xl">
            <h3 className="text-yellow-400 mb-4">
              Faturamento
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                <XAxis dataKey="data" stroke="#aaa"/>
                <YAxis stroke="#aaa"/>
                <Tooltip/>
                <Line dataKey="valor" stroke="#facc15" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl">
            <h3 className="text-yellow-400 mb-4">
              Formas de Pagamento
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}>
                  {dadosPizza.map((_,i)=>(
                    <Cell key={i} fill={cores[i%cores.length]} />
                  ))}
                </Pie>
                <Tooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </main>
    </div>
  );
}

/* CARD */
function Card({titulo,valor,destaque}){
  return(
    <div className="bg-white/10 p-6 rounded-3xl shadow-xl">
      <p className="text-gray-300">{titulo}</p>
      <h2 className={`text-2xl font-bold mt-2 ${
        destaque ? "text-green-400" : "text-yellow-400"
      }`}>
        {valor}
      </h2>
    </div>
  );
}
