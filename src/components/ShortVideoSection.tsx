import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Upload,
  Trash2,
  Link2,
  Edit3,
  Check,
  X,
} from 'lucide-react';
import { saveMediaBlob, loadMediaBlob, deleteMediaBlob } from '../utils/mediaStore';

const VIDEO_BLOB_KEY = 'upendra_short_intro_video_blob';
const VIDEO_META_KEY = 'upendra_short_intro_video_meta_v1';

interface VideoMetadata {
  title: string;
  caption: string;
  externalUrl: string;
  fileName: string;
}

const DEFAULT_META: VideoMetadata = {
  title: 'Short Intro & Video Editing Showcase',
  caption:
    'A short personal introduction and video editing / content creation sample by Upendra Bahadur Budha.',
  externalUrl: '',
  fileName: '',
};

interface ShortVideoSectionProps {
  isDark: boolean;
  onNotify: (msg: string) => void;
}

function getEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return null;
}

export const ShortVideoSection: React.FC<ShortVideoSectionProps> = ({ isDark, onNotify }) => {
  const [meta, setMeta] = useState<VideoMetadata>(() => {
    try {
      const saved = localStorage.getItem(VIDEO_META_KEY);
      return saved ? { ...DEFAULT_META, ...JSON.parse(saved) } : DEFAULT_META;
    } catch {
      return DEFAULT_META;
    }
  });

  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(true);
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState(meta.title);
  const [tempCaption, setTempCaption] = useState(meta.caption);
  const [tempUrl, setTempUrl] = useState(meta.externalUrl);

  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let activeUrl: string | null = null;
    loadMediaBlob(VIDEO_BLOB_KEY)
      .then((blob) => {
        if (blob) {
          activeUrl = URL.createObjectURL(blob);
          setVideoObjectUrl(activeUrl);
        }
      })
      .finally(() => setIsLoadingVideo(false));

    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, []);

  const saveMeta = (next: VideoMetadata) => {
    setMeta(next);
    try {
      localStorage.setItem(VIDEO_META_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
  };

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      onNotify('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    try {
      await saveMediaBlob(VIDEO_BLOB_KEY, file);
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
      const nextObjUrl = URL.createObjectURL(file);
      setVideoObjectUrl(nextObjUrl);
      const nextMeta = { ...meta, fileName: file.name, externalUrl: '' };
      saveMeta(nextMeta);
      onNotify(`Short video "${file.name}" uploaded and saved.`);
    } catch {
      onNotify('Could not save video file in browser storage.');
    }
    e.target.value = '';
  };

  const handleRemoveVideo = async () => {
    await deleteMediaBlob(VIDEO_BLOB_KEY);
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    setVideoObjectUrl(null);
    const nextMeta = { ...meta, fileName: '', externalUrl: '' };
    saveMeta(nextMeta);
    onNotify('Short video removed.');
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      ...meta,
      title: tempTitle.trim() || DEFAULT_META.title,
      caption: tempCaption.trim() || DEFAULT_META.caption,
    };
    saveMeta(next);
    setIsEditingMeta(false);
    onNotify('Video title and caption updated.');
  };

  const handleSaveExternalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      ...meta,
      externalUrl: tempUrl.trim(),
      fileName: '',
    };
    saveMeta(next);
    setIsUrlInputOpen(false);
    onNotify(tempUrl.trim() ? 'Video link saved.' : 'Video link cleared.');
  };

  const youtubeEmbed = getEmbedUrl(meta.externalUrl);
  const hasVideo = Boolean(videoObjectUrl || meta.externalUrl);

  return (
    <section
      id="short-video"
      className={`py-16 border-b ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Title, Caption, and Easy Video Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-mono text-blue-500">
              Profile Media · Video Editing & Introduction
            </div>

            {!isEditingMeta ? (
              <div className="space-y-3">
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {meta.title}
                </h2>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {meta.caption}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveMeta} className="space-y-3">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Video section title"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <textarea
                  rows={3}
                  value={tempCaption}
                  onChange={(e) => setTempCaption(e.target.value)}
                  placeholder="Short description of your video"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingMeta(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}

            {/* Video Upload & Management Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={handleVideoFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{hasVideo ? 'Change Short Video' : 'Upload Short Video'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempUrl(meta.externalUrl);
                  setIsUrlInputOpen(!isUrlInputOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Paste Video URL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempTitle(meta.title);
                  setTempCaption(meta.caption);
                  setIsEditingMeta(true);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Caption</span>
              </button>

              {hasVideo && (
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'text-rose-400 hover:bg-rose-950/40'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Video</span>
                </button>
              )}
            </div>

            {/* Optional Paste Video URL Input Box */}
            {isUrlInputOpen && (
              <form
                onSubmit={handleSaveExternalUrl}
                className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <label className="block text-xs font-mono text-slate-400">
                  Direct MP4 URL or YouTube Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or direct .mp4 URL"
                    className={`flex-1 px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: 16:9 Video Player Frame */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl border overflow-hidden aspect-video relative flex items-center justify-center ${
                isDark
                  ? 'bg-[#090E1A] border-slate-800 shadow-xl shadow-blue-950/10'
                  : 'bg-slate-100 border-slate-200 shadow-sm'
              }`}
            >
              {isLoadingVideo ? (
                <div className="text-xs font-mono text-slate-500">Loading video player...</div>
              ) : videoObjectUrl ? (
                <video
                  key={videoObjectUrl}
                  src={videoObjectUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : youtubeEmbed ? (
                <iframe
                  src={youtubeEmbed}
                  title={meta.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : meta.externalUrl ? (
                <video
                  key={meta.externalUrl}
                  src={meta.externalUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="p-8 text-center max-w-md space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={`font-display text-base font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Short Intro / Showreel Video Coming Soon
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Upload a short introduction clip or a sample of your video editing & content
                      creation work directly from your device.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Video File (MP4 / WebM / MOV)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
