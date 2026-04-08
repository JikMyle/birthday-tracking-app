import { useEffect, useState } from "react";
import { IconContainer } from "./IconContainer";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOnCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(event.currentTarget.checked ? "dark" : "light");
    };

    if (!isMounted) {
        return (
            <IconContainer className="invisible">
                <SunIcon size={32} />
            </IconContainer>
        );
    }

    return (
        <label className={`swap swap-rotate`}>
            <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={handleOnCheck}
            />

            <IconContainer className="swap-off">
                <SunIcon size={32} />
            </IconContainer>

            <IconContainer className="swap-on">
                <MoonIcon size={32} />
            </IconContainer>
        </label>
    );
}
