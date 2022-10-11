export function NSValue2String(v: NSValue) {
  return Database.transArrayToJSCompatible([v])[0] as string
}

export function CGRectString2CGRect(s: string): CGRect {
  // {{116, 565}, {11, 15}}
  // {x,y}, {h,w}
  const arr = s.match(/\d+/g)!.map(k => Number(k))
  return {
    x: arr[0],
    y: arr[1],
    height: arr[2],
    width: arr[3]
  }
}

export function CGSizeString2CGSize(s: string): CGSize {
  const arr = s.match(/\d+/g)!.map(k => Number(k))
  return {
    width: arr[0],
    height: arr[1]
  }
}

export function CGSizeValue2CGSize(v: NSValue) {
  return CGSizeString2CGSize(NSValue2String(v))
}

export function CGRectValue2CGRect(v: NSValue) {
  return CGRectString2CGRect(NSValue2String(v))
}
