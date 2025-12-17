import { useState } from 'react';
import styled from 'styled-components';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore'; 

// ✨ 1. 컨테이너 패딩 수정 (모바일에서 너무 좁아지지 않게)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 오타 수정: justify_content -> justify-content */
  padding: 20px; /* 50px -> 20px로 줄임 (모바일 공간 확보) */
  background-color: #f0f0f0;
  min-height: 100vh;
  font-family: sans-serif;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
`;

// ✨ 2. 편지지 크기 반응형으로 변경
const LetterPaper = styled.div`
  width: 100%; /* 고정 500px -> 100%로 변경 (화면 꽉 차게) */
  max-width: 500px; /* 대신 PC에서는 너무 커지지 않게 제한 */
  height: 500px; /* 높이도 살짝 조정 (필요하면 늘리세요) */
  background-color: ${(props) => props.color};
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  padding: 30px; /* 패딩도 살짝 줄임 */
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  font-family: ${(props) => props.font};
  box-sizing: border-box; /* 테두리 계산 포함 */
`;

const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  font-size: 18px; /* 모바일에서 22px은 좀 클 수 있어서 조정 */
  line-height: 1.6;
  outline: none;
`;

// ✨ 3. 컨트롤 패널도 반응형으로
const ControlPanel = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%; /* 고정 500px -> 100% */
  max-width: 500px; /* 최대 너비 제한 */
  box-sizing: border-box;
`;

const Row = styled.div` display: flex; gap: 10px; align-items: center; flex-wrap: wrap; `;
const Label = styled.div` font-size: 16px; font-weight: bold; margin-bottom: 5px; `;

const ColorButton = styled.button`
  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #ddd; cursor: pointer;
  background-color: ${(props) => props.bg};
  transform: ${(props) => (props.selected ? 'scale(1.2)' : 'scale(1)')};
  border-color: ${(props) => (props.selected ? '#333' : '#ddd')};
`;

const Input = styled.input` 
  padding: 12px; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  width: 100%; 
  font-family: sans-serif;
  box-sizing: border-box; 
`;

const SubmitButton = styled.button`
  margin-top: 10px; padding: 15px; background-color: #ff6b6b; color: white;
  border: none; border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;
  width: 100%;
  &:hover { background-color: #ff5252; }
`;

const SuccessBox = styled.div`
  background: white; padding: 30px; border-radius: 20px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  h2 { color: #ff6b6b; margin-bottom: 20px; }
  p { font-size: 16px; color: #555; margin-bottom: 30px; }
`;

const LinkBox = styled.div`
  background: #f5f5f5; padding: 15px; border-radius: 10px; margin-bottom: 20px;
  word-break: break-all; font-family: sans-serif; color: #333; font-size: 14px;
`;

function Write() {
  const [paperColor, setPaperColor] = useState("#ffe4e1");
  const [font, setFont] = useState("'Gamja Flower', cursive");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [createdLink, setCreatedLink] = useState(null);

  const handleSubmit = async () => {
    if (!content || !password) { alert("내용과 비밀번호를 채워주세요!"); return; }

    try {
      const docRef = await addDoc(collection(db, "letters"), {
        content, password, style: { color: paperColor, font }, createdAt: new Date().toISOString()
      });
      const link = `${window.location.origin}/letter/${docRef.id}`;
      setCreatedLink(link);
    } catch (e) {
      console.error(e);
      alert("에러가 났어요 ㅠㅠ");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdLink);
    alert("링크가 복사되었습니다! 💌");
  };

  if (createdLink) {
    return (
      <Container>
        <SuccessBox>
          <h2>💌 편지 완성!</h2>
          <p>아래 링크를 복사해서 친구에게 보내세요.</p>
          <LinkBox>{createdLink}</LinkBox>
          <SubmitButton onClick={copyToClipboard}>🔗 링크 복사하기</SubmitButton>
          <br/><br/>
          <button 
            onClick={() => window.location.reload()} 
            style={{background:'none', border:'none', color:'#999', cursor:'pointer', padding: '10px'}}
          >
            새 편지 쓰기
          </button>
        </SuccessBox>
      </Container>
    );
  }

  return (
    <Container>
      <div style={{fontSize: '24px', marginBottom: '20px', fontWeight: 'bold'}}>💌 비밀 편지 쓰기</div>
      
      <LetterPaper color={paperColor} font={font}>
        <TextArea 
          placeholder="내용을 입력하세요..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
      </LetterPaper>

      <ControlPanel>
        <div>
          <Label>🎨 편지지 색상</Label>
          <Row>
            {["#ffe4e1", "#e0f7fa", "#fff9c4", "#e8f5e9", "#f3e5f5"].map(c => (
              <ColorButton key={c} bg={c} selected={paperColor === c} onClick={() => setPaperColor(c)} />
            ))}
          </Row>
        </div>
        
        {/* ✨ 4. 비밀번호 입력 자유롭게 변경 */}
        <div>
          <Label>🔒 비밀번호 설정</Label>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="비밀번호 (자유롭게 입력)" 
            // maxLength={4} 삭제함!
          />
        </div>
        <SubmitButton onClick={handleSubmit}>편지 완성하기 ✨</SubmitButton>
      </ControlPanel>
    </Container>
  );
}

export default Write;