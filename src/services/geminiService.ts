const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

export async function callGeminiAI(prompt: string, apiKey: string, modelIndex = 0): Promise<string | null> {
  if (!apiKey) {
    throw new Error('Vui lòng cấu hình API Key trong phần Cài đặt');
  }

  try {
    const modelName = MODELS[modelIndex] || MODELS[0];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
        })
      }
    );

    if (response.status === 429 && modelIndex < MODELS.length - 1) {
      return callGeminiAI(prompt, apiKey, modelIndex + 1);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error: any) {
    console.error(`Error with model ${MODELS[modelIndex]}:`, error);

    if (modelIndex < MODELS.length - 1) {
      return callGeminiAI(prompt, apiKey, modelIndex + 1);
    }
    
    throw error;
  }
}

export const PROMPTS = {
  getLearningPath: (subject: string, score: number, total: number) => `
    Tôi là một học sinh đang ôn thi chứng chỉ ${subject}. 
    Kết quả bài kiểm tra đầu vào của tôi là ${score}/${total}.
    Hãy thiết kế một lộ trình học cá nhân hóa chi tiết trong vòng 30 ngày để giúp tôi đạt điểm tối đa.
    Phân chia theo từng tuần, mỗi tuần tập trung vào các kỹ năng cụ thể của MOS/IC3.
    Trả về định dạng Markdown chân thực, dễ đọc, có các icon và mẹo thực chiến.
  `,
  getExamTips: (subject: string) => `
    Chia sẻ 5 mẹo thực chiến quan trọng nhất để đạt điểm cao trong kỳ thi ${subject} (MOS/IC3).
    Tập trung vào cách quản lý thời gian và các lỗi thường gặp.
    Trả về định dạng Markdown.
  `,
  explainQuestion: (question: string, answer: string, studentChoice: string) => `
    Giải thích tại sao đáp án "${answer}" là đúng cho câu hỏi: "${question}".
    Người học đã chọn: "${studentChoice}".
    Hãy giải thích một cách dễ hiểu, trực quan như một giáo viên tin học.
    Trả về định dạng Markdown.
  `
};
