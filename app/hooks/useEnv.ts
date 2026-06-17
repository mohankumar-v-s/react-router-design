// app/hooks/useEnv.ts
import { useRouteLoaderData } from "react-router";
import type { EnvConfig } from "~/root";

export function useEnv() {
    const data = useRouteLoaderData("root") as { env: EnvConfig };
    return data.env;
}