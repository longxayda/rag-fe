import { useState } from "react";

// const FAKE_ANSWERS = {
//   "Di tích lịch sử Nọc Nạng là gì?":
//     "Di tích lịch sử Nọc Nạng là địa danh gắn liền với cuộc đấu tranh của nông dân Nam Bộ chống áp bức địa chủ và thực dân Pháp. Sự kiện Nọc Nạng năm 1928 đã trở thành biểu tượng cho tinh thần yêu nước và ý chí phản kháng của người dân Bạc Liêu – Cà Mau.",

//   "Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?":
//     "Sự kiện Nọc Nạng năm 1928 thể hiện tinh thần đấu tranh bất khuất của nông dân Nam Bộ trước sự bất công trong xã hội phong kiến – thực dân. Đây là một trong những sự kiện tiêu biểu phản ánh mâu thuẫn giai cấp sâu sắc thời kỳ đó.",

//   "Ông Mười Chức là ai?":
//     "Ông Mười Chức là một trong những nhân vật tiêu biểu liên quan đến sự kiện Nọc Nạng năm 1928. Ông đại diện cho tầng lớp nông dân bị áp bức, dám đứng lên bảo vệ quyền lợi chính đáng của mình.",

//   "Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?":
//     "Lễ hội Dấu ấn Đồng Nọc Nạng thường được tổ chức hằng năm nhằm tưởng nhớ sự kiện lịch sử Nọc Nạng năm 1928, đồng thời giáo dục truyền thống yêu nước cho thế hệ trẻ."
// };

const FAKE_ANSWERS = {
  "Di tích lịch sử Nọc Nạng là gì?":
    "Di tích lịch sử Nọc Nạng là một địa danh lịch sử nổi tiếng gắn liền với cuộc đấu tranh của nông dân Nam Bộ chống lại sự áp bức, bóc lột của địa chủ và chính quyền thực dân Pháp vào đầu thế kỷ XX. Di tích nằm tại khu vực Đồng Nọc Nạng, nơi đã diễn ra vụ xung đột đẫm máu năm 1928 giữa gia đình nông dân Mười Chức và lực lượng cưỡng chế của chính quyền thực dân.\n\nSự kiện tại Nọc Nạng không chỉ phản ánh nỗi thống khổ của người nông dân mất đất mà còn thể hiện tinh thần phản kháng mạnh mẽ, dám đứng lên bảo vệ quyền sống và quyền lao động chính đáng. Ngày nay, di tích Nọc Nạng được xem là biểu tượng lịch sử tiêu biểu của phong trào đấu tranh nông dân ở Nam Bộ, có giá trị to lớn trong việc giáo dục truyền thống yêu nước, ý thức công bằng xã hội cho thế hệ trẻ.",

  "Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?":
    "Sự kiện Nọc Nạng năm 1928 mang ý nghĩa lịch sử sâu sắc, phản ánh rõ nét mâu thuẫn giai cấp gay gắt trong xã hội Việt Nam dưới ách thống trị của thực dân Pháp. Đây là minh chứng tiêu biểu cho tình trạng nông dân bị tước đoạt ruộng đất, bị áp bức bởi hệ thống địa chủ và chính quyền bảo hộ.\n\nCuộc đấu tranh tại Nọc Nạng tuy mang tính tự phát nhưng thể hiện tinh thần bất khuất, ý chí phản kháng mạnh mẽ của người nông dân Nam Bộ. Sự kiện này đã gây chấn động dư luận đương thời, góp phần thức tỉnh tinh thần đấu tranh trong quần chúng nhân dân, đồng thời trở thành một bài học lịch sử quan trọng về công bằng xã hội, quyền con người và khát vọng tự do của dân tộc Việt Nam.",

  "Ông Mười Chức là ai?":
    "Ông Mười Chức là một nông dân tiêu biểu gắn liền với sự kiện lịch sử Nọc Nạng năm 1928. Ông là chủ hộ gia đình sinh sống và khai khẩn đất đai tại khu vực Đồng Nọc Nạng, nhưng sau đó bị địa chủ và chính quyền thực dân tìm cách chiếm đoạt đất đai một cách bất công.\n\nTrước sự cưỡng ép và đàn áp, ông Mười Chức cùng gia đình đã kiên quyết chống trả để bảo vệ quyền lợi chính đáng của mình. Hình ảnh ông Mười Chức trở thành biểu tượng cho người nông dân Nam Bộ giàu lòng tự trọng, dám đứng lên chống lại bất công dù phải đối mặt với nguy hiểm và hy sinh. Nhân vật này được nhắc đến trong lịch sử như một minh chứng sống động cho tinh thần phản kháng của nông dân Việt Nam thời kỳ thực dân.",

  "Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?":
    "Lễ hội Dấu ấn Đồng Nọc Nạng thường được tổ chức định kỳ hằng năm tại khu di tích lịch sử Nọc Nạng. Thời gian tổ chức có thể thay đổi tùy theo điều kiện cụ thể của địa phương, nhưng thường gắn với các dịp kỷ niệm sự kiện lịch sử năm 1928.\n\nLễ hội bao gồm các hoạt động tưởng niệm, dâng hương, sinh hoạt văn hóa – nghệ thuật và tuyên truyền giáo dục lịch sử. Thông qua lễ hội, chính quyền và nhân dân địa phương nhằm tri ân những người đã hy sinh, đồng thời giáo dục truyền thống yêu nước, tinh thần đấu tranh vì công lý cho thế hệ trẻ. Đây cũng là dịp để quảng bá giá trị lịch sử – văn hóa của di tích Nọc Nạng đến với đông đảo du khách."
};



const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function useStreamingChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI về di sản văn hóa tỉnh Cà Mau. Bạn có thể hỏi tôi về các di tích, lễ hội và nhân vật lịch sử địa phương."
    }
  ]);

  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (userInput) => {
    // 1️⃣ User message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput }
    ]);

    setIsStreaming(true);

    // 2️⃣ Fake thinking delay (AI đang suy nghĩ)
    await sleep(3000); // 👈 chỉnh 1000–1500ms là đẹp

    const fullAnswer =
      FAKE_ANSWERS[userInput] ||
      "hiện tại chưa có thông tin về câu hỏi của bạn";

    // 3️⃣ Streaming text
    let currentText = "";
    const words = fullAnswer.split(" ");

    for (let i = 0; i < words.length; i++) {
      await sleep(60); // tốc độ gõ chữ

      currentText += words[i] + " ";

      setMessages((prev) => {
        const newMsgs = [...prev];
        const last = newMsgs[newMsgs.length - 1];

        if (last?.role === "assistant" && last.isTemp) {
          last.content = currentText;
        } else {
          newMsgs.push({
            role: "assistant",
            content: currentText,
            isTemp: true
          });
        }

        return newMsgs;
      });
    }

    // 4️⃣ Kết thúc streaming
    setMessages((prev) =>
      prev.map((m) =>
        m.isTemp ? { role: "assistant", content: m.content } : m
      )
    );

    setIsStreaming(false);
  };

  return {
    messages,
    isStreaming,
    sendMessage
  };
}
