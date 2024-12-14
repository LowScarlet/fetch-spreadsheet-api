import { NextResponse } from "next/server";

// Define the shape of the response
interface GoogleSheetResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

export async function GET() {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const SHEET_NAME = process.env.SHEET_NAME;
  const API_KEY = process.env.GOOGLE_API_KEY;
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data from Google Sheets");
    }

    const data: GoogleSheetResponse = await response.json();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
