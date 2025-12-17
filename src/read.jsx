import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const LetterPaper = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 400px;
  background-color: ${(props) => props.color || '#fff'};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 30px;
  font-family: ${(props) => props.font || 'inherit'};
  white-space: pre-wrap;
  font-size: 20px;
  line-height: 1.8;
  position: relative;
  box-sizing: border-box;
  
  ${(props) => props.isLocked && `
    filter: blur(10px);
    pointer-events: none;
  `}
`;

// ✨ 읽기 화면용 이미지 스타일 추가
const LetterImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
  display: block;
`;

const LockScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  text-align: center;
  width: 80%;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #555;
  }
`;

function Read() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const fetchLetter = async () => {
      const docRef = doc(db, "letters", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLetter(docSnap.data());
      } else {
        alert("없는 편지거나 삭제된 편지예요 ㅠㅠ");
      }
    };
    fetchLetter();
  }, [id]);

  const checkPassword = () => {
    if (letter && letter.password === inputPassword) {
      setIsUnlocked(true);
    } else {
      alert("비밀번호가 틀렸어요! 땡! 🙅‍♂️");
    }
  };

  if (!letter) return <div>편지를 찾고 있어요... 슝슝 🚀</div>;

  return (
    <Container>
      {!isUnlocked && (
        <LockScreen>
          <h2>🔒 비밀 편지 도착!</h2>
          <p>암호를 입력하세요.</p>
          <Input 
            type="password" 
            placeholder="비밀번호 입력"
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <br />
          <Button onClick={checkPassword}>열어보기</Button>
        </LockScreen>
      )}

      <LetterPaper 
        color={letter.style.color} 
        isLocked={!isUnlocked}
      >
        {/* ✨ 사진이 있으면 편지 내용 위에 보여줌 */}
        {letter.image && <LetterImage src={letter.image} alt="추억 사진" />}
        
        {letter.content}
        
        <div style={{marginTop: '50px', fontSize: '14px', textAlign: 'right', color: '#888'}}>
        </div>
      </LetterPaper>
    </Container>
  );
}

export default Read;