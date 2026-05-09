export type SwipeDirection = "left" | "right";

export type SwipeEventBody = {
  placeId: string;
  sessionId: string;
  direction: SwipeDirection;
};
