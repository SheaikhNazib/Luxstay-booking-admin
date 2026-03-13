'use client';

interface Props {
  src: string;
  label?: string;
}

export function OpenImageButton({ src, label = 'Open image' }: Props) {
  function handleOpen() {
    if (src.startsWith('data:')) {
      const [header, data] = src.split(',');
      const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      const bytes = atob(data);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      window.open(src, '_blank');
    }
  }

  return (
    <button className="admin-link-gold" onClick={handleOpen} type="button">
      {label}
    </button>
  );
}
