// app/components/Header.tsx
import { useEnv } from "~/hooks/useEnv";

export function Header() {
    const { APP_NAME, APP_ENV } = useEnv();

    return (
        <header>
            <h1>{APP_NAME}</h1>
            {APP_ENV !== "production" && (
                <span className="env-badge">{APP_ENV}</span>
            )}
        </header>
    );
}