import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { t } = useTranslation();

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setLocalError(null);

    try {
      const url = await onUpload(file);
      onChange(url);
    } catch {
      setLocalError(t('admin.uploadFailed'));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-sm text-text/80">
        {t('products.title')}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-border/30 hover:border-border rounded-sm h-40 transition-colors disabled:opacity-50 overflow-hidden"
      >
        {value ? (
          <img
            src={value}
            alt="معاينة"
            className="h-full w-full object-cover"
          />
        ) : isUploading ? (
          <Loader2 className="animate-spin text-accent" size={28} />
        ) : (
          <>
            <ImagePlus className="text-accent/70" size={28} />
            <span className="text-sm text-muted">{t('admin.chooseImage')}</span>
          </>
        )}
      </button>

      {(error || localError) && (
        <span className="text-sm text-danger">{error || localError}</span>
      )}
    </div>
  );
}
