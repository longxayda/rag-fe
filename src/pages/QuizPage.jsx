import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { questions } from '../data/quiz';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleAnswer = (index) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSpinning(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
      setSpinning(false);
    }, 600);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setSpinning(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Xuất sắc! Bạn là chuyên gia về Cà Mau - Bạc Liêu! 🏆";
    if (percentage >= 80) return "Tuyệt vời! Bạn hiểu biết rất nhiều! 🌟";
    if (percentage >= 60) return "Khá tốt! Tiếp tục tìm hiểu thêm nhé! 👍";
    if (percentage >= 40) return "Được đấy! Còn nhiều điều thú vị để khám phá! 📚";
    return "Hãy tìm hiểu thêm về vùng đất này nhé! 💪";
  };

  if (showResult) {
    return (
      <div className=" flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Kết Quả</h2>
          <div className="text-6xl font-bold text-emerald-600 mb-4">
            {score}/{questions.length}
          </div>
          <p className="text-xl text-gray-700 mb-6">{getScoreMessage()}</p>
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Chơi Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <Sparkles className="w-8 h-8 text-emerald-600" /> */}
            <h1 className="text-4xl font-bold text-gray-800">
              Hỏi Xoay Đáp Xoáy
            </h1>
            {/* <Sparkles className="w-8 h-8 text-teal-600" /> */}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Câu {currentQuestion + 1}/{questions.length}
            </span>
            <span className="text-sm font-semibold text-emerald-600">
              Điểm: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div 
          className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
            spinning ? 'animate-pulse scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4 mb-6">
            {questions[currentQuestion].options.map((option, index) => {
              const isCorrect = index === questions[currentQuestion].correct;
              const isSelected = index === selectedAnswer;
              
              let buttonClass = "w-full p-5 rounded-xl text-left font-semibold transition-all transform hover:scale-102 ";
              
              if (answered) {
                if (isCorrect) {
                  buttonClass += "bg-green-100 border-2 border-green-500 text-green-800";
                } else if (isSelected) {
                  buttonClass += "bg-red-100 border-2 border-red-500 text-red-800";
                } else {
                  buttonClass += "bg-gray-100 text-gray-500";
                }
              } else {
                buttonClass += "bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-transparent hover:border-emerald-400 text-gray-700";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <span className="text-lg">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 animate-fade-in">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-700">Giải thích:</strong>{' '}
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Câu Tiếp Theo
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Xem Kết Quả
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}