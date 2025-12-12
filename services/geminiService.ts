import { GoogleGenAI } from "@google/genai";

// Check for API key in Vite environment variables or fallback to process.env
// The 'as any' cast avoids TypeScript errors if types aren't fully set up for import.meta
const apiKey = (import.meta as any).env?.VITE_API_KEY || (process as any).env?.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the elderly support assistant
const SUPPORT_SYSTEM_INSTRUCTION = `
你是「銀髮緣」App 的智能客服助手。你的服務對象是年長者。
請遵循以下原則：
1. 說話語氣要非常親切、有禮貌、耐心，像對待家裡的長輩一樣。
2. 答案要簡潔明瞭，避免使用複雜的科技術語。
3. 如果使用者遇到問題，請一步一步引導他們。
4. 永遠保持鼓勵的態度。
`;

export const sendSupportMessage = async (history: { role: string; text: string }[], newMessage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct prompt history manually for simplicity in this function
    let prompt = SUPPORT_SYSTEM_INSTRUCTION + "\n\n對話記錄:\n";
    history.forEach(msg => {
      prompt += `${msg.role === 'user' ? '使用者' : '客服'}: ${msg.text}\n`;
    });
    prompt += `使用者: ${newMessage}\n客服:`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "抱歉，我現在無法回答，請稍後再試。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "系統暫時繁忙，請檢查您的網路連線。";
  }
};

export const processVoiceCommand = async (audioBase64: string): Promise<{ text: string, reply: string }> => {
  try {
    const model = 'gemini-2.5-flash-native-audio-preview-09-2025'; // Use a model capable of audio understanding

    // We ask Gemini to transcribe user intent and provide a helpful response
    const prompt = `
    這是一個針對高齡者的交友App語音助理。
    請聽使用者的語音，並做兩件事：
    1. 理解使用者的意圖（例如：想找人聊天、想找社團、想問如何使用）。
    2. 給予一個簡短、溫暖的回應。
    
    請以 JSON 格式回傳，格式如下：
    {
      "userIntent": "使用者的意圖摘要",
      "reply": "給使用者的回應"
    }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav", // Assuming WAV from recorder
              data: audioBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsed = JSON.parse(resultText);
    return {
      text: parsed.userIntent,
      reply: parsed.reply
    };

  } catch (error) {
    console.error("Voice Processing Error:", error);
    return {
      text: "無法辨識語音",
      reply: "抱歉，我聽不太清楚，請您再試一次。"
    };
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash'; 
    const prompt = "請將這段語音精準轉成繁體中文文字。";

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    return "";
  }
};