const ROUTE_MOTION = {
  forward: "route-motion-forward",
  back: "route-motion-back",
};

let pendingDirection = "forward";

export function requestRouteMotion(direction) {
  pendingDirection = direction === "back" ? "back" : "forward";
}

export function consumeRouteMotion() {
  const motion = ROUTE_MOTION[pendingDirection] || ROUTE_MOTION.forward;
  pendingDirection = "forward";
  return motion;
}

export { ROUTE_MOTION };
