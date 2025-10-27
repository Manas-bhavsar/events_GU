"use client";

import { useEffect, useMemo, useState } from 'react';
import type { Event, EventFormData } from '@/types/events';
import AdminEventForm from '@/components/AdminEventForm';
import Link from 'next/link';

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function ImageThumb({ filename, alt }: { filename: string; alt: string }) {
  const src = filename ? `/images/${filename}` : '';
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  if (!filename) return (
    <div className="w-32 h-20 bg-white/10 rounded flex items-center justify-center text-xs text-gray-400">No image</div>
  );
  return (
    <div className="w-32 h-20 rounded overflow-hidden bg-white/10 border border-white/10">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt={alt} className="w-full h-full object-cover" onError={() => {
          if (imgSrc !== `/${filename}`) setImgSrc(`/${filename}`); else setError(true);
        }} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 px-2 break-words">{filename}</div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const editingEvent = useMemo(() => events.find(e => e.id === editingId), [events, editingId]);

  async function load() {
    try {
      setLoading(true);
      const data = await api<{ events: Event[] }>(`/api/admin/events`);
      setEvents(data.events);
      setError(null);
    } catch (e: any) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate({ data, visible }: { data: EventFormData; visible?: boolean }) {
    await api<Event>(`/api/admin/events`, {
      method: 'POST',
      body: JSON.stringify({ ...data, visible }),
    });
    setShowCreate(false);
    await load();
  }

  async function handleUpdate({ data, visible }: { data: EventFormData; visible?: boolean }) {
    if (!editingId) return;
    await api<Event>(`/api/admin/events/${editingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data, visible }),
    });
    setEditingId(null);
    await load();
  }

  async function uploadImage(eventId: string, file: File, opts?: { alt?: string; isHero?: boolean }) {
    const fd = new FormData();
    fd.append('file', file);
    if (opts?.alt) fd.append('alt', opts.alt);
    if (typeof opts?.isHero === 'boolean') fd.append('isHero', String(opts.isHero));
    const res = await fetch(`/api/admin/events/${eventId}/images`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(await res.text());
    await load();
  }

  async function deleteImage(eventId: string, imageId: string) {
    await api(`/api/admin/events/${eventId}/images/${imageId}`, { method: 'DELETE' });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await api(`/api/admin/events/${id}`, { method: 'DELETE' });
    await load();
  }

  async function toggleVisibility(id: string, next: boolean) {
    await api(`/api/admin/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ visible: next }),
    });
    await load();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b0f] to-[#141824] py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.35em] text-accent-orange/80 text-xs">Admin</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-accent-orange">Events Manager</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 rounded border border-white/15 text-light hover:bg-white/10 transition">Back to site</Link>
            <button className="px-4 py-2 rounded bg-accent-orange text-white font-semibold hover:bg-[#ff974d] transition shadow-md shadow-accent-orange/30" onClick={() => setShowCreate(v => !v)}>
              {showCreate ? 'Close' : 'Add Event'}
            </button>
          </div>
        </div>

        {showCreate && (
          <div className="rounded-xl p-5 bg-white/5 border border-white/10 shadow-[0_0_40px_-12px_rgba(255,115,0,0.25)]">
            <h2 className="text-xl font-semibold text-light mb-4">Add Event</h2>
            <AdminEventForm onSubmit={handleCreate} submitLabel="Create" />
          </div>
        )}

        {editingEvent && (
          <div className="rounded-xl p-5 bg-white/5 border border-white/10 shadow-[0_0_40px_-12px_rgba(255,115,0,0.25)] space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-light mb-3">Edit Event</h2>
              <AdminEventForm initial={editingEvent} onSubmit={handleUpdate} onCancel={() => setEditingId(null)} submitLabel="Update" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-light mb-2">Images</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(editingEvent.images || []).map(img => (
                    <div key={img.id} className="rounded p-3 bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ImageThumb filename={img.filename} alt={editingEvent.title!} />
                        <div className="text-sm">
                          <div className="font-medium truncate max-w-[12rem] text-light" title={img.filename}>{img.filename}</div>
                          <div className="text-xs text-gray-400">{img.isHero ? 'Hero' : 'Image'} · {new Date(img.uploadedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10" onClick={() => deleteImage(editingEvent.id!, img.id)}>Delete</button>
                    </div>
                  ))}
                  {(editingEvent.images || []).length === 0 && (
                    <div className="text-sm text-gray-400">No images yet.</div>
                  )}
                </div>

                <div className="rounded p-3 bg-white/5 border border-white/10">
                  <form className="flex flex-col md:flex-row items-start md:items-end gap-3" onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"][name="file"]');
                    const altInput = form.querySelector<HTMLInputElement>('input[name="alt"]');
                    const heroInput = form.querySelector<HTMLInputElement>('input[name="isHero"]');
                    const file = fileInput?.files?.[0];
                    if (!file) return;
                    await uploadImage(editingEvent.id!, file, { alt: altInput?.value, isHero: Boolean(heroInput?.checked) });
                    form.reset();
                  }}>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-light">Add Image</label>
                      <input name="file" type="file" accept="image/*" className="block text-light" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-light">Alt Text</label>
                      <input name="alt" className="border border-white/15 bg-transparent text-light rounded px-3 py-2" placeholder="optional" />
                    </div>
                    <label className="flex items-center gap-2 mb-1 text-light">
                      <input name="isHero" type="checkbox" />
                      Make hero
                    </label>
                    <button type="submit" className="px-4 py-2 rounded bg-accent-orange text-black font-semibold hover:bg-[#ff974d] transition">Upload</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-light">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.length === 0 && <div className="text-gray-400">No events yet.</div>}
            {events.map(ev => {
              const poster = (ev.heroPoster || '').replace(/^[@\\s]+/, '');
              return (
                <div key={ev.id} className={`rounded-xl p-4 bg-white/5 border ${ev.visible ? 'border-white/10' : 'border-white/5 opacity-70'}`}>
                  <div className="flex items-start gap-4">
                    <ImageThumb filename={poster} alt={ev.title} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-light font-semibold text-lg">{ev.title}</div>
                          <div className="text-xs text-gray-400">{ev.date} · <span className="text-accent-orange">{ev.category}</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs flex items-center gap-2 text-light/80">
                            <input type="checkbox" checked={Boolean(ev.visible)} onChange={e => toggleVisibility(ev.id, e.target.checked)} />
                            Visible
                          </label>
                          <button className="px-3 py-1 rounded border border-white/15 text-light hover:bg-white/10" onClick={() => setEditingId(ev.id)}>Edit</button>
                          <button className="px-3 py-1 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(ev.id)}>Delete</button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-light/90 line-clamp-3">{ev.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
 