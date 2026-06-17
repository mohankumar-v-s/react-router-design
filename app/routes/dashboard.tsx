// app/routes/dashboard.tsx
import { useEnv } from "~/hooks/useEnv";

export default function Dashboard() {
    const env = useEnv();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Environment: {env.APP_ENV}</p>
            <p>API URL: {env.API_URL}</p>
        </div>
    );
}