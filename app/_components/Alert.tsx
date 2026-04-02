import {
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    TriangleAlertIcon,
} from "lucide-react";

type AlertType = "info" | "success" | "warning" | "error";
type AlertStyle = "dash" | "outline" | "soft";

interface AlertProps {
    className?: string;
    type?: AlertType;
    style?: AlertStyle;
    text: string;
}

export default function Alert({ className, type, style, text }: AlertProps) {
    return (
        <div
            role="alert"
            className={`alert ${type && `alert-${type}`} ${style && `alert-${style}`} ${className ?? ""}`}
        >
            {getAlertIcon(type)}
            <span>{text}</span>
        </div>
    );
}
function getAlertIcon(type: AlertType | undefined) {
    switch (type) {
        case "error":
            return <CircleXIcon />;
        case "success":
            return <CircleCheckIcon />;
        case "warning":
            return <TriangleAlertIcon />;
        case "info":
            return <InfoIcon />;
        default:
            return null;
    }
}
