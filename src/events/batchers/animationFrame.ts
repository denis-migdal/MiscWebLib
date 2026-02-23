import createBatcher from "./core/createBatcher";

const animationFrame = createBatcher( requestAnimationFrame );
export default animationFrame;