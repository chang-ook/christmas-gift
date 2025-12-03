import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  // ======================
  // 0. 화면 단계 상태
  // ======================
  // 인트로(봉투) 보여줄지 여부
  const [showIntro, setShowIntro] = useState(true);
  // 봉투가 열리는 중인지 여부 (애니메이션용)
  const [isOpening, setIsOpening] = useState(false);
  // 메인 카드 보여줄지 여부
  const [showCard, setShowCard] = useState(false);

  // BGM 제어용 ref
  const audioRef = useRef(null);

  // ======================
  // 1. 타이핑 되는 편지
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
    }, 60); // 타이핑 속도

    return () => clearInterval(interval);
  }, []);

  // ======================
  // 2. D-Day 계산
  // ======================
  const startDate = new Date("2022-06-02");
  const [dDay, setDDay] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays + 1); // 첫날을 D+1로 보고 싶으면 +1
  }, []);

  // ======================
  // 3. 사진 슬라이드
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
  // 4. 봉투 클릭 시 동작
  // ======================
  const handleOpenLetter = () => {
    if (isOpening) return; // 중복 클릭 방지
    setIsOpening(true);

    // 일정 시간 후 카드 보여주기
    setTimeout(() => {
      setShowCard(true);
    }, 800); // 봉투 열리는 애니메이션 끝나는 타이밍

    // 인트로 오버레이는 조금 더 있다가 페이드아웃 후 제거
    setTimeout(() => {
      setShowIntro(false);
    }, 1200);
  };

  // ======================
  // 5. 카드가 나타날 때 BGM 재생 + 볼륨 페이드인
  // ======================
  useEffect(() => {
    if (!showCard || !audioRef.current) return;

    const audio = audioRef.current;
    let vol = 0;
    audio.volume = 0;

    // 유저 클릭 이후라 대부분 브라우저에서 play 허용됨
    audio
      .play()
      .catch(() => {
        // 모바일에서 자동재생 막힌 경우는 그냥 무시
      });

    const fade = setInterval(() => {
      vol += 0.02;
      if (vol >= 0.5) {
        vol = 0.5;
        clearInterval(fade);
      }
      audio.volume = vol;
    }, 120); // 0.5까지 ~3초 정도 페이드인

    return () => clearInterval(fade);
  }, [showCard]);

  // ======================
  // 렌더링
  // ======================
  return (
    <div className="App">
      {/* 눈 효과 (공통) */}
      <div className="snow-layer"></div>

      {/* === 인트로: 편지봉투 화면 === */}
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
                <br />
                편지를 열어보세요 💌
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

          {/* BGM */}
          <section className="music-section">
            <h2>🎧 함께 듣는 크리스마스 송</h2>
            <audio ref={audioRef} controls loop>
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
      )}
    </div>
  );
}

export default App;
