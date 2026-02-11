import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= DADOS ================= */
const categorias=["Burgers","Porções","Bebidas","Sobremesas","Combos"];

const produtos=[
  { id:1, nome:"X‑Bacon Premium", categoria:"Burgers", descricao:"Blend 180g, cheddar duplo e bacon crocante", preco:29.9, destaque:true,
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

/* ================= APP ================= */
export default function App(){
  const [categoria,setCategoria]=useState("Burgers");
  const [carrinho,setCarrinho]=useState([]);
  const [openCart,setOpenCart]=useState(false);
  const [search,setSearch]=useState("");
  const [lightbox,setLightbox]=useState(null);
  const [admin,setAdmin]=useState(false);
  const [logo,setLogo]=useState(null);

  const carouselRef=useRef(null);

  useEffect(()=>{
    const el=carouselRef.current;
    if(!el) return;
    const id=setInterval(()=>{
      el.scrollBy({left:350,behavior:"smooth"});
    },4000);
    return ()=>clearInterval(id);
  },[]);

  const adicionar=p=>setCarrinho([...carrinho,p]);
  const total=carrinho.reduce((a,b)=>a+b.preco,0);

  const enviarWhatsApp=()=>{
    if(!carrinho.length) return;

    const msg=`Olá, vim do cardápio digital.%0A%0APedido:%0A${carrinho
      .map(p=>`• ${p.nome} - R$ ${p.preco.toFixed(2)}`)
      .join("%0A")}%0A%0ATotal: R$ ${total.toFixed(2)}`;

    window.open(`https://wa.me/5500000000000?text=${msg}`,'_blank');
  };

  return(
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden">

      {/* ===== FUNDO ===== */}
      <div className="fixed inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
             className="w-full h-full object-cover blur-sm scale-105" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl z-50 px-4 md:px-10 py-4 flex flex-col md:flex-row gap-3 justify-between items-center">
        {logo ? (
          <img src={logo} className="h-10 md:h-12 object-contain" />
        ) : (
          <h1 className="text-yellow-400 font-bold text-lg md:text-xl">🔥 Burger House Premium</h1>
        )}

        <input
          placeholder="Buscar produtos..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="bg-white/10 px-4 py-2 rounded-lg outline-none text-sm w-full md:w-64"
        />

        <button
          onClick={()=>setAdmin(true)}
          className="bg-white/10 px-4 py-2 rounded-lg text-xs">
          Admin Demo
        </button>
      </nav>

      {/* ===== HERO ===== */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center pt-32 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 mb-6">
          Experiência Digital Completa
        </h1>
        <p className="text-gray-300 max-w-xl">
          Cardápio moderno com automação, pedidos rápidos e visual premium.
        </p>
      </section>

      {/* ===== PROMOÇÃO ===== */}
      <section className="px-6 md:px-14 mb-16">
        <div className="bg-yellow-500 text-black rounded-3xl p-6 text-center font-bold text-lg">
          🍔 Promoção hoje: Combo Casal por R$ 59,90
        </div>
      </section>

      {/* ===== CATEGORIAS ===== */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 px-4">
        {categorias.map(cat=>(
          <button key={cat}
            onClick={()=>setCategoria(cat)}
            className={`px-6 py-3 rounded-full font-semibold ${categoria===cat?"bg-yellow-500 text-black":"bg-white/10"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* ===== PRODUTOS ===== */}
      {produtos
        .filter(p=>p.categoria===categoria)
        .filter(p=>p.nome.toLowerCase().includes(search.toLowerCase()))
        .map(p=>(
        <div key={p.id} className="mb-20">

          <div ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-14">

            {p.imgs.map((img,i)=>(
              <div key={i} className="snap-center relative">
                <div className="relative">
                <motion.img
                  whileHover={{scale:1.05}}
                  onClick={()=>setLightbox(img)}
                  src={img}
                  className="h-[260px] md:h-[340px] w-[300px] md:w-[460px] object-cover rounded-3xl shadow-2xl cursor-pointer" />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-3xl p-4">
                  <h3 className="font-bold text-lg">{p.nome}</h3>
                  <p className="text-sm text-gray-300">{p.descricao}</p>
                  <p className="text-yellow-400 font-bold mt-1">R$ {p.preco.toFixed(2)}</p>
                </div>

                <button
                  onClick={()=>adicionar(p)}
                  className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold">
                  Escolher
                </button>
              </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== SOBRE ===== */}
      <section className="px-6 md:px-14 mb-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Sobre o Restaurante</h2>
        <p className="text-gray-300 max-w-xl mx-auto">
          Ambiente moderno, atendimento rápido e os melhores burgers da cidade.
        </p>
      </section>

      {/* ===== GALERIA ===== */}
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

      {/* ===== MAPA ===== */}
      <section className="px-6 md:px-14 mb-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Localização</h2>
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
             className="rounded-3xl w-full h-72 object-cover" />
      </section>

      {/* ===== AVALIAÇÕES ===== */}
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

      {/* ===== BOTÃO WHATSAPP ===== */}
      <button
        onClick={enviarWhatsApp}
        className="fixed bottom-20 left-4 md:left-8 bg-green-500 px-6 py-3 rounded-full font-bold shadow-xl">
        WhatsApp
      </button>

      {/* ===== CARRINHO ===== */}
      <motion.button
        whileHover={{scale:1.1}}
        onClick={()=>setOpenCart(true)}
        className="fixed bottom-20 right-4 md:right-8 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl">
        🛒 {carrinho.length}
      </motion.button>

      <AnimatePresence>
        {openCart && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="fixed inset-0 bg-black/80 flex justify-center items-center p-4">

            <motion.div
              initial={{scale:.7}}
              animate={{scale:1}}
              exit={{scale:.7}}
              className="bg-gray-900 p-6 rounded-3xl w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">Seu Pedido</h2>

              {carrinho.map((item,i)=>(
                <div key={i} className="flex justify-between mb-2">
                  <span>{item.nome}</span>
                  <span>R$ {item.preco.toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t border-gray-700 mt-6 pt-4 flex justify-between">
                <strong>Total:</strong>
                <strong className="text-yellow-400">R$ {total.toFixed(2)}</strong>
              </div>

              <button
                onClick={enviarWhatsApp}
                className="mt-4 w-full bg-green-500 py-3 rounded-xl font-bold">
                Finalizar WhatsApp
              </button>

              <button
                onClick={()=>setOpenCart(false)}
                className="mt-3 w-full bg-yellow-500 text-black py-3 rounded-xl font-bold">
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ADMIN DEMO ===== */}
      <AnimatePresence>
        {admin && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">

            <div className="bg-gray-900 p-8 rounded-3xl w-[90%] max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Painel Admin Demo</h2>

              <p className="text-gray-400 mb-6">
                Demonstração: alterações aqui simulam edição do cardápio.
              </p>

              <div className="space-y-4 mb-6">
                <select
                  className="w-full bg-black/40 p-3 rounded-xl"
                  onChange={(e)=>{
                    produtos[0].categoria=e.target.value;
                  }}>
                  <option>Selecionar seção</option>
                  {categorias.map(c=>(<option key={c}>{c}</option>))}
                </select>

                <input
                  placeholder="Novo nome do produto (demo)"
                  className="w-full bg-black/40 p-3 rounded-xl"
                  onChange={(e)=>{
                    produtos[0].nome=e.target.value;
                  }}
                />

                <input
                  placeholder="Novo preço (demo)"
                  className="w-full bg-black/40 p-3 rounded-xl"
                  onChange={(e)=>{
                    produtos[0].preco=parseFloat(e.target.value||0);
                  }}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-black/40 p-3 rounded-xl"
                  onChange={(e)=>{
                    const file=e.target.files[0];
                    if(!file) return;
                    const reader=new FileReader();
                    reader.onload=(ev)=>{
                      produtos[0].imgs[0]=ev.target.result;
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                <p className="text-xs text-gray-500">
                  ⚠️ Alterações são apenas visuais para apresentação.

                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-black/40 p-3 rounded-xl"
                  onChange={(e)=>{
                    const file=e.target.files[0];
                    if(!file) return;
                    const reader=new FileReader();
                    reader.onload=(ev)=>{
                      setLogo(ev.target.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <p className="text-xs text-gray-500">Upload logo restaurante (demo)</p>
                </p>
              </div>

              <button
                onClick={()=>setAdmin(false)}
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={()=>setLightbox(null)}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <img src={lightbox} className="max-h-[90%] rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
