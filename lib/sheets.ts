import { google } from "googleapis";

function normalizePrivateKey(raw: string) {
  let key = raw.trim();

  // Alguém pode colar o valor inteiro do JSON, aspas incluídas, por engano.
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  // O valor no JSON usa \n literais (barra + n) para as quebras de linha internas da
  // chave; painéis de variáveis de ambiente às vezes preservam isso como texto puro.
  key = key.replace(/\\n/g, "\n").trim();

  if (!key.includes("BEGIN PRIVATE KEY") || !key.includes("END PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_SHEETS_PRIVATE_KEY não parece ser uma chave privada válida (faltam os marcadores " +
        "-----BEGIN PRIVATE KEY----- / -----END PRIVATE KEY-----). Copie de novo o valor do " +
        'campo "private_key" do JSON da conta de serviço, sem as aspas ao redor.'
    );
  }

  return key;
}

function getCredentials() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID?.trim();

  if (!clientEmail || !privateKeyRaw || !sheetId) {
    throw new Error(
      "Configuração do Google Sheets ausente. Defina GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY e GOOGLE_SHEETS_SHEET_ID."
    );
  }

  const privateKey = normalizePrivateKey(privateKeyRaw);

  return { clientEmail, privateKey, sheetId };
}

function getSheetsClient() {
  const { clientEmail, privateKey, sheetId } = getCredentials();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

/**
 * Appends a single row to the given tab of the wedding's Google Sheet, using a service
 * account. The sheet must be shared with the service account's email as an Editor.
 */
export async function appendRow(sheetTabName: string, values: (string | number)[]) {
  const { sheets, sheetId } = getSheetsClient();

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

/**
 * Reads all rows (excluding the header row) from the given tab of the wedding's Google
 * Sheet.
 */
export async function readRows(sheetTabName: string): Promise<string[][]> {
  const { sheets, sheetId } = getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetTabName}!A:Z`,
  });

  const rows = res.data.values ?? [];
  return rows.slice(1).map((row) => row.map((cell) => String(cell ?? "")));
}
