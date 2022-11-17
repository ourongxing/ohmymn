import { fetch, showHUD } from "marginnote"
import lang from "./lang"
import type { BaiduOCRError } from "./typings"

export async function getBaiduToken() {
  const { lastGetToken, baiduToken } = self.globalProfile.additional.autoocr
  const { baiduApiKey, baiduSecretKey } = self.globalProfile.autoocr
  if (baiduToken && Date.now() - lastGetToken < 2592000000) return baiduToken
  if (!baiduApiKey) throw lang.no_baidu_api_key
  if (!baiduSecretKey) throw lang.no_baidu_secret_key
  const res = (await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${baiduApiKey}&client_secret=${baiduSecretKey}`
  ).then(res => res.json())) as { access_token: string }
  if (!res.access_token) throw lang.baidu_token_error
  self.globalProfile.additional.autoocr = {
    lastGetToken: Date.now(),
    baiduToken: res.access_token
  }
  return res.access_token
}
export async function mathpixOCR(imgBase64: string) {
  const { mathpixAppKey } = self.globalProfile.autoocr
  if (!mathpixAppKey) throw lang.no_mathpix_key
  const res = (await fetch("https://api.mathpix.com/v3/latex", {
    method: "POST",
    headers: {
      app_key: mathpixAppKey
    },
    json: {
      src: "data:image/jpg;base64," + imgBase64,
      formats: ["latex_styled"],
      ocr: ["math", "text"]
    }
  }).then(res => res.json())) as {
    latex_styled: string
  } & {
    error: string
  }
  if (res.error) throw `Mathpix: ${res.error}`
  return res.latex_styled
}

export async function QRCodeOCR(imgBase64: string) {
  const token = await getBaiduToken()
  const res = (await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/qrcode?access_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        image: imgBase64
      }
    }
  ).then(res => res.json())) as {
    codes_result: { text: string }[]
  } & BaiduOCRError
  if (res.error_code && res.error_msg)
    throw `${res.error_code}: ${res.error_msg}`
  return res.codes_result.map(k => k.text).join("")
}

export async function baiduFormulaOCR(imgBase64: string) {
  const token = await getBaiduToken()
  const res = (await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/formula?access_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        image: imgBase64
      }
    }
  ).then(res => res.json())) as {
    words_result: { words: string }[]
  } & BaiduOCRError
  if (res.error_code && res.error_msg)
    throw `Baidu OCR：${res.error_code} ${res.error_msg}`
  return res.words_result.map(k => k.words).join("")
}

export async function baiduHandWrittingOCR(imgBase64: string) {
  const token = await getBaiduToken()
  const res = (await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        image: imgBase64
      }
    }
  ).then(res => res.json())) as {
    words_result: { words: string }[]
  } & BaiduOCRError
  if (res.error_code && res.error_msg)
    throw `${res.error_code}: ${res.error_msg}`
  return res.words_result.map(k => k.words).join("")
}

export async function mainOCR(imgBase64: string) {
  try {
    const langKey = [
      "auto_detect",
      "CHN_ENG",
      "ENG",
      "JAP",
      "KOR",
      "FRE",
      "SPA",
      "POR",
      "GER",
      "ITA",
      "RUS",
      "DAN",
      "DUT",
      "MAL",
      "SWE",
      "IND",
      "POL",
      "ROM",
      "TUR",
      "GRE",
      "HUN"
    ]
    const token = await getBaiduToken()
    const res = (await fetch(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          image: imgBase64,
          language_type: langKey[self.globalProfile.autoocr.lang[0]]
        }
      }
    ).then(res => res.json())) as {
      words_result: { words: string }[]
    } & BaiduOCRError
    if (res.error_code && res.error_msg)
      throw `${res.error_code}: ${res.error_msg}`
    return res.words_result
      .map(k => (/[.。;；·?？！!]$/.test(k.words) ? k.words + "\n" : k.words))
      .join("")
  } catch (err) {
    showHUD(String(err))
  }
}
