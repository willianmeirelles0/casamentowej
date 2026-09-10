import { google } from "googleapis";

function getCredentials() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error(
      "Configuração do Google Sheets ausente. Defina GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY e GOOGLE_SHEETS_SHEET_ID."
    );
  }

  return { clientEmail, privateKey, sheetId };
}

/**
 * Appends a single row to the given tab of the wedding's Google Sheet, using a service
 * account. The sheet must be shared with the service account's email as an Editor.
 */
export async function appendRow(sheetTabName: string, values: (string | number)[]) {
  const { clientEmail, privateKey, sheetId } = getCredentials();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetTabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}
