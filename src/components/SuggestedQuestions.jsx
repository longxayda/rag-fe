export function SuggestedQuestions({ onQuestionClick, disabled }) {
  const questions = [
    'Di tích lịch sử Nọc Nạng là gì?',
    'Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?',
    'Ông Mười Chức là ai?',
    'Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?'
  ];


  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onQuestionClick(q)}
          disabled={disabled}
          className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-50 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {q}
        </button>
      ))}
    </div>
  );
}