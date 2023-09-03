import { CGRect, isNSNull } from "marginnote"
import { Addon } from "~/addon"

export function dragOverlay(frame: CGRect) {
  const view = new UIView({
    ...frame,
    height: MN.isMac ? 30 : 50
  })
  view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0)
  view.addSubview(closeButton())
  return view
}

function closeButton() {
  const view = UIButton.buttonWithType(0)
  view.frame = {
    x: MN.isMac ? 290 : -25,
    y: 5,
    width: 20,
    height: 20
  }
  const image = NSData.dataWithContentsOfFile(Addon.path + `/icon/close.png`)
  if (!isNSNull(image)) {
    view.setImageForState(UIImage.imageWithDataScale(image, 2), 0)
  }
  view.autoresizingMask = (1 << 0) | (1 << 3)
  view.layer.cornerRadius = 8
  view.layer.masksToBounds = true
  view.adjustsImageWhenHighlighted = false
  view.addTargetActionForControlEvents(self, "clickCloseButton:", 1 << 6)
  return view
}

export function stretchOverlay(frame: CGRect) {
  const height = 20
  const view = new UIView({
    ...frame,
    height,
    y: frame.y + frame.height - height / 2
  })
  view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0)
  return view
}
