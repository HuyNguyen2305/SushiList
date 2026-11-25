import { db } from './db'

export type StorageInfo = { persistGranted: boolean; lastBackupAt?: string; firstRunAt: string }

const DAY = 86_400_000
export const BACKUP_REMINDER_DAYS = 7

const get = async <T>(key: string) => (await db.meta.get(key))?.value as T | undefined
const set = (key: string, value: unknown) => db.meta.put({ key, value })

/** Records the first run and asks the browser to keep this app's storage permanently. Safe to call on every start. */
export async function initStorage(): Promise<StorageInfo> {
  const firstRunAt = (await get<string>('firstRunAt')) ?? new Date().toISOString()
  await set('firstRunAt', firstRunAt)
  let persistGranted = (await get<boolean>('persistGranted')) === true
  if (!persistGranted) {
    persistGranted = (await navigator.storage?.persist?.()) ?? false
    await set('persistGranted', persistGranted)
  }
  return { persistGranted, lastBackupAt: await get<string>('lastBackupAt'), firstRunAt }
}

export const markBackup = () => set('lastBackupAt', new Date().toISOString())

/** Days since the last backup (or since first run if there never was one), once past the reminder limit. */
export function staleBackupDays(info: StorageInfo, now = Date.now()): number | null {
  const days = Math.floor((now - Date.parse(info.lastBackupAt ?? info.firstRunAt)) / DAY)
  return days >= BACKUP_REMINDER_DAYS ? days : null
}
