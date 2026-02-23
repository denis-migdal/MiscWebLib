import createBatcher from "./createBatcher";

const animationFrame = createBatcher( requestAnimationFrame );
export default animationFrame;