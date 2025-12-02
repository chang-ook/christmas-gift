import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // ====== 1. 타이핑 되는 편지 ======
  const fullLetter =
    "올해도 나랑 함께해줘서 고마워.\n" +
    "너랑 같이 웃고, 같이 걷고, 같이 먹었던 모든 순간이\n" +
    "나한텐 너무 소중한 기억이야.\n" +
    "앞으로도 매년 크리스마스를 너랑 보내고 싶어. ❤️";

  const [typedLetter, setTypedLetter] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedLetter(fullLetter.slice(0, i));
      i++;
      if (i > fullLetter.length) clearInterval(interval);
    }, 60); // 타이핑 속도 (ms)

    return () => clearInterval(interval);
  }, []);

  // ====== 2. D-Day 계산 (만난 날 / 사귄 날) ======
  // TODO: 여기를 너네 기념일로 바꿔줘
  const startDate = new Date("2022-06-02"); // 예시: 2023-12-25
  const [dDay, setDDay] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays + 1); // 첫날을 D+1로 보고 싶으면 +1
  }, []);

  // ====== 3. 사진 슬라이드 ======
  // public 폴더에 이미지 파일 넣고 경로 맞춰주면 됨
  const photos = [
    "/images/us-1.jpg",
    "/images/us-2.jpg",
    "/images/us-3.jpg",
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="App">
      {/* 눈 효과 */}
      <div className="snow-layer"></div>

      <div className="card">
        <header className="card-header">
          <h1>🎄 Merry Christmas 🎄</h1>
          <p className="subtitle">To. 가장 소중한 너에게</p>
        </header>

        {/* D-Day */}
        <section className="dday-section">
          <span className="dday-label">우리가 함께한 지</span>
          <span className="dday-value">D+{dDay}</span>
        </section>

        {/* 편지 */}
        <section className="letter-section">
          <pre className="letter">{typedLetter}</pre>
        </section>

        {/* 사진 슬라이드 */}
        <section className="photo-section">
          <h2>📷 우리 추억 모음</h2>
          <div className="photo-wrapper">
            <button className="nav-btn" onClick={prevPhoto}>
              ◀
            </button>
            <img
              src={photos[currentPhotoIndex]}
              alt="우리 사진"
              className="photo"
            />
            <button className="nav-btn" onClick={nextPhoto}>
              ▶
            </button>
          </div>
          <div className="photo-indicator">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </section>

        {/* BGM */}
        <section className="music-section">
          <h2>🎧 함께 듣는 크리스마스 송</h2>
          {/* public/music/christmas.mp3 경로 기준 */}
          <audio controls loop>
            <source src="/music/christmas.mp3" type="audio/mpeg" />
            브라우저가 오디오 태그를 지원하지 않습니다.
          </audio>
        </section>

        <footer className="card-footer">
          <p>
            from. <span className="from-name">우끼 보리스</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
