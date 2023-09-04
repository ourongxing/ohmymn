import { CGRect, isNSNull } from "marginnote"
import { Addon } from "~/addon"
import { closePanel } from "./switchPanel"

export function dragOverlay() {
  const view = new UIView({
    x: 0,
    y: 0,
    width: 0,
    height: MN.isMac ? 30 : 50
  })
  view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0)
  const closeButton = initButton(
    "close",
    { x: -30, y: 2, width: 25, height: 25 },
    "onCloseButtonClick"
  )
  closeButton.adjustsImageWhenHighlighted = false
  view.addSubview(closeButton)
  return view
}

export function onCloseButtonClick() {
  closePanel()
}

export function initButton(iconName: string, frame: CGRect, handler: string) {
  const view = UIButton.buttonWithType(0)
  view.frame = {
    ...frame
  }
  if (!Addon.imagesCache.has(iconName)) {
    const data = NSData.dataWithContentsOfFile(
      Addon.path + `/icon/${iconName}.png`
    )
    Addon.imagesCache.set(
      iconName,
      isNSNull(data) ? undefined : UIImage.imageWithDataScale(data, 2)
    )
  }
  const img = Addon.imagesCache.get(iconName)
  if (img) view.setImageForState(img, 0)
  view.autoresizingMask = (1 << 0) | (1 << 3)
  view.layer.cornerRadius = 8
  view.layer.masksToBounds = true
  // view.adjustsImageWhenHighlighted = false
  view.addTargetActionForControlEvents(self, handler + ":", 1 << 6)
  return view
}

export function stretchOverlay() {
  const height = 20
  const view = new UIView({
    x: 0,
    width: 0,
    height,
    y: 0
  })
  view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0)
  return view
}
