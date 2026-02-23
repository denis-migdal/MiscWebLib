import LockGuard from "../../../guards/LockGuard";

export default function createBatcher(scheduler: (callback: () => void) => void) {

    return (callback: () => void) => {

        const guard = new LockGuard();

        const trigger = () => {
            try {
                callback();
            } finally {
                guard.leave();
            }
        }

        return () => {

            if( ! guard.enter() )
                return;

            scheduler( trigger );
        }
    }

}