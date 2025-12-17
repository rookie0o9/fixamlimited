"use server";
import { generateAvatar } from "@/lib/avatars";
import { auth, sheets } from "@googleapis/sheets";
import { cache } from "react";

function loadCredentials() {
  const encodedCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!encodedCredentials) {
    console.warn("GOOGLE_APPLICATION_CREDENTIALS not set. Falling back to dummy feedbacks.");
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(encodedCredentials, "base64").toString().replace(/\n/g, "")
    );
  } catch (error) {
    console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", error);
    return null;
  }
}

const credential = loadCredentials();

const sheetsAuth = credential
  ? new auth.GoogleAuth({
      credentials: credential,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
  : null;

const sheetsGetResponses = cache(
  async (spreadsheetId: string, range: string) => {
    try {
      if (!sheetsAuth) return [];

      const response = await sheets("v4").spreadsheets.values.get({
        auth: sheetsAuth,
        spreadsheetId,
        range,
      });
      const values = response.data.values;
      if (!values) return [];

      return (values as string[][])
        .map((response) => ({
          avatar: generateAvatar(response[4]),
          name: response[4],
          position: response[6],
          feedback: response[2],
          isValid: response[7] === "TRUE",
        }))
        .filter((response) => response.isValid);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
);

function generateDummyFeedbacks(count: number = 3) {
  const users = [
    "Jane Forbes",
    "Peter Maze",
    "Claude Mae",
    "Sinclair Kerry",
    "John Kimali",
    "Lucy Falcao",
  ];
  const positions = [
    "Business Owner",
    "IT Manager",
    "Office Administrator",
    "Freelancer",
    "Student",
  ];
  const feedbacks = [
    "Excellent service! Fixed my laptop in no time.",
    "Very professional and knowledgeable team. Highly recommended!",
    "Saved our company's data after a critical system failure. Lifesavers!",
    "Quick response time and efficient problem-solving. Great IT support.",
    "Affordable and reliable. Will definitely use their services again.",
    "Helped set up our entire office network. Smooth and hassle-free experience.",
  ];

  return Array.from({ length: count }, (_, i) => ({
    avatar: generateAvatar(`${users[i]}`),
    name: `${users[i]}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    feedback: feedbacks[i % feedbacks.length],
    isValid: true,
  }));
}

export async function sheetsGetFeedbacks() {
  try {
    if (!sheetsAuth) {
      return generateDummyFeedbacks();
    }

    const sheetId = process.env.FEEDBACK_FORM_SHEET_ID;
    if (!sheetId) {
      console.warn("FEEDBACK_FORM_SHEET_ID not set. Falling back to dummy feedbacks.");
      return generateDummyFeedbacks();
    }

    const formResponses = await sheetsGetResponses(sheetId, "Form Responses 1!A2:I");
    const responses =
      formResponses.length >= 3
        ? formResponses.slice(0, 3)
        : [
            ...formResponses,
            ...generateDummyFeedbacks(3 - formResponses.length),
          ];

    return responses;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return generateDummyFeedbacks(); // Fallback to dummy data in case of an error
  }
}
