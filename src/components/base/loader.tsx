import { GridLoader } from "react-spinners";

type LoaderProps = {
  isLoading: boolean;
};

export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <BaseLoader isLoading={isLoading}>
      <GridLoader />
    </BaseLoader>
  );
};

export const BaseLoader: React.FC<{isLoading: boolean, children?: React.ReactNode}> = ({ isLoading, children }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-index-1000 flex items-center justify-center bg-background/10 backdrop-blur-sm rounded-lg">
      {children}
    </div>
);
}

export default Loader;