import { useState } from "react"

const useModalState = () => {
    const [open, setOpen] = useState<boolean>(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return {
        open,
        openModal,
        closeModal,
    };
};

export default useModalState;