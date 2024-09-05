import clsx from "clsx";

interface LoadingProps {
  width?: number;
  height?: number;
  className?: string;
}

const Loading = ({ width = 24, height = 24, className }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={clsx(
          `animate-spin rounded-full border-b-2 border-primary w-${width}px h-${height}px`,
          className
        )}
      ></div>
    </div>
  );
};

export default Loading;
