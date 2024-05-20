import { type NSData, fetch, loopBreak, showHUD } from "marginnote"
import lang from "./lang"
import type { BaiduOCRError } from "./typings"

export async function getBaiduToken() {
  const { lastGetToken, baiduToken } = self.globalProfile.additional.autoocr
  const { baiduApiKey, baiduSecretKey } = self.globalProfile.autoocr
  if (baiduToken && Date.now() - lastGetToken < 2500000000) return baiduToken
  if (!baiduApiKey) throw lang.baidu_api_key.no_baidu_api_key
  if (!baiduSecretKey) throw lang.baidu_secret_key.no_baidu_secret_key
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
  if (!mathpixAppKey) throw lang.mathpix_app_key.no_mathpix_key
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

export async function simpleTexOCR(imgBase64: string, img: NSData) {
  const { simpleTexApiKey } = self.globalProfile.autoocr
  if (!simpleTexApiKey) throw lang.simpletex_api_key.no_simpletex_key
  const url =
    "https://server.simpletex.cn/api/" +
    ["latex_ocr", "latex_ocr_turbo"][
      self.globalProfile.autoocr.simpleTexModel[0]
    ]
  const res = (await fetch(url, {
    method: "POST",
    timeout: 30,
    headers: {
      token: simpleTexApiKey
    },
    multipartForm: {
      file: {
        data: img,
        filename: "image.jpg",
        filetype: "image/jpeg"
      },
      rec_mode: "formula",
      enable_img_rot: true
    }
  }).then(res => res.json())) as {
    res: {
      latex: string
    }
  } & {
    err_info: {
      err_msg: string
    }
  }
  if (res.err_info) throw `SimpleTex: ${res.err_info.err_msg}`
  return res.res.latex
}

async function getDoc2xToken() {
  const { doc2xApiKey } = self.globalProfile.autoocr
  if (!doc2xApiKey) throw lang.doc2x_api_key.no_doc2x_key
  const { doc2xTokenLastGet, doc2xToken } = self.globalProfile.additional
  // 每天刷新
  if (doc2xToken && Date.now() - doc2xTokenLastGet < 100000000)
    return doc2xToken
  const res = await fetch("https://api.doc2x.noedgeai.com/api/token/refresh", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + doc2xApiKey
    }
  }).then(res => res.json())
  if (res.code !== "success") throw `Doc2X: ${res.msg}`
  self.globalProfile.additional.doc2xToken = res.data.token
  self.globalProfile.additional.doc2xTokenLastGet = Date.now()
  return res.data.token
}

async function getDoc2xResutlt(uuid: string, token: string) {
  let res: any
  const status = await loopBreak(20, 0.5, async function () {
    res = await fetch("https://api.doc2x.noedgeai.com/api/v1/async/status", {
      headers: {
        Authorization: "Bearer " + token
      },
      search: {
        uuid
      }
    }).then(res => res.json())
    return res.code === "success" && res.data.progress === 100
  })
  if (!status) throw `Doc2X: Timeout`
  return res.data.result.pages[0].md
    .replace(/(\\\[\s?)|(\s?\\\])/g, "$$")
    .replace(/(\\\(\s?)|(\s?\\\))/g, "$")
}

export async function doc2xOCR(imgBase64: string, img: NSData) {
  const token = await getDoc2xToken()
  const res = (await fetch(
    "https://api.doc2x.noedgeai.com/api/platform/async/img",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      timeout: 30,
      multipartForm: {
        file: {
          data: img,
          filename: "image.jpg",
          filetype: "image/jpeg"
        },
        equation: false,
        img_correction: true
      }
    }
  ).then(res => res.json())) as {
    code: string
    data: {
      uuid: string
    }
    msg: string
  }
  if (res.code !== "success") throw `Doc2X: ${res.msg}`
  return await getDoc2xResutlt(res.data.uuid, token)
}

export async function QRCodeOCR(imgBase64: string) {
  const token = await getBaiduToken()
  const res = (await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/qrcode?access_token=${token}`,
    {
      method: "POST",
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

export async function baiduFormulaOCR(imgBase64: string, img: NSData) {
  const token = await getBaiduToken()
  const res = (await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/formula?access_token=${token}`,
    {
      method: "POST",
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
