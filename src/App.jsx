import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  // ======================
  // 0. BGM 플레이리스트 (3곡 순환)
  // ======================
  const bgmList = [
    "/music/music1.mp3",
    "/music/music2.mp3",
    "/music/music3.mp3",
  ];

  const [bgmIndex, setBgmIndex] = useState(0);

  // ======================
  // 1. 화면 상태
  // ======================
  const [showIntro, setShowIntro] = useState(true); // 봉투 화면
  const [isOpening, setIsOpening] = useState(false); // 봉투 애니메이션
  const [showCard, setShowCard] = useState(false); // 메인 카드 화면

  const audioRef = useRef(null);

  // ======================
  // 2. 타이핑 되는 편지
  // ======================
  const fullLetter =
    "올해도 나랑 함께해줘서 고마워용.\n" +
    "내년에도 싸우지 말고 행복하게 지내자요!!❤️\n" +
    "앞으로도 매년 크리스마스🎄를 굥이랑 보내고 싶어용. ❤️";

  const [typedLetter, setTypedLetter] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedLetter(fullLetter.slice(0, i));
      i++;
      if (i > fullLetter.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // ======================
  // 3. D-Day 계산
  // ======================
  const startDate = new Date("2022-06-02");
  const [dDay, setDDay] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays + 1);
  }, []);

  // ======================
  // 4. 사진 슬라이드
  // ======================
  const photos = [
    "/images/picture1.jpg",
    "/images/picture2.jpg",
    "/images/picture3.jpg",
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

  // ======================
  // 5. BGM 자동 재생 + 순환 + 페이드인
  // ======================

  const playBGM = (index) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = bgmList[index];
    audio.volume = 0;

    audio.play().catch(() => {});

    // 페이드인
    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      if (vol >= 0.5) {
        vol = 0.5;
        clearInterval(fade);
      }
      audio.volume = vol;
    }, 120);

    // 곡이 끝나면 다음 곡
    audio.onended = () => {
      const nextIndex = (index + 1) % bgmList.length;
      setBgmIndex(nextIndex);
      playBGM(nextIndex);
    };
  };

  // ======================
  // 6. 봉투 클릭 시 동작
  // ======================
  const handleOpenLetter = () => {
    if (isOpening) return;

    setIsOpening(true);

    // 🔊 첫 번째 곡 재생 시작
    playBGM(0);

    // 카드 표시
    setTimeout(() => {
      setShowCard(true);
    }, 800);

    // 인트로 페이드 아웃 후 제거
    setTimeout(() => {
      setShowIntro(false);
    }, 1200);
  };

  // ======================
  // 렌더링
  // ======================
  return (
    <div className="App">
      {/* 눈 효과 */}
      <div className="snow-layer"></div>

      {/* 🔊 숨겨진 오디오 */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* === 인트로 봉투 화면 === */}
      {showIntro && (
        <div className={`intro-overlay ${isOpening ? "intro-fade" : ""}`}>
          <div
            className={`envelope ${isOpening ? "opening" : ""}`}
            onClick={handleOpenLetter}
          >
            <div className="envelope-top" />
            <div className="envelope-body">
              <p className="envelope-text">
                클릭해서
                <br /> 편지를 열어보세요 💌
              </p>
            </div>
            <div className="envelope-seal">♥</div>
          </div>
          <p className="intro-hint">터치해서 편지를 열어봐</p>
        </div>
      )}

      {/* === 메인 카드 화면 === */}
      {showCard && (
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

          <footer className="card-footer">
            <p>
              from. <span className="from-name">우끼 보리스</span>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
