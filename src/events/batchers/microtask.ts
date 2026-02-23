import createBatcher from "./core/createBatcher";

const microtask = createBatcher(queueMicrotask);
export default microtask;