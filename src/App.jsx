import { useState } from 'react';
import styled from 'styled-components';

// --- 스타일 정의 ---

// 1. 전체 화면 컨테이너 (모바일 최적화 수정)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* ✨ 오타 수정: 세로 중앙 정렬 */
  padding: 20px; /* ✨ 수정: 모바일 여백을 줄여서 화면을 넓게 씀 */
  background-color: #f0f0f0;
  min-height: 100vh;
  box-sizing: border-box; /* 패딩 포함해서 높이 계산 */
`;

// 2. 편지지 영역
const LetterPaper = styled.div`
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 25px; /* 내부 여백 살짝 조정 */
  
  background-color: ${(props) => props.color};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); /* 그림자 조금 더 부드럽게 */
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

const Title = styled.h1`
  font-size: 32px; /* 이모지 크기 키움 */
  margin-bottom: 20px;
  text-align: center;
  margin-top: 0;
`;

// 3. 내용 입력칸 (최소 높이 추가)
const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px; /* ✨ 수정: 내용이 적어도 기본 높이 확보 */
  background: transparent;
  border: none;
  resize: none;
  font-size: 18px;
  line-height: 1.6;
  outline: none;
  /* 기본 폰트 사용 (index.css에 설정된 폰트가 적용됨) */
`;

// 4. 색상 버튼 그룹
const ButtonGroup = styled.div`
  margin-top: 25px;
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const ColorButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid #fff; /* 테두리 좀 더 두껍게 */
  cursor: pointer;
  background-color: ${(props) => props.bg};
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.15);
  }
`;

// ✨ 5. 추가된 스타일: 첨부 이미지 및 업로드 버튼

// 첨부된 이미지 스타일
const AttachedImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain; /* 비율 유지하며 다 보여주기 */
  border-radius: 12px;
  margin-bottom: 20px;
`;

// "사진 추가하기" 버튼 스타일 (라벨을 버튼처럼 꾸밈)
const ImageUploadLabel = styled.label`
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #fff;
  color: #555;
  border-radius: 30px;
  border: 2px solid #eee;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    background-color: #f9f9f9;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
  &:active {
    transform: scale(0.98);
  }
`;

// 실제 파일 input은 숨김
const HiddenFileInput = styled.input`
  display: none;
`;


// --- 메인 컴포넌트 ---
function App() {
  const [paperColor, setPaperColor] = useState("#ffe4e1");
  const [image, setImage] = useState(null); // ✨ 추가: 이미지 저장할 공간

  // ✨ 추가: 파일 선택 시 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택된 첫 번째 파일 가져오기
    if (file) {
      const reader = new FileReader();
      // 파일을 다 읽으면 실행될 기능: 읽은 결과를 image 상태에 저장