import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cardapio from "./pages/Cardapio";
import Caixa from "./pages/Caixa";
import Admin from "./pages/Admin";
import TelaCozinha from "./pages/TelaCozinha";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cardapio/>}/>
        <Route path="/caixa" element={<Caixa/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/cozinha" element={<TelaCozinha/>}/>
      </Routes>
    </BrowserRouter>
  );
}
