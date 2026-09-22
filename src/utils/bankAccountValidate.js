/**
 * 美国提现账户类型校验（TinyPay / addBankCard）
 * Card / ACH 需额外传 ifscCard；PayPal / Cash App / Chime 不传。
 * Cash App / Chime：账号必须以 $ 开头（无则补上，有则不重复）。
 */

export function normalizeBankType(bankName) {
  const raw = String(bankName || "").toLowerCase();
  const n = raw.replace(/[\s_-]+/g, "");
  if (!n) return "other";
  if (/\bach\b/.test(raw) || n === "ach") return "ach";
  if (n.includes("paypal")) return "paypal";
  if (n.includes("cashapp") || n === "cash") return "cashapp";
  if (n.includes("chime")) return "chime";
  // Card / Debit Card / Credit Card
  if (n.includes("card") || n === "visa" || n === "mastercard") return "card";
  return "other";
}

export function needsIfscCard(bankName) {
  const t = normalizeBankType(bankName);
  return t === "card" || t === "ach";
}

export function needsDollarPrefix(bankName) {
  const t = normalizeBankType(bankName);
  return t === "cashapp" || t === "chime";
}

/** Card: MM/YYYY，如 12/2028 */
export function isValidCardExpiry(value) {
  const v = String(value || "").trim();
  if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(v)) return false;
  const [mm, yyyy] = v.split("/");
  const month = Number(mm);
  const year = Number(yyyy);
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;
  if (year < curY) return false;
  if (year === curY && month < curM) return false;
  return true;
}

/** ACH: 9 位 routing number */
export function isValidAchRouting(value) {
  return /^\d{9}$/.test(String(value || "").trim());
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

/**
 * Cash App / Chime：统一成单个 $ + 字母数字
 * 无 $ 则补；已有 $ 不重复
 */
export function ensureDollarCashtag(raw) {
  let s = String(raw || "").trim();
  // 去掉所有前导 $，再只保留一个
  s = s.replace(/^\$+/, "");
  // 用户名仅字母数字
  s = s.replace(/[^A-Za-z0-9]/g, "");
  if (!s) return "";
  return `$${s}`;
}

/** 输入过程中：只保留用户名（字母数字），$ 由 UI 前缀展示，避免光标错位 */
export function formatCashtagBodyInput(raw) {
  return String(raw || "")
    .replace(/^\$+/, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 32);
}

/** @deprecated 使用 formatCashtagBodyInput + UI 前缀；提交仍用 ensureDollarCashtag */
export function formatCashtagInput(raw) {
  const body = formatCashtagBodyInput(raw);
  if (!body) return "";
  return `$${body}`;
}

/** $ + 至少 1 位字母数字，如 $JohnSmith / $abc123 */
export function isValidCashtag(value) {
  return /^\$[A-Za-z0-9]{1,32}$/.test(String(value || "").trim());
}

/** 输入卡到期日时自动补 / */
export function formatCardExpiryInput(raw) {
  const digits = String(raw || "")
    .replace(/\D/g, "")
    .slice(0, 6);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatAchRoutingInput(raw) {
  return String(raw || "")
    .replace(/\D/g, "")
    .slice(0, 9);
}

/** 真实姓名：仅英文大小写字母与空格，禁止数字及其他字符 */
export function formatRealNameInput(raw) {
  return String(raw || "")
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 64);
}

export function isValidRealName(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  return /^[a-zA-Z\s]+$/.test(v);
}

/**
 * @returns {{ ok: boolean, messageKey?: string, message?: string }}
 */
export function validateAddAccountForm({
  realName,
  bankName,
  bankCard,
  ifscCard,
}) {
  const name = formatRealNameInput(realName);
  if (!name) {
    return {
      ok: false,
      messageKey: "common_txt46",
      message: "Please enter Real Name",
    };
  }
  if (!isValidRealName(name)) {
    return {
      ok: false,
      messageKey: "account_realname_invalid",
      message: "Real name can only contain letters and spaces",
    };
  }
  if (!String(bankName || "").trim()) {
    return {
      ok: false,
      messageKey: "bank_select_required",
      message: "Please select account type",
    };
  }

  const type = normalizeBankType(bankName);
  let account = String(bankCard || "").trim();

  if (needsDollarPrefix(bankName)) {
    account = ensureDollarCashtag(account);
  }

  if (!account || account === "$") {
    return {
      ok: false,
      messageKey: "BankInfo_txt16",
      message: "Please enter your phone number, email, or bank card number",
    };
  }

  if (type === "paypal") {
    if (!isValidEmail(account)) {
      return {
        ok: false,
        messageKey: "account_paypal_invalid",
        message: "Please enter a valid PayPal email",
      };
    }
  } else if (type === "card") {
    const digits = account.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      return {
        ok: false,
        messageKey: "account_card_invalid",
        message: "Please enter a valid bank card number",
      };
    }
  } else if (type === "ach") {
    const digits = account.replace(/\D/g, "");
    if (digits.length < 4 || digits.length > 17) {
      return {
        ok: false,
        messageKey: "account_ach_invalid",
        message: "Please enter a valid bank account number",
      };
    }
  } else if (type === "cashapp" || type === "chime") {
    if (!isValidCashtag(account)) {
      return {
        ok: false,
        messageKey: "account_cashtag_invalid",
        message: "Format: $Username (e.g. $JohnSmith, $abc123)",
      };
    }
  }

  if (needsIfscCard(bankName)) {
    const extra = String(ifscCard || "").trim();
    if (type === "card") {
      if (!extra) {
        return {
          ok: false,
          messageKey: "account_expiry_required",
          message: "Please enter card expiry (MM/YYYY)",
        };
      }
      if (!isValidCardExpiry(extra)) {
        return {
          ok: false,
          messageKey: "account_expiry_invalid",
          message: "Invalid expiry format, use MM/YYYY (e.g. 12/2028)",
        };
      }
    }
    if (type === "ach") {
      if (!extra) {
        return {
          ok: false,
          messageKey: "account_routing_required",
          message: "Please enter 9-digit routing number",
        };
      }
      if (!isValidAchRouting(extra)) {
        return {
          ok: false,
          messageKey: "account_routing_invalid",
          message: "Routing number must be 9 digits",
        };
      }
    }
  }

  return { ok: true };
}

/** 组装 addBankCard 请求体：仅 Card/ACH 带 ifscCard；Cash App/Chime 保证 $ 前缀 */
export function buildAddBankCardPayload({
  bankName,
  bankId,
  bankCard,
  realName,
  ifscCard,
}) {
  let account = String(bankCard || "").trim();
  if (needsDollarPrefix(bankName)) {
    account = ensureDollarCashtag(account);
  }
  const params = {
    bankName,
    bankId,
    bankCard: account,
    realName: formatRealNameInput(realName),
  };
  if (needsIfscCard(bankName)) {
    params.ifscCard = String(ifscCard || "").trim();
  }
  return params;
}
