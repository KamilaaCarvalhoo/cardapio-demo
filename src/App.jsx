import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= DADOS ================= */
const categorias=["Burgers","Porções","Bebidas","Sobremesas","Combos"];

const produtos=[
  { id:1, nome:"X‑Bacon Premium", categoria:"Burgers", descricao:"Blend 180g, cheddar duplo e bacon crocante", preco:29.9,
    imgs:[
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "https://images.unsplash.com/photo-1550547660-d9450f859349",
      "https://images.unsplash.com/photo-1550317138-10000687a72b"
    ]},

  { id:2, nome:"Batata Especial", categoria:"Porções", descricao:"Batata com cheddar cremoso e bacon", preco:21.9,
    imgs:[
      "https://images.unsplash.com/photo-1576107232684-1279f390859f",
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707"
    ]},

  { id:3, nome:"Milkshake Top", categoria:"Bebidas", descricao:"Chocolate ou morango 500ml", preco:16.9,
    imgs:[
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
      "https://images.unsplash.com/photo-1497534446932-c925b458314e"
    ]},

  { id:4, nome:"Petit Gateau", categoria:"Sobremesas", descricao:"Chocolate quente com sorvete", preco:18.9,
    imgs:[
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b"
    ]},

  { id:5, nome:"Combo Casal", categoria:"Combos", descricao:"2 burgers + batata + bebidas", preco:59.9,
    imgs:[
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      "https://images.unsplash.com/photo-1512152272829-e3139592d56f"
    ]}
];

