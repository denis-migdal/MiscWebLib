export default interface REvent {
    listen  (callback: () => void): void;
    unlisten(callback: () => void): void;
}