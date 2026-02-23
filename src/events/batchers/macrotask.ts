import createBatcher from "./core/createBatcher";

const macrotask = createBatcher( setTimeout);
export default macrotask;