export default function App(){
  const [categoria,setCategoria]=useState("Burgers");
  const [carrinho,setCarrinho]=useState([]);
  const [openCart,setOpenCart]=useState(false);
  const [search,setSearch]=useState("");
  const [lightbox,setLightbox]=useState(null);
  const [admin,setAdmin]=useState(false);
  const [logo,setLogo]=useState(null);
  const [dark,setDark]=useState(true);

  /* ===== CARRINHO ===== */
  const adicionar=p=>{
    setCarrinho(c=>{
      const existe=c.find(i=>i.id===p.id);
      if(existe) return c.map(i=>i.id===p.id?{...i,qtd:i.qtd+1}:i);
      return [...c,{...p,qtd:1}];
    });
  };

  const remover=id=>setCarrinho(c=>c.filter(i=>i.id!==id));
  const aumentar=id=>setCarrinho(c=>c.map(i=>i.id===id?{...i,qtd:i.qtd+1}:i));
  const diminuir=id=>setCarrinho(c=>c.map(i=>i.id===id&&i.qtd>1?{...i,qtd:i.qtd-1}:i));
  const limparCarrinho=()=>setCarrinho([]);

  const total=carrinho.reduce((a,b)=>a+b.preco*b.qtd,0);

  const produtosFiltrados = produtos.filter(
    p=>p.categoria===categoria &&
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const enviarWhatsApp=()=>{
    if(!carrinho.length) return;

    const msg=`Olá, vim do cardápio digital.%0A%0APedido:%0A${carrinho
      .map(p=>`• ${p.nome} (${p.qtd}) - R$ ${(p.preco*p.qtd).toFixed(2)}`)
      .join("%0A")}%0A%0ATotal: R$ ${total.toFixed(2)}`;

    window.open(`https://wa.me/5500000000000?text=${msg}`,'_blank');
  };

  return(
    <div className={`min-h-screen relative overflow-x-hidden transition ${dark?"text-white":"text-gray-900"}`}>

      {/* FUNDO */}
      <div className="fixed inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          className={`w-full h-full object-cover blur-sm scale-105 ${dark?"brightness-50":"brightness-110"}`} />
        <div className={`${dark?"bg-black/70":"bg-white/60"} absolute inset-0`} />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-xl z-50 px-4 md:px-10 py-4 flex flex-col md:flex-row gap-3 justify-between items-center">
        {logo ? <img src={logo} className="h-10 md:h-12 object-contain" />
          : <h1 className="text-yellow-400 font-bold text-lg md:text-xl">🔥 Burger House Premium</h1>}

        <input placeholder="Buscar produtos..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className={`${dark?"bg-white/10":"bg-black/10"} px-4 py-2 rounded-lg outline-none text-sm w-full md:w-64`} />

        <div className="flex gap-2">
          <button onClick={()=>setDark(!dark)} className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold">
            {dark?"☀️ Light":"🌙 Dark"}
          </button>

          <button onClick={()=>setAdmin(true)} className="bg-white/20 px-4 py-2 rounded-lg text-xs">
            Admin Demo
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center pt-32 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 mb-6">
          Experiência Digital Completa 
          <br />
          Demostração
        </h1>
      </section>

      {/* CATEGORIAS */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 px-4">
        {categorias.map(cat=>(
          <button key={cat} onClick={()=>setCategoria(cat)}
            className={`px-6 py-3 rounded-full ${categoria===cat?"bg-yellow-500 text-black":dark?"bg-white/10":"bg-black/10"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUTOS */}
      {produtosFiltrados.map(p=>(
        <div key={p.id} className="mb-20">
          <div className="flex gap-6 overflow-x-auto px-6 md:px-14">
            {p.imgs.map((img,i)=>(
              <div key={i} className="relative flex-shrink-0">
                <motion.img whileHover={{scale:1.05}}
                  onClick={()=>setLightbox(img)} src={img}
                  className="h-[320px] md:h-[360px] w-[85vw] md:w-[460px] object-cover rounded-3xl shadow-2xl cursor-pointer" />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-3xl p-4">
                  <h3 className="font-bold text-lg">{p.nome}</h3>
                  <p className="text-sm text-gray-300">{p.descricao}</p>
                  <p className="text-yellow-400 font-bold mt-1">R$ {p.preco.toFixed(2)}</p>
                </div>

                <button onClick={()=>adicionar(p)}
                  className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold">
                  Escolher
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SOBRE */}
      <section className="px-6 md:px-14 mb-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Sobre o Restaurante</h2>
        <p className={`${dark?"text-gray-300":"text-gray-700"} max-w-xl mx-auto`}>
          Ambiente moderno, atendimento rápido e os melhores burgers da cidade.
        </p>
      </section>

      {/* GALERIA */}
      <section className="px-6 md:px-14 mb-16">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Galeria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i=>(
            <img key={i}
              onClick={()=>setLightbox("https://images.unsplash.com/photo-1552566626-52f8b828add9")}
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
              className="rounded-2xl cursor-pointer" />
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="px-6 md:px-14 mb-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Localização</h2>
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
          className="rounded-3xl w-full h-72 object-cover" />
      </section>

      {/* AVALIAÇÕES */}
      <section className="px-6 md:px-14 mb-20">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Avaliações</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Ana","Carlos","Marcos"].map((c,i)=>(
            <div key={i} className="bg-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://i.pravatar.cc/40" className="rounded-full" />
                <strong>{c}</strong>
              </div>
              Melhor cardápio digital que já usei!
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP */}
      <button onClick={enviarWhatsApp}
        className="fixed bottom-20 left-4 md:left-8 bg-green-500 px-6 py-3 rounded-full font-bold shadow-xl">
        WhatsApp
      </button>

      {/* CARRINHO */}
      <motion.button whileHover={{scale:1.1}}
        onClick={()=>setOpenCart(true)}
        className="fixed bottom-20 right-4 md:right-8 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl">
        🛒 {carrinho.length}
      </motion.button>

      {/* MODAL CARRINHO */}
      <AnimatePresence>
        {openCart && (
          <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4">
            <motion.div className="bg-gray-900 p-6 rounded-3xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Seu Pedido</h2>

              {carrinho.map(item=>(
                <motion.div key={item.id} layout
                  className="flex justify-between items-center mb-4">
                  <div>
                    <p>{item.nome}</p>
                    <p className="text-sm opacity-70">
                      R$ {(item.preco*item.qtd).toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button onClick={()=>diminuir(item.id)}>-</button>
                      <span>{item.qtd}</span>
                      <button onClick={()=>aumentar(item.id)}>+</button>
                    </div>
                  </div>

                  <button onClick={()=>remover(item.id)} className="bg-red-500 px-3 py-1 rounded-lg">X</button>
                </motion.div>
              ))}

              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <strong>Total:</strong>
                <strong className="text-yellow-400">R$ {total.toFixed(2)}</strong>
              </div>

              <button onClick={limparCarrinho}
                className="mt-4 w-full bg-red-600 py-2 rounded-xl">Limpar carrinho</button>

              <button onClick={enviarWhatsApp}
                className="mt-2 w-full bg-green-500 py-3 rounded-xl font-bold">Finalizar WhatsApp</button>

              <button onClick={()=>setOpenCart(false)}
                className="mt-2 w-full bg-yellow-500 text-black py-3 rounded-xl font-bold">Fechar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN DEMO */}
      <AnimatePresence>
        {admin && (
          <motion.div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-8 rounded-3xl w-[90%] max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Painel Admin Demo</h2>

              <select className="w-full bg-black/40 p-3 rounded-xl mb-4"
                onChange={(e)=>produtos[0].categoria=e.target.value}>
                <option>Selecionar seção</option>
                {categorias.map(c=>(<option key={c}>{c}</option>))}
              </select>

              <input placeholder="Novo nome produto"
                className="w-full bg-black/40 p-3 rounded-xl mb-4"
                onChange={(e)=>produtos[0].nome=e.target.value} />

              <input placeholder="Novo preço"
                className="w-full bg-black/40 p-3 rounded-xl mb-4"
                onChange={(e)=>produtos[0].preco=parseFloat(e.target.value||0)} />

              <input type="file" accept="image/*"
                className="w-full bg-black/40 p-3 rounded-xl mb-4"
                onChange={(e)=>{
                  const file=e.target.files[0];
                  if(!file) return;
                  const reader=new FileReader();
                  reader.onload=(ev)=>produtos[0].imgs[0]=ev.target.result;
                  reader.readAsDataURL(file);
                }} />

              <input type="file" accept="image/*"
                className="w-full bg-black/40 p-3 rounded-xl mb-4"
                onChange={(e)=>{
                  const file=e.target.files[0];
                  if(!file) return;
                  const reader=new FileReader();
                  reader.onload=(ev)=>setLogo(ev.target.result);
                  reader.readAsDataURL(file);
                }} />

              <button onClick={()=>setAdmin(false)}
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold w-full">Fechar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setLightbox(null)}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <img src={lightbox} className="max-h-[90%] rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
