import { useState } from 'react';
import styled from 'styled-components';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore'; 

// --- 스타일 정의 ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: 100vh;
  font-family: sans-serif;
  box-sizing: border-box;
`;

const LetterPaper = styled.div`
  width: 100%;
  max-width: 500px;
  /* height: 500px; -> 내용에 따라 늘어나게 높이 고정 제거 */
  min-height: 400px; 
  background-color: ${(props) => props.color};
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  font-family: ${(props) => props.font};
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 200px;
  background: transparent;
  border: none;
  resize: none;
  font-size: 18px;
  line-height: 1.6;
  outline: none;
`;

// 이미지 미리보기 스타일
const AttachedImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: rgba(255,255,255,0.5);
`;

const ControlPanel = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
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

// 사진 업로드 버튼 스타일
const ImageUploadLabel = styled.label`
  display: inline-block;
  text-align: center;
  padding: 12px;
  background-color: #fff;
  color: #555;
  border-radius: 8px;
  border: 1px dashed #aaa;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  
  &:hover { background-color: #f9f9f9; }
`;

const HiddenFileInput = styled.input` display: none; `;

const SubmitButton = styled.button`
  margin-top: 10px; padding: 15px; background-color: #ff6b6b; color: white;
  border: none; border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;
  width: 100%;
  &:hover { background-color: #ff5252; }
`;

const SuccessBox = styled.div`
  background: white; padding: 30px; border-radius: 20px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  width: 100%; max-width: 500px; box-sizing: border-box;
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
  const [image, setImage] = useState(null); // 이미지 상태 추가
  const [createdLink, setCreatedLink] = useState(null);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ⚠️ 용량 체크: 1MB 이상이면 경고 (Firestore 용량 제한 때문)
      if (file.size > 1024 * 1024) {
        alert("사진 용량이 너무 커요! 1MB 이하로 올려주세요 ㅠㅠ");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content || !password) { alert("내용과 비밀번호를 채워주세요!"); return; }

    try {
      const docRef = await addDoc(collection(db, "letters"), {
        content, 
        password, 
        image, // ✨ 이미지 데이터도 같이 저장!
        style: { color: paperColor, font }, 
        createdAt: new Date().toISOString()
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
        {/* 이미지가 있으면 보여주기 */}
        {image && <AttachedImage src={image} alt="첨부된 사진" />}
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

        {/* 사진 업로드 버튼 */}
        <div>
          <Label>📷 사진 추가</Label>
          <ImageUploadLabel htmlFor="image-upload">
            {image ? "사진 변경하기" : "사진 선택하기"}
          </ImageUploadLabel>
          <HiddenFileInput
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        <div>
          <Label>🔒 비밀번호 설정</Label>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="비밀번호 (자유롭게 입력)" 
          />
        </div>
        
        {/* ✨ 편지 완성 버튼 여기 있습니다! */}
        <SubmitButton onClick={handleSubmit}>편지 완성하기 ✨</SubmitButton>
      </ControlPanel>
    </Container>
  );
}

export default Write;