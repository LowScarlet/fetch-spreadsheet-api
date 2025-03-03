export async function GET() {
  return NextResponse.json({
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    SHEET_NAME: process.env.SHEET_NAME,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  });
}
