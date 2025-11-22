const MIN_AGE = 8;
const MAX_AGE = 14;
const SHEET_NAME = 'KidsApplications';
const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const ADMIN_EMAIL = SCRIPT_PROPERTIES.getProperty('ADMIN_EMAIL') || 'demoteamandermatt@gmail.com';
const SITE_URL = 'https://demo.amatt.ch';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (!e || !e.parameter) {
      return jsonResponse({ success: false, error: 'NO_DATA' });
    }

    const data = {
      child_name: e.parameter.child_name || '',
      child_ahv: e.parameter.child_ahv || '',
      child_dob: e.parameter.child_dob || '',
      child_allergies: e.parameter.child_allergies || '',
      child_motivation: e.parameter.child_motivation || '',
      parent_name: e.parameter.parent_name || '',
      parent_email: e.parameter.parent_email || '',
      parent_phone: e.parameter.parent_phone || '',
      parent_address: e.parameter.parent_address || '',
      lang: (e.parameter.lang || 'de').toLowerCase() === 'en' ? 'en' : 'de'
    };

    const age = calculateAge(data.child_dob);
    if (age === null) {
      return jsonResponse({ success: false, error: 'INVALID_DOB' });
    }
    if (age < MIN_AGE || age > MAX_AGE) {
      return jsonResponse({ success: false, error: 'AGE_OUT_OF_RANGE', age, minAge: MIN_AGE, maxAge: MAX_AGE });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.error(`Sheet "${SHEET_NAME}" not found. Application data cannot be saved.`);
      return jsonResponse({ success: false, error: 'SERVER_ERROR', message: 'A configuration error occurred.' });
    }
    sheet.appendRow([
      new Date(),
      data.child_name,
      data.child_ahv,
      data.child_dob,
      age,
      data.child_allergies,
      data.child_motivation,
      data.parent_name,
      data.parent_email,
      data.parent_phone,
      data.parent_address,
      data.lang
    ]);

    sendParentEmail(data, age);
    sendAdminEmail(data, age);

    return jsonResponse({ success: true, age });
  } catch (err) {
    console.error('Error in doPost:', err);
    return jsonResponse({ success: false, error: 'SERVER_ERROR', message: 'An unexpected server error occurred.' });
  } finally {
    lock.releaseLock();
  }
}

function calculateAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function formatDateCH(dobString) {
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return dobString;
  return Utilities.formatDate(dob, Session.getScriptTimeZone(), 'dd.MM.yyyy');
}

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

