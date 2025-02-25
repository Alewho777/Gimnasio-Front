import React, { ReactNode } from "react";
import { Modal, Box, Typography, Button, CircularProgress } from "@mui/material";

interface ModalEliminarProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isloading: ReactNode;
}

const ModalEliminar: React.FC<ModalEliminarProps> = ({ open, onClose, onConfirm, itemName, isloading }) => {
    return (
        <Modal open={open} onClose={(_event,reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                onClose();
            }
        }} disableEscapeKeyDown>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper",
                boxShadow: 24, p: 4, borderRadius: 2
            }}>
                <Typography variant="h6" sx={{cursor: 'default'}}>¿Estás seguro de eliminar {itemName}?</Typography>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button variant="contained" color="error" disabled={!!isloading} onClick={onConfirm}>{isloading ? <CircularProgress/>:'Eliminar'}</Button>
                    <Button variant="outlined" disabled={!!isloading} onClick={onClose}>Cancelar</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalEliminar;
