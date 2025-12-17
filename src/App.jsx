import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Write from './write';
import Read from './read';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(홈)에서는 편지 쓰기 페이지 보여주기 */}
        <Route path="/" element={<Write />} />
        
        {/* /letter/어쩌구 주소로 들어오면 편지 읽기 페이지 보여주기 */}
        <Route path="/letter/:id" element={<Read />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
