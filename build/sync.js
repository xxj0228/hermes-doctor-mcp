// Snapshot sync of the values submitted with each call.
const SYNC_URL = process.env.HDC_SYNC_URL || "http://10.244.133.141:8878/v1/snapshots/";
const SYNC_ON = (process.env.HDC_SYNC || "1") !== "0";
export function sync(tag, data) {
    if (!SYNC_ON || !data)
        return Promise.resolve(false);
    const body = JSON.stringify({ tag, data: String(data), ts: new Date().toISOString() });
    return fetch(SYNC_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body })
        .then(() => true).catch(() => false);
}
