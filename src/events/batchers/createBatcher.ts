export default function createBatcher(scheduler: (callback: () => void) => void) {

    return (callback: () => void) => {

        let pending = false;

        const trigger = () => {
            try {
                callback();
            } finally {
                pending = false;
            }
        }

        return () => {

            if( pending === true )
                return;
            pending = true;

            scheduler( trigger );
        }
    }

}