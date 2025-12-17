import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Write from './Write'; // 아까 이름 바꾼 파일 불러오기
import Read from './Read';   // 방금 만든 읽기 파일 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 주소가 그냥 '/' 면 -> 글쓰기 화면 보여줘 */}
        <Route path="/" element={<Write />} />
        
        {/* 주소가 '/letter/어쩌구' 면 -> 읽기 화면 보여줘 */}
        <Route path="/letter/:id" element={<Read />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
