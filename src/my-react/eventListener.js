export function addEventCaptureListener(container, domEventName, listener) {
  container.addEventListener(domEventName, listener, true);
}

export function addEventBubbledEventListener(
  container,
  domEventName,
  listener
) {
  container.addEventListener(domEventName, listener, false);
}
