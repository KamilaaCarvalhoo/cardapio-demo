import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const restaurante = {
  nome: "Burger House Premium",
  slogan: "O melhor burger artesanal da cidade",
  whatsapp: "62999999999",
  horario: "18:00 às 23:30",
  taxaEntrega: 6,
  entrega: "🚚 Entrega própria do restaurante"
};

const categorias = ["Burgers","Porções","Bebidas"];

const produtosIniciais = [
  {id:1,nome:"X-Bacon Premium",categoria:"Burgers",descricao:"Blend 180g, cheddar e bacon",preco:29.9,imgs:["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"]},
  {id:2,nome:"Smash Burguer",categoria:"Burgers",descricao:"Classic Burguer",preco:34.9,imgs:["https://images.unsplash.com/photo-1550317138-10000687a72b"]},
  {id:3,nome:"Burger BBQ",categoria:"Burgers",descricao:"Molho barbecue",preco:31.9,imgs:["https://images.unsplash.com/photo-1512152272829-e3139592d56f"]},

  {id:4,nome:"Batata Especial",categoria:"Porções",descricao:"Cheddar e bacon",preco:21.9,imgs:["https://images.unsplash.com/photo-1576107232684-1279f390859f"]},
  {id:5,nome:"Onion Rings",categoria:"Porções",descricao:"Crocantes",preco:18.9,imgs:["https://images.unsplash.com/photo-1639024471283-03518883512d"]},
  {id:6,nome:"Mini Burguers",categoria:"Porções",descricao:"Recheados",preco:19.9,imgs:["https://images.unsplash.com/photo-1606755962773-d324e0a13086"]},

  {id:7,nome:"Milkshake",categoria:"Bebidas",descricao:"Chocolate ou morango",preco:16.9,imgs:["https://images.unsplash.com/photo-1572490122747-3968b75cc699"]},
  {id:8,nome:"Suco de Laranja",categoria:"Bebidas",descricao:"Fruta",preco:7.9,imgs:["https://images.unsplash.com/photo-1600271886742-f049cd451bba"]},
  {id:9,nome:"Limonada",categoria:"Bebidas",descricao:"Natural",preco:9.9,imgs:["https://images.unsplash.com/photo-1621263764928-df1444c5e859"]},

  /* extras */
  {id:10,nome:"Burguer Duplo",categoria:"Burgers",descricao:"Dois Hamburgueres + coca-cola",preco:27.9,imgs:["https://images.unsplash.com/photo-1550547660-d9450f859349"]},
  {id:11,nome:"Frango Crocante",categoria:"Porções",descricao:"Empanado",preco:24.9,imgs:["https://images.unsplash.com/photo-1562967916-eb82221dfb92"]},
  {id:12,nome:"Coca Cola",categoria:"Bebidas",descricao:"Lata",preco:5.9,imgs:["https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?q=80&w=416&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]}
];

export default function App(){

  const [produtos]=useState(produtosIniciais);
  const [categoria,setCategoria]=useState("Burgers");
  const [carrinho,setCarrinho]=useState([]);
  const [openCart,setOpenCart]=useState(false);

  const adicionar=p=>{
    setCarrinho(c=>{
      const ex=c.find(i=>i.id===p.id);
      if(ex) return c.map(i=>i.id===p.id?{...i,qtd:i.qtd+1}:i);
      return [...c,{...p,qtd:1}];
    });
  };

  const remover=id=>setCarrinho(c=>c.filter(i=>i.id!==id));

  const subtotal=carrinho.reduce((a,b)=>a+b.preco*b.qtd,0);
  const total=subtotal + restaurante.taxaEntrega;

  const enviarWhatsApp=()=>{
    const nome=document.getElementById("nome").value;
    const endereco=document.getElementById("endereco").value;
    const pagamento=document.getElementById("pagamento").value;
    const entrega=document.getElementById("entrega").value;

    const pedido=carrinho.map(p=>`${p.nome} (${p.qtd})`).join("\n");

    const msg=`🍔 Pedido Cardápio Premium

Cliente: ${nome}
Entrega: ${entrega}
Endereço: ${endereco}

Pedido:
${pedido}

Pagamento: ${pagamento}
Subtotal: R$ ${subtotal.toFixed(2)}
Taxa: R$ ${restaurante.taxaEntrega}
Total: R$ ${total.toFixed(2)}

Horário: ${restaurante.horario}`;

    window.open(`https://wa.me/${restaurante.whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const filtrados=produtos.filter(p=>p.categoria===categoria);

  return(
    <div className="min-h-screen relative text-white">

      {/* FUNDO */}
      <div className="fixed inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
        className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/70"/>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full backdrop-blur-xl px-6 py-4 z-50">
        <h1 className="text-yellow-400 font-bold text-xl">
          🔥 {restaurante.nome}
        </h1>
      </nav>

      {/* HEADER PREMIUM */}
      <section className="pt-32 mb-14 px-6 text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 mb-10">
          Cardápio Burguer House
        </h1>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl grid md:grid-cols-3 gap-6">

          <div className="bg-black/40 rounded-2xl p-5">
            <p className="text-3xl">🕒</p>
            <p>{restaurante.horario}</p>
          </div>

          <div className="bg-black/40 rounded-2xl p-5">
            <p className="text-3xl">🚚</p>
            <p>{restaurante.entrega}</p>
          </div>

          <div className="bg-black/40 rounded-2xl p-5">
            <p className="text-3xl">💰</p>
            <p>Taxa R$ {restaurante.taxaEntrega}</p>
          </div>

        </div>

      </section>

      {/* CATEGORIAS */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {categorias.map(cat=>(
          <button key={cat}
            onClick={()=>setCategoria(cat)}
            className={`px-6 py-2 rounded-full ${
              categoria===cat?"bg-yellow-500 text-black":"bg-white/10"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUTOS */}
      <div className="grid md:grid-cols-3 gap-6 px-8 mb-20">
        {filtrados.map(p=>(
          <div key={p.id} className="bg-white/10 p-4 rounded-xl">
            <img src={p.imgs[0]} className="rounded mb-3"/>
            <h3 className="font-bold">{p.nome}</h3>
            <p>{p.descricao}</p>
            <strong className="text-yellow-400">
              R$ {p.preco.toFixed(2)}
            </strong>

            <button
              onClick={()=>adicionar(p)}
              className="block mt-3 bg-yellow-500 px-4 py-2 rounded text-black">
              Adicionar
            </button>
          </div>
        ))}
      </div>

      {/* GALERIA */}
      <section className="px-8 mb-20 text-center">
        <h2 className="text-3xl text-yellow-400 mb-6">📸 Ambiente</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i=>(
            <img key={i}
              src="https://plus.unsplash.com/premium_photo-1670984939638-01d1854a5d12?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="rounded-xl"/>
          ))}
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="px-8 mb-20 text-center">
        <h2 className="text-3xl text-yellow-400 mb-6">⭐ Avaliações</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Ana","Carlos","Marcos"].map((n,i)=>(
            <div key={i} className="bg-white/10 p-6 rounded-xl">
              <strong>{n}</strong>
              ⭐⭐⭐⭐
              <p>Melhor cardápio digital!</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="px-8 mb-20 text-center">
        <h2 className="text-3xl text-yellow-400 mb-6">📍 Localização</h2>
        <iframe
          src="https://maps.google.com/maps?q=goiania&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-72 rounded-xl border-none"
        />
      </section>

      {/* BOTÃO CARRINHO */}
      <button
        onClick={()=>setOpenCart(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 px-6 py-3 rounded-full text-black">
        🛒 {carrinho.length}
      </button>

      {/* CARRINHO PROFISSIONAL */}
<AnimatePresence>
{openCart&&(
  <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4">

    <motion.div
      initial={{y:80}}
      animate={{y:0}}
      exit={{y:80}}
      className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">

      {/* TITULO */}
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Finalizar Pedido
      </h2>

      {/* CLIENTE */}
      <div className="space-y-3 mb-5">
        <input
          id="nome"
          placeholder="Seu nome"
          className="w-full p-3 rounded-xl text-black"
        />

        <input
          id="endereco"
          placeholder="Endereço completo"
          className="w-full p-3 rounded-xl text-black"
        />
      </div>

      {/* ENTREGA */}
      <div className="mb-5">
        <label className="text-sm text-gray-400">
          Tipo de entrega
        </label>

        <select
          id="entrega"
          className="w-full p-3 rounded-xl text-black mt-1">
          <option>🚚 Delivery</option>
          <option>🏪 Retirada</option>
        </select>
      </div>

      {/* PAGAMENTO */}
      <div className="mb-5">
        <label className="text-sm text-gray-400">
          Forma de pagamento
        </label>

        <select
          id="pagamento"
          className="w-full p-3 rounded-xl text-black mt-1">
          <option>Pix QR Code</option>
          <option>Cartão</option>
          <option>Dinheiro</option>
        </select>
      </div>

      {/* LISTA PRODUTOS */}
      <div className="border-t border-white/10 pt-4 mb-4">
        {carrinho.length===0 && (
          <p className="text-gray-400 text-center">
            Carrinho vazio
          </p>
        )}

        {carrinho.map(i=>(
          <div key={i.id}
            className="flex justify-between items-center mb-3">

            <div>
              <p className="font-bold">{i.nome}</p>
              <small className="text-gray-400">
                Qtd: {i.qtd}
              </small>
            </div>

            <button
              onClick={()=>remover(i.id)}
              className="text-red-400 text-lg">
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* RESUMO */}
      <div className="border-t border-white/10 pt-4 mb-6 text-sm space-y-2">
        <p className="flex justify-between">
          Subtotal:
          <span>R$ {subtotal.toFixed(2)}</span>
        </p>

        <p className="flex justify-between">
          Taxa entrega:
          <span>R$ {restaurante.taxaEntrega}</span>
        </p>

        <p className="flex justify-between text-lg font-bold text-yellow-400">
          Total:
          <span>R$ {total.toFixed(2)}</span>
        </p>
      </div>

      {/* BOTÕES */}
      <button
        onClick={enviarWhatsApp}
        className="bg-green-500 w-full py-3 rounded-xl font-bold mb-3 hover:brightness-110">
        Finalizar pelo WhatsApp
      </button>

      <button
        onClick={()=>setOpenCart(false)}
        className="bg-yellow-500 w-full py-3 rounded-xl text-black font-bold">
        Continuar Comprando
      </button>

    </motion.div>
  </motion.div>
)}
</AnimatePresence>
    </div>
  );
}
