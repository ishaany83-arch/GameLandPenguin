import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentOnlineCount = 1;

export const BACKEND_URL = (((import.meta as any).env?.VITE_API_URL) || '').replace(/\/$/, '');

if (typeof window !== 'undefined') {
  socket = io(BACKEND_URL || window.location.origin, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('⚡ Connected to Gameland Real-Time Socket Server');
  });

  socket.on('users:count', (data: { count: number }) => {
    if (data && typeof data.count === 'number') {
      currentOnlineCount = data.count;
      window.dispatchEvent(new CustomEvent('gameland_online_users_update', { detail: data.count }));
    }
  });

  // Receive synced users database from server
  socket.on('users:synced_all', (serverUsers: Record<string, any>) => {
    if (serverUsers && typeof serverUsers === 'object') {
      try {
        const key = 'unblocked_users_v2';
        const raw = localStorage.getItem(key);
        const existing = raw ? JSON.parse(raw) : {};
        const merged = { ...existing, ...serverUsers };
        localStorage.setItem(key, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('gameland_users_updated', { detail: merged }));
      } catch (e) {
        console.error('Failed to merge server synced users', e);
      }
    }
  });
}

// Client Exported Functions
export function emitSocketUserJoin(username: string) {
  if (socket && socket.connected) {
    socket.emit('user:join', { username });
  }
}

export function getSocketOnlineUserCount(): number {
  return currentOnlineCount;
}

export function emitSocketUserRegister(userRecord: Record<string, any>) {
  if (socket && socket.connected) {
    socket.emit('users:sync_register', { user: userRecord });
  }
}

export function emitSocketUsersSync(users: Record<string, any>) {
  if (socket && socket.connected) {
    socket.emit('users:sync_register', { users });
  }
  // Also perform HTTP backup POST
  if (typeof window !== 'undefined') {
    fetch(`${BACKEND_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users }),
    }).catch(() => {});
  }
}

export async function fetchServerUsersSync(): Promise<Record<string, any> | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const key = 'unblocked_users_v2';
        const raw = localStorage.getItem(key);
        const existing = raw ? JSON.parse(raw) : {};
        const merged = { ...existing, ...data };
        localStorage.setItem(key, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('gameland_users_updated', { detail: merged }));
        return merged;
      }
    }
  } catch (err) {
    console.error('Failed to fetch user accounts sync from server', err);
  }
  return null;
}
