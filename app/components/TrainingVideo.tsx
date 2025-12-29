"use client";

type TrainingVideoProps = {
  source: string;
  poster: string;
  captionSrc: string;
  title?: string;
};

export function TrainingVideo({ source, poster, captionSrc, title }: TrainingVideoProps) {
  return (
    <figure className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-black">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="block w-full h-full"
        aria-label={title || "Football EyeQ training video"}
      >
        <source src={source} type="video/mp4" />
        <track src={captionSrc} kind="captions" srcLang="en" label="English" default />
        Sorry, your browser doesn&apos;t support embedded videos.
      </video>
      {title && (
        <figcaption className="sr-only">{title}</figcaption>
      )}
    </figure>
  );
}

export default TrainingVideo;
