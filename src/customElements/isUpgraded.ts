export default function isUpgraded<T extends HTMLElement = HTMLElement>(e: HTMLElement): e is T {
    return e.constructor.name !== "HTMLElement";
}