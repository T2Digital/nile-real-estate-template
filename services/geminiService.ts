
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { Property } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const recommendPropertiesTool: FunctionDeclaration = {
  name: "recommend_properties",
  description: "Displays visual property cards to the user. Use this whenever you want to suggest specific properties.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      propertyIds: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Array of Property IDs to display as cards" 
      }
    },
    required: ["propertyIds"]
  }
};

const askMultipleChoiceTool: FunctionDeclaration = {
  name: "ask_multiple_choice",
  description: "Asks the user a question with specific selectable options (buttons). Use this to guide the user (e.g., asking for property type, then location).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The text question to display" },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of options for the user to click (e.g. ['شقة', 'فيلا'])"
      }
    },
    required: ["question", "options"]
  }
};

const showBookingFormTool: FunctionDeclaration = {
  name: "show_booking_form",
  description: "Displays an inline booking form in the chat. Call this when the user expresses interest in booking a viewing.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      propertyId: { type: Type.STRING, description: "The ID of the property to book (optional, defaults to last shown)" }
    }
  }
};

export const createChatSession = (currentProperties: Property[]): Chat => {
  // Helper to format properties for the AI context dynamically
  const propertiesContext = currentProperties.map(p => 
    `ID: ${p.id} | Title: ${p.title} | Type: ${p.type} | Loc: ${p.location} | Price: ${p.price} | Bed: ${p.bedrooms}`
  ).join('\n');

  const systemInstruction = `
  You are "NileBot", the intelligent consultant for "Nile Real Estate".
  Your goal is to guide the user to find a property and book a viewing using an INTERACTIVE flow.
  Speak "High-end Egyptian Arabic" (عامية راقية).

  **Inventory:**
  ${propertiesContext}

  **Interaction Flow (Strictly Follow):**
  1.  **Start:** If the user says "Hi" or starts, welcome them and IMMEDIATELY use \`ask_multiple_choice\` to ask what they are looking for. Options: ['شقة', 'فيلا', 'دوبلكس', 'بنتهاوس'].
  2.  **Location:** Once they pick a type, use \`ask_multiple_choice\` to ask for location. Options: ['الشيخ زايد', 'القاهرة الجديدة', 'العاصمة الإدارية', 'المعادي'].
  3.  **Results:** Based on Type and Location, find matching properties.
      - If matches found: Call \`recommend_properties\` with **ALL** matching property IDs from the Inventory. **CRITICAL: Do not filter arbitrarily. If 5 properties match, return all 5 IDs.** Then ask if they want to book a viewing using \`ask_multiple_choice\` with options ['حجز معاينة', 'بحث آخر'].
      - If no matches: Apologize politely and offer to show general recommendations or all properties.
  4.  **Booking:** If they click 'حجز معاينة' or say they want to book, call \`show_booking_form\`. DO NOT ask for details (name/phone) in text, let the form handle it.
  5.  **Conclusion:** After the form is shown, wait. (The frontend handles the success message).

  **Rules:**
  - Do NOT describe properties in text unless asked specifically. Use the visual cards.
  - Do NOT ask for booking details via text. Use the form tool.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [recommendPropertiesTool, askMultipleChoiceTool, showBookingFormTool] }],
    }
  });
};
