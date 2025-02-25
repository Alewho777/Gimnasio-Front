import { Card, CardContent, Typography, Box } from "@mui/material";

import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number | ReactNode;
    icon: ReactNode;
    backgroundcolor: string;
    colorForent: string;
    iconColor: string;
    width: string;
    subtitle: string;
}
const StatCard = ({ title, value, icon, backgroundcolor, colorForent, iconColor, width, subtitle }: StatCardProps) => {
    return (
        <Card
            sx={{
                background: backgroundcolor,
                color: colorForent,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                width: width,
            }}
        >
            
            <CardContent>
                {/* Icono y botón de opciones */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}

                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: iconColor,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography fontSize={20} sx={{ opacity: 0.8,cursor: 'default' }}>
                    {title}
                </Typography>
                </Box>

                {/* Valor */}
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2, cursor: 'default' }}>
                    {value}
                </Typography>

                {/* Título */}
                <Typography variant="subtitle1" sx={{ opacity: 0.8, cursor: 'default' }}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatCard;
