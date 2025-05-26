import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-32 h-32",
    large: "w-48 h-48"
  };

  return (
    <div className="flex justify-center items-center h-64">
      <DotLottieReact
        src="https://lottie.host/477a6df2-46c7-4ae4-91ea-aeb420b62f22/MDKOgTHwQo.lottie"
        loop
        autoplay
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default Loading;