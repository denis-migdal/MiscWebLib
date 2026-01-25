export default interface REvent {
    addListener   (callback: () => void): void;
    removeListener(callback: () => void): void;
}