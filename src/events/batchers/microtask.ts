import createBatcher from "./createBatcher";

const microtask = createBatcher(queueMicrotask);
export default microtask;