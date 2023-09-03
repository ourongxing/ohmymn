import { isNSNull } from "marginnote"
import { Addon } from "~/addon"

export function dragOverlay() {
  const view = new UIView({
    x: 0,
    y: 0,
    width: 0,
    height: MN.isMac ? 30 : 50
  })
  view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0)
  view.addSubview(closeButton())
  return view
}

function closeButton() {
  const view = UIButton.buttonWithType(0)
  view.frame = {
    x: -30,
    y: 2,
    width: 25,
    height: 25
  }
  const name = "close"
  if (!Addon.imagesCache.has(name)) {
    const data = NSData.dataWithContentsOfFile(Addon.path + `/icon/${name}.png`)
    Addon.imagesCache.set(
      name,
      isNSNull(data) ? undefined : UIImage.imageWithDataScale(data, 2)
    )
  }
  const img = Addon.imagesCache.get(name)
  if (img) view.setImageForState(img, 0)
  view.autoresizingMask = (1 << 0) | (1 << 3)
  view.layer.cornerRadius = 8
  view.layer.masksToBounds = true
  view.adjustsImageWhenHighlighted = false
  view.addTargetActionForControlEvents(self, "clickCloseButton:", 1 << 6)
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
