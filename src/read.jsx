import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// 스타일은 Write.jsx랑 비슷하게 가져왔어요
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify_content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: 'Gamja Flower', sans-serif;
  padding: 20px;
`;

const LetterPaper = styled.div`
  width: 100%;
  max-width: 500px; /* 모바일 대응 */
  min-height: 600px;
  background-color: ${(props) => props.color || '#fff'};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 40px;
  font-family: ${(props) => props.font || 'inherit'};
  white-space: pre-wrap; /* 줄바꿈 적용 */
  font-size: 22px;
  line-height: 1.8;
  position: relative;
  
  /* 편지가 잠겨있을 때 흐리게 처리 */
  ${(props) => props.isLocked && `
    filter: blur(10px);
    pointer-events: none;
  `}
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
  width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 80%;
  font-size: 18px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #555;
  }
`;

function Read() {
  const { id } = useParams(); // URL에서 아이디 가져오기
  const [letter, setLetter] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 1. 화면이 켜지면 Firebase에서 편지 데이터를 가져옴
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

  // 2. 비밀번호 확인 함수
  const checkPassword = () => {
    if (letter && letter.password === inputPassword) {
      setIsUnlocked(true); // 잠금 해제!
    } else {
      alert("비밀번호가 틀렸어요! 땡! 🙅‍♂️");
    }
  };

  if (!letter) return <div>편지를 찾고 있어요... 슝슝 🚀</div>;

  return (
    <Container>
      {/* 비밀번호 입력창 (잠겨있을 때만 보임) */}
      {!isUnlocked && (
        <LockScreen>
          <h2>🔒 비밀 편지 도착!</h2>
          <p>작성자가 설정한 암호를 대세요.</p>
          <Input 
            type="password" 
            placeholder="숫자 4자리"
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <br />
          <Button onClick={checkPassword}>열어보기</Button>
        </LockScreen>
      )}

      {/* 편지 내용 (잠겨있으면 흐리게 보임) */}
      <LetterPaper 
        color={letter.style.color} 
        font={letter.style.font}
        isLocked={!isUnlocked}
      >
        {letter.content}
        <div style={{marginTop: '50px', fontSize: '16px', textAlign: 'right', color: '#888'}}>
          {new Date(letter.createdAt).toLocaleDateString()} 에 작성됨
        </div>
      </LetterPaper>
    </Container>
  );
}

export default Read;