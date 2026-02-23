import createBatcher from "./createBatcher";

const macrotask = createBatcher( setTimeout);
export default macrotask;