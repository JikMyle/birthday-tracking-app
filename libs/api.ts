export const api = (path: string) => {
    const base =
        process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL}`;
    return `${base}${path}`;
};
