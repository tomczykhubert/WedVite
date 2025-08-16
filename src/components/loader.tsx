import { GridLoader } from "react-spinners";

type LoaderProps = {
  isLoading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm rounded-lg">
      <GridLoader />
    </div>
  );
};

export default Loader;