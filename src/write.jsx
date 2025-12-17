import { useState } from 'react';
import styled from 'styled-components';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore'; 

// 스타일 컴포넌트들 (기존과 동일 + SuccessBox 추가)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify_content: center;
  padding: 50px;
  background-color: #f0f0f0;
  min-height: 100vh;
  font-family: 'Gamja Flower', sans-serif;
`;

const LetterPaper = styled.div`
  width: 500px;
  height: 600px;
  background-color: ${(props) => props.color};
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  font-family: ${(props) => props.font};
`;

const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  font-size: 22px; 
  line-height: 1.6;
  outline: none;
  font-family: inherit;
`;

const ControlPanel = styled.div`
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 500px;
`;

const Row = styled.div` display: flex; gap: 10px; align-items: center; `;
const Label = styled.div` font-size: 18px; font-weight: bold; margin-bottom: 5px; `;

const ColorButton = styled.button`
  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #ddd; cursor: pointer;
  background-color: ${(props) => props.bg};
  transform: ${(props) => (props.selected ? 'scale(1.2)' : 'scale(1)')};
  border-color: ${(props) => (props.selected ? '#333' : '#ddd')};
`;

const FontButton = styled.button`
  padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;
  background: ${(props) => (props.selected ? '#333' : 'white')};
  color: ${(props) => (props.selected ? 'white' : '#333')};
  font-family: ${(props) => props.font};
`;

const Input = styled.input` padding: 10px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-family: sans-serif; `;

const SubmitButton = styled.button`
  margin-top: 10px; padding: 15px; background-color: #ff6b6b; color: white;
  border: none; border-radius: 10px; font-size: 20px; cursor: pointer; font-weight: bold;
  &:hover { background-color: #ff5252; }
`;

// 👇 성공했을 때 보여줄 박스 스타일
const SuccessBox = styled.div`
  background: white; padding: 40px; border-radius: 20px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 500px;
  h2 { color: #ff6b6b; margin-bottom: 20px; }
  p { font-size: 18px; color: #555; margin-bottom: 30px; }
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
  
  // 👇 편지 저장 후 생성된 링크를 담을 상태
  const [createdLink, setCreatedLink] = useState(null);

  const handleSubmit = async () => {
    if (!content || !password) { alert("내용과 비밀번호를 채워주세요!"); return; }

    try {
      const docRef = await addDoc(collection(db, "letters"), {
        content, password, style: { color: paperColor, font }, createdAt: new Date().toISOString()
      });
      
      // 👇 저장이 성공하면 링크를 만들어서 상태에 넣음
      const link = `${window.location.origin}/letter/${docRef.id}`;
      setCreatedLink(link);
      
    } catch (e) {
      console.error(e);
      alert("에러가 났어요 ㅠㅠ");
    }
  };

  // 👇 링크 복사 함수
  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdLink);
    alert("링크가 복사되었습니다! 친구에게 보내보세요 💌");
  };

  // 👇 저장에 성공했다면 글쓰기 화면 대신 성공 화면을 보여줌
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
            style={{background:'none', border:'none', color:'#999', cursor:'pointer'}}
          >
            새 편지 쓰기
          </button>
        </SuccessBox>
      </Container>
    );
  }

  // 아직 저장 안 했으면 원래 글쓰기 화면 보여줌
  return (
    <Container>
      <div style={{fontSize: '32px', marginBottom: '20px'}}>💌 비밀 편지 쓰기</div>
      <LetterPaper color={paperColor} font={font}>
        <TextArea placeholder="내용을 입력하세요..." value={content} onChange={(e) => setContent(e.target.value)} />
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
        <div>
          <Label>✒️ 글씨체</Label>
          <Row>
            <FontButton font="'Gamja Flower', cursive" selected={font === "'Gamja Flower', cursive"} onClick={() => setFont("'Gamja Flower', cursive")}>감자꽃체</FontButton>
            <FontButton font="sans-serif" selected={font === "sans-serif"} onClick={() => setFont("sans-serif")}>고딕체</FontButton>
          </Row>
        </div>
        <div>
          <Label>🔒 비밀번호 (숫자 4자리)</Label>
          <Input type="password" maxLength={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 설정" />
        </div>
        <SubmitButton onClick={handleSubmit}>편지 완성하기 ✨</SubmitButton>
      </ControlPanel>
    </Container>
  );
}

export default Write;