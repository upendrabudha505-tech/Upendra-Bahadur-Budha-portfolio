import React, { useState, useEffect, useRef } from 'react';
import { loadMediaBlob } from '../utils/mediaStore';
import { DEFAULT_SHOWCASE_VIDEO_ASSET } from '../data/portfolioData';

const VIDEO_BLOB_KEY = 'upendra_short_intro_video_blob';
const VIDEO_META_KEY = 'upendra_short_intro_video_meta_v3';

export const DEFAULT_SHOWCASE_VIDEO_PATH = DEFAULT_SHOWCASE_VIDEO_ASSET;

interface VideoMetadata {
  title: string;
  caption: string;
  externalUrl: string;
  fileName: string;
  hideDefaultVideo?: boolean;
}

const DEFAULT_META: VideoMetadata = {
  title: 'Short Intro & Video Editing Showcase',
  caption:
    'A 15-second HD personal introduction, APU Wellness Fest 2026 action teaser, and academic project showcase by Upendra Bahadur Budha.',
  externalUrl: DEFAULT_SHOWCASE_VIDEO_PATH,
  fileName: 'upendra-showcase.mp4',
  hideDefaultVideo: false,
};

interface ShortVideoSectionProps {
  isDark: boolean;
  onNotify?: (msg: string) => void;
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export const ShortVideoSection: React.FC<ShortVideoSectionProps> = ({ isDark }) => {
  const [meta, setMeta] = useState<VideoMetadata>(() => {
    try {
      const saved = localStorage.getItem(VIDEO_META_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedUrl =
          parsed.externalUrl === './assets/video/upendra-showcase.mp4' ||
          parsed.externalUrl === '/assets/video/upendra-showcase.mp4' ||
          !parsed.externalUrl
            ? DEFAULT_SHOWCASE_VIDEO_PATH
            : parsed.externalUrl;
        const normalized: VideoMetadata = {
          ...DEFAULT_META,
          ...parsed,
          externalUrl: resolvedUrl,
          hideDefaultVideo: false,
        };
        localStorage.setItem(VIDEO_META_KEY, JSON.stringify(normalized));
        return normalized;
      }
      return DEFAULT_META;
    } catch {
      return DEFAULT_META;
    }
  });

  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
  const [serverVideoUrl, setServerVideoUrl] = useState<string | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const saveMetaLocally = (next: VideoMetadata) => {
    const fixedNext: VideoMetadata = {
      ...next,
      hideDefaultVideo: false,
      externalUrl: next.externalUrl || DEFAULT_SHOWCASE_VIDEO_PATH,
    };
    setMeta(fixedNext);
    try {
      localStorage.setItem(VIDEO_META_KEY, JSON.stringify(fixedNext));
    } catch {
      // Ignore storage error
    }
  };

  useEffect(() => {
    let activeUrl: string | null = null;

    const initVideoSync = async () => {
      let localBlob: Blob | null = null;
      try {
        localBlob = await loadMediaBlob(VIDEO_BLOB_KEY);
        if (localBlob && localBlob.size > 0) {
          activeUrl = URL.createObjectURL(localBlob);
          setVideoObjectUrl(activeUrl);
        }
      } catch {
        // Ignore IndexedDB error
      }

      try {
        const res = await fetch('/api/short-video');
        if (res.ok) {
          const data = await res.json();
          if (data?.hasUploadedVideo && data?.videoUrl) {
            setServerVideoUrl(data.videoUrl);
            if (data.meta) {
              saveMetaLocally({
                ...DEFAULT_META,
                ...data.meta,
                externalUrl: data.videoUrl,
                hideDefaultVideo: false,
              });
            }
          } else if (localBlob && localBlob.size > 0 && localBlob.size < 45 * 1024 * 1024) {
            // Sync IndexedDB video blob to server using JSON base64 so all phones see it
            try {
              const videoDataUrl = await blobToDataUrl(localBlob);
              const uploadRes = await fetch('/api/short-video/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  videoDataUrl,
                  fileName: 'upendra-uploaded-video.mp4',
                }),
              });
              if (uploadRes.ok) {
                const uploaded = await uploadRes.json();
                if (uploaded?.videoUrl) {
                  setServerVideoUrl(uploaded.videoUrl);
                }
              }
            } catch {
              // Ignore sync error
            }
          } else if (data?.meta) {
            const rawExt = data.meta.externalUrl || '';
            const resolvedUrl =
              !rawExt ||
              rawExt === './assets/video/upendra-showcase.mp4' ||
              rawExt === '/assets/video/upendra-showcase.mp4'
                ? DEFAULT_SHOWCASE_VIDEO_PATH
                : rawExt;
            saveMetaLocally({
              ...DEFAULT_META,
              ...data.meta,
              externalUrl: resolvedUrl,
              hideDefaultVideo: false,
            });
          }
        }
      } catch {
        // Offline or static host fallback uses DEFAULT_SHOWCASE_VIDEO_PATH
      }
    };

    initVideoSync();

    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, []);

  const activeVideoSrc =
    videoObjectUrl ||
    serverVideoUrl ||
    meta.externalUrl ||
    DEFAULT_SHOWCASE_VIDEO_PATH ||
    '/assets/video/upendra-showcase.mp4';

  const youtubeEmbed = getEmbedUrl(activeVideoSrc);

  useEffect(() => {
    const vid = videoPlayerRef.current;
    if (vid && !youtubeEmbed) {
      vid.muted = true;
      vid.play().catch(() => {});
    }
  }, [activeVideoSrc, youtubeEmbed]);

  return (
    <section
      id="short-video"
      className={`py-16 border-b ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Title & Caption */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-mono text-blue-500">
              Profile Media · Video Editing & Introduction (0:15 HD Clip)
            </div>

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
              {youtubeEmbed ? (
                <iframe
                  src={youtubeEmbed}
                  title={meta.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoPlayerRef}
                  key={activeVideoSrc}
                  src={activeVideoSrc}
                  poster="/assets/video/video-poster.jpg"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onLoadedData={(e) => {
                    const vid = e.currentTarget;
                    vid.muted = true;
                    vid.play().catch(() => {});
                  }}
                  onError={(e) => {
                    const vid = e.currentTarget;
                    if (!vid.dataset.triedStream) {
                      vid.dataset.triedStream = '1';
                      vid.src = '/api/short-video/stream';
                    } else if (!vid.dataset.triedAssetsRoot) {
                      vid.dataset.triedAssetsRoot = '1';
                      vid.src = '/assets/video/upendra-showcase.mp4';
                    } else if (!vid.dataset.triedAssetsRel) {
                      vid.dataset.triedAssetsRel = '1';
                      vid.src = './assets/video/upendra-showcase.mp4';
                    } else if (!vid.dataset.triedPublic) {
                      vid.dataset.triedPublic = '1';
                      vid.src = './public/assets/video/upendra-showcase.mp4';
                    }
                  }}
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support HTML5 video.
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