function sendParentEmail(data, age) {
  const isEn = data.lang === 'en';
  const subject = isEn ? 'Your application for the jr.DTA Team' : 'Deine Anmeldung fuers jr.DTA Team';
  const greeting = isEn ? 'Hi' : 'Hallo';
  const bodyIntro = isEn
    ? 'We have received your registration for the jr.DTA Team. Below you can review the details you submitted.'
    : 'Wir haben deine Anmeldung für das jr.DTA Team erhalten. Unten findest du eine Zusammenfassung deiner Angaben.';
  const followUp = isEn
    ? 'We will contact you soon with more details about training times, gear, and next steps.'
    : 'Wir melden uns bald mit weiteren Details zu Trainingszeiten, Ausrüstung und den nächsten Schritten.';
  const footer = isEn
    ? 'You are receiving this email because you submitted the jr.DTA application form.'
    : 'Du erhältst diese E-Mail, weil du das jr.DTA Anmeldeformular ausgefüllt hast.';
  const ctaLabel = isEn ? 'Visit Demo Team Andermatt' : 'Zur Demo Team Andermatt Website';

  const htmlBody = `
    <div style="background:#0b0b0f;padding:24px;font-family:Arial,sans-serif;color:#f4f4f5;">
      <div style="max-width:700px;margin:0 auto;border:1px solid #222;border-radius:12px;background:#111217;overflow:hidden;">
        <div style="padding:24px 24px 8px 24px;border-bottom:1px solid #1f2937;">
          <h2 style="margin:0;color:#f97316;font-size:20px;letter-spacing:0.5px;">Demo Team Andermatt Kids</h2>
          <p style="margin:8px 0 0 0;color:#e5e7eb;font-size:14px;">${greeting} ${escapeHtml(data.parent_name || data.child_name)},</p>
        </div>
        <div style="padding:24px;color:#e5e7eb;line-height:1.6;font-size:14px;">
          <p style="margin:0 0 16px 0;">${bodyIntro}</p>
          <div style="background:#161821;border:1px solid #1f2937;border-radius:10px;padding:16px;margin-bottom:16px;">
            <h3 style="margin:0 0 8px 0;color:#f97316;font-size:16px;">${isEn ? 'Child' : 'Kind'}</h3>
            <p style="margin:4px 0;">${isEn ? 'Name' : 'Name'}: <strong>${escapeHtml(data.child_name)}</strong></p>
            <p style="margin:4px 0;">${isEn ? 'Date of Birth' : 'Geburtsdatum'}: <strong>${escapeHtml(formatDateCH(data.child_dob))}</strong> (${age} ${isEn ? 'years' : 'Jahre'})</p>
            <p style="margin:4px 0;">AHV: <strong>${escapeHtml(data.child_ahv)}</strong></p>
            <p style="margin:4px 0;">${isEn ? 'Allergies/Medical' : 'Allergien / Medizinisches'}: ${escapeHtml(data.child_allergies)}</p>
            <p style="margin:4px 0;">${isEn ? 'Motivation' : 'Motivation'}:<br>${escapeHtml(data.child_motivation)}</p>
          </div>
          <div style="background:#161821;border:1px solid #1f2937;border-radius:10px;padding:16px;">
            <h3 style="margin:0 0 8px 0;color:#f97316;font-size:16px;">${isEn ? 'Parent/Guardian' : 'Elternteil/Erziehungsberechtigte*r'}</h3>
            <p style="margin:4px 0;">${isEn ? 'Name' : 'Name'}: <strong>${escapeHtml(data.parent_name)}</strong></p>
            <p style="margin:4px 0;">Email: <strong>${escapeHtml(data.parent_email)}</strong></p>
            <p style="margin:4px 0;">${isEn ? 'Phone' : 'Telefon'}: <strong>${escapeHtml(data.parent_phone)}</strong></p>
            <p style="margin:4px 0;">${isEn ? 'Address' : 'Adresse'}:<br>${escapeHtml(data.parent_address)}</p>
          </div>
          <p style="margin:16px 0 24px 0;">${followUp}</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${SITE_URL}" style="background:#f97316;color:#0b0b0f;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">${ctaLabel}</a>
          </div>
          <p style="margin:0;font-size:12px;color:#9ca3af;">${footer}</p>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.parent_email,
    subject,
    htmlBody,
    name: 'Demo Team Andermatt Kids',
    replyTo: ADMIN_EMAIL
  });
}

function sendAdminEmail(data, age) {
  const htmlBody = `
    <div style="background:#0b0b0f;padding:24px;font-family:Arial,sans-serif;color:#f4f4f5;">
      <div style="max-width:800px;margin:0 auto;border:1px solid #222;border-radius:12px;background:#111217;overflow:hidden;">
        <div style="padding:24px;border-bottom:1px solid #1f2937;">
          <h2 style="margin:0;color:#f97316;font-size:20px;">Neue Kids-Anmeldung: ${escapeHtml(data.child_name)}</h2>
          <p style="margin:8px 0 0 0;color:#e5e7eb;font-size:13px;">Altersrange geprüft: ${MIN_AGE}-${MAX_AGE} Jahre (Server).</p>
        </div>
        <div style="padding:24px;color:#e5e7eb;line-height:1.6;font-size:14px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #1f2937;color:#f97316;font-weight:bold;" colspan="2">Kind</td>
            </tr>
            <tr><td style="padding:6px;color:#9ca3af;">Name</td><td style="padding:6px;">${escapeHtml(data.child_name)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">Geburtsdatum</td><td style="padding:6px;">${escapeHtml(formatDateCH(data.child_dob))} (${age})</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">AHV</td><td style="padding:6px;">${escapeHtml(data.child_ahv)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">Allergien/Medizinisch</td><td style="padding:6px;">${escapeHtml(data.child_allergies)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">Motivation</td><td style="padding:6px;">${escapeHtml(data.child_motivation)}</td></tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #1f2937;color:#f97316;font-weight:bold;" colspan="2">Eltern</td>
            </tr>
            <tr><td style="padding:6px;color:#9ca3af;">Name</td><td style="padding:6px;">${escapeHtml(data.parent_name)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">E-Mail</td><td style="padding:6px;">${escapeHtml(data.parent_email)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">Telefon</td><td style="padding:6px;">${escapeHtml(data.parent_phone)}</td></tr>
            <tr><td style="padding:6px;color:#9ca3af;">Adresse</td><td style="padding:6px;">${escapeHtml(data.parent_address)}</td></tr>
          </table>
          <p style="margin:16px 0 8px 0;font-size:13px;color:#9ca3af;">Direkter Kontakt: <a href="mailto:${escapeHtml(data.parent_email)}" style="color:#f97316;">${escapeHtml(data.parent_email)}</a></p>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `Neue Kids-Anmeldung: ${data.child_name}`,
    htmlBody,
    name: 'Demo Team Andermatt Kids'
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
