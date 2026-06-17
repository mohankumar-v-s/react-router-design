// app/routes/profile.tsx
import { useEnv } from "~/hooks/useEnv";

export default function Profile() {
  const { API_URL, APP_ENV, APP_NAME } = useEnv();

  return (
    <div>
      <h1>{APP_NAME}</h1>
      <span className="badge">{APP_ENV}</span>
    </div>
  );
}