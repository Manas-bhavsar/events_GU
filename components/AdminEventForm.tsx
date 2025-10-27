"use client";

import { useState } from 'react';
import type { Event, EventFormData } from '@/types/events';

type Props = {
  initial?: Partial<Event>;
  onSubmit: (payload: { data: EventFormData; visible?: boolean }) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function AdminEventForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [visible, setVisible] = useState<boolean>(Boolean(initial?.visible));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: EventFormData = { title, description, date, category };
      await onSubmit({ data: payload, visible });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="visible" type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} />
        <label htmlFor="visible" className="text-sm">Visible</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
}